"""Goals, their progress and their check-ins."""

import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import (
    CheckInCreate,
    CheckInRead,
    GoalCreate,
    GoalProgressUpdate,
    GoalRead,
    GoalUpdate,
)
from app.scoping import is_in_reporting_line, visible_owner_ids
from app.security import get_current_user

router = APIRouter(tags=["goals"])

_LIMIT_QUERY = Query(default=50, ge=1, le=200)
_OFFSET_QUERY = Query(default=0, ge=0)


def _get_goal_or_404(db: Session, goal_id: uuid.UUID) -> models.Goal:
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if goal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


def _get_objective_or_404(db: Session, objective_id: uuid.UUID) -> models.Objective:
    objective = db.query(models.Objective).filter(models.Objective.id == objective_id).first()
    if objective is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Objective not found")
    return objective


def _authorize_goal_access(db: Session, current_user: models.User, goal: models.Goal) -> None:
    """A caller may read or write a goal when they are HR admin, the goal's
    owner, or a manager somewhere above the owner in the reporting line.
    Executives are read-only elsewhere and never pass here (goal writes are
    never theirs to make)."""
    if current_user.role == "executive":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    if current_user.role == "hr_admin":
        return
    if goal.owner_id == current_user.id:
        return
    if current_user.role == "manager" and is_in_reporting_line(db, current_user.id, goal.owner_id):
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")


@router.post("/goals", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
async def create_goal(
    payload: GoalCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    if current_user.role == "executive":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    owner_id = payload.owner_id or current_user.id
    if owner_id != current_user.id:
        owner = db.query(models.User).filter(models.User.id == owner_id).first()
        if owner is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")
        authorized = current_user.role == "hr_admin" or (
            current_user.role == "manager" and is_in_reporting_line(db, current_user.id, owner_id)
        )
        if not authorized:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    if payload.parent_objective_id is not None:
        _get_objective_or_404(db, payload.parent_objective_id)

    goal = models.Goal(
        owner_id=owner_id,
        created_by=current_user.id,
        parent_objective_id=payload.parent_objective_id,
        title=payload.title,
        description=payload.description,
        target_metric=payload.target_metric,
        progress_type=payload.progress_type,
        due_date=payload.due_date,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/goals", response_model=list[GoalRead])
async def list_goals(
    limit: int = _LIMIT_QUERY,
    offset: int = _OFFSET_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Goal]:
    owner_ids = visible_owner_ids(db, current_user)
    query = db.query(models.Goal)
    if owner_ids is not None:
        query = query.filter(models.Goal.owner_id.in_(owner_ids))
    return query.order_by(models.Goal.created_at.desc()).offset(offset).limit(limit).all()


@router.put("/goals/{id}", response_model=GoalRead)
async def update_goal(
    id: uuid.UUID,
    payload: GoalUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    goal = _get_goal_or_404(db, id)
    _authorize_goal_access(db, current_user, goal)

    fields_set = payload.model_fields_set
    if "parent_objective_id" in fields_set and payload.parent_objective_id is not None:
        _get_objective_or_404(db, payload.parent_objective_id)

    if "title" in fields_set and payload.title is not None:
        goal.title = payload.title
    if "description" in fields_set:
        goal.description = payload.description
    if "target_metric" in fields_set and payload.target_metric is not None:
        goal.target_metric = payload.target_metric
    if "due_date" in fields_set and payload.due_date is not None:
        goal.due_date = payload.due_date
    if "parent_objective_id" in fields_set:
        goal.parent_objective_id = payload.parent_objective_id

    db.commit()
    db.refresh(goal)
    return goal


@router.patch("/goals/{id}/progress", response_model=GoalRead)
async def update_goal_progress(
    id: uuid.UUID,
    payload: GoalProgressUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    goal = _get_goal_or_404(db, id)
    _authorize_goal_access(db, current_user, goal)

    if payload.progress_percent is not None and goal.progress_type != "percent":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="progress_percent only applies to percent-tracked goals",
        )
    if payload.status is not None and goal.progress_type != "status":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="status only applies to status-tracked goals",
        )

    if payload.progress_percent is not None:
        goal.progress_percent = payload.progress_percent
    if payload.status is not None:
        goal.status = payload.status
        goal.completed_at = datetime.now(UTC) if payload.status == "Completed" else None

    db.commit()
    db.refresh(goal)
    return goal


@router.post(
    "/goals/{id}/check-ins", response_model=CheckInRead, status_code=status.HTTP_201_CREATED
)
async def add_check_in(
    id: uuid.UUID,
    payload: CheckInCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.CheckIn:
    goal = _get_goal_or_404(db, id)
    _authorize_goal_access(db, current_user, goal)

    check_in = models.CheckIn(goal_id=goal.id, author_id=current_user.id, note=payload.note)
    db.add(check_in)
    db.commit()
    db.refresh(check_in)
    return check_in


@router.get("/goals/{id}/check-ins", response_model=list[CheckInRead])
async def list_check_ins(
    id: uuid.UUID,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.CheckIn]:
    goal = _get_goal_or_404(db, id)
    _authorize_goal_access(db, current_user, goal)

    return (
        db.query(models.CheckIn)
        .filter(models.CheckIn.goal_id == goal.id)
        .order_by(models.CheckIn.created_at.desc())
        .all()
    )
