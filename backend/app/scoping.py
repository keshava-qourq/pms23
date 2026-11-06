"""Manager/employee reporting-line scoping helpers.

NFR-001: one reusable place for "who may see whom" along the reporting line,
so later feature routers (dashboard, goals, ...) filter their own reads
through this instead of each re-deriving the walk. NFR-009: the walk is a
bounded recursive query up the indexed `manager_id` column, not an
unbounded Python loop over every employee.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models


def _ancestor_chain_ids(db: Session, start_id: uuid.UUID) -> set[uuid.UUID]:
    """`start_id` and everyone above it in the reporting line, found by
    walking `manager_id` upward. Bounded by the chain's depth, not the size
    of the table -- stays cheap at 1,000 employees."""
    user = models.User
    base = select(user.id, user.manager_id).where(user.id == start_id).cte(
        "ancestor_chain", recursive=True
    )
    walked = base.alias()
    recursive = select(user.id, user.manager_id).join(walked, user.id == walked.c.manager_id)
    cte = base.union_all(recursive)
    rows = db.execute(select(cte.c.id)).all()
    return {row.id for row in rows}


def would_create_cycle(
    db: Session, employee_id: uuid.UUID, candidate_manager_id: uuid.UUID
) -> bool:
    """True when making `candidate_manager_id` the manager of `employee_id`
    would create a cycle: self-assignment, or `employee_id` already sitting
    above `candidate_manager_id` in the reporting line (so the assignment
    would close a loop, direct or longer)."""
    if employee_id == candidate_manager_id:
        return True
    chain = _ancestor_chain_ids(db, candidate_manager_id)
    return employee_id in chain


def is_in_reporting_line(db: Session, manager_id: uuid.UUID, employee_id: uuid.UUID) -> bool:
    """True when `manager_id` is `employee_id` itself or sits above them,
    directly or transitively, in the reporting line."""
    chain = _ancestor_chain_ids(db, employee_id)
    return manager_id in chain
