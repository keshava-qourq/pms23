"""Cached personal and team dashboards (NFR-001, NFR-009).

Every aggregate here is computed from PostgreSQL (NFR-006) and, for the
organisation-wide HR admin view, cached in Redis for a short time; a missing
cache key just means the next read recomputes it, never that the read fails.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app import models
from app.cache import get_cached, set_cached
from app.database import get_db
from app.schemas import DashboardSummary, GoalSummary, TeamDashboardResponse
from app.scoping import is_in_reporting_line
from app.security import get_current_user, require_roles

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

_TEAM_CACHE_KEY = "dashboard:team:org"
_TEAM_CACHE_TTL = 60
_EMPLOYEE_ID_QUERY = Query(default=None)


def _employee_summary(db: Session, employee: models.User) -> DashboardSummary:
    """One employee's goal counts and average progress, aggregated in SQL,
    plus the goal rows themselves for display."""
    total, completed, average = (
        db.query(
            func.count(models.Goal.id),
            func.sum(case((models.Goal.status == "Completed", 1), else_=0)),
            func.avg(models.Goal.progress_percent),
        )
        .filter(models.Goal.owner_id == employee.id)
        .one()
    )
    goals = (
        db.query(models.Goal)
        .filter(models.Goal.owner_id == employee.id)
        .order_by(models.Goal.due_date)
        .all()
    )
    return DashboardSummary(
        employee_id=employee.id,
        name=employee.name,
        total_goals=total or 0,
        completed_goals=int(completed or 0),
        average_progress=round(float(average), 2) if average is not None else 0.0,
        goals=[
            GoalSummary(
                id=g.id,
                title=g.title,
                status=g.status,
                progress_percent=g.progress_percent,
                due_date=g.due_date,
            )
            for g in goals
        ],
    )


@router.get("/me", response_model=DashboardSummary)
async def personal_dashboard(
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> DashboardSummary:
    """AC-004: every role sees only their own data here, because the owner
    is always the verified caller, never a request parameter."""
    return _employee_summary(db, current_user)


@router.get("/team", response_model=TeamDashboardResponse)
async def team_dashboard(
    employee_id: uuid.UUID | None = _EMPLOYEE_ID_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(require_roles("manager", "hr_admin")),  # noqa: B008
) -> TeamDashboardResponse:
    """AC-005: a manager's default view is their own reporting line; asking
    for a specific employee outside it is a 403, never a quiet empty result.
    AC-007: an HR admin may ask for anyone, or omit `employee_id` for an
    organisation-wide view."""
    if employee_id is not None:
        employee = db.query(models.User).filter(models.User.id == employee_id).first()
        if employee is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
        authorized = current_user.role == "hr_admin" or is_in_reporting_line(
            db, current_user.id, employee_id
        )
        if not authorized:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return TeamDashboardResponse(reports=[_employee_summary(db, employee)])

    if current_user.role == "hr_admin":
        cached = get_cached(_TEAM_CACHE_KEY)
        if cached is not None:
            return TeamDashboardResponse.model_validate(cached)
        employees = (
            db.query(models.User)
            .filter(models.User.is_active.is_(True))
            .order_by(models.User.name)
            .all()
        )
        response = TeamDashboardResponse(reports=[_employee_summary(db, e) for e in employees])
        set_cached(_TEAM_CACHE_KEY, response.model_dump(mode="json"), ttl=_TEAM_CACHE_TTL)
        return response

    employees = (
        db.query(models.User)
        .filter(models.User.manager_id == current_user.id)
        .order_by(models.User.name)
        .all()
    )
    return TeamDashboardResponse(reports=[_employee_summary(db, e) for e in employees])
