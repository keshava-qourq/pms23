"""Cached personal and team dashboards."""

import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.errors import TEAM_DASHBOARD_EMPLOYEE_NOT_FOUND, TEAM_DASHBOARD_FORBIDDEN
from app.schemas import StubResponse, TeamDashboardResponse
from app.scoping import is_in_reporting_line
from app.security import get_current_user
from app.services import team_dashboard_reports

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

_EMPLOYEE_ID_QUERY = Query(
    default=None,
    alias="employee_id",
    description="Whose direct reports to show; defaults to the signed-in manager.",
)


@router.get("/me", response_model=StubResponse)
async def personal_dashboard() -> StubResponse:
    return StubResponse(endpoint="GET /dashboard/me")


@router.get(
    "/team",
    response_model=TeamDashboardResponse,
    responses={
        TEAM_DASHBOARD_EMPLOYEE_NOT_FOUND.status_code: {
            "description": TEAM_DASHBOARD_EMPLOYEE_NOT_FOUND.detail
        },
        TEAM_DASHBOARD_FORBIDDEN.status_code: {"description": TEAM_DASHBOARD_FORBIDDEN.detail},
    },
)
async def team_dashboard(
    employee_id: uuid.UUID | None = _EMPLOYEE_ID_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> TeamDashboardResponse:
    """AC-038: the signed-in manager's direct reports with their goals and
    progress, read through a cached aggregate. AC-039: naming an
    `employee_id` outside the caller's reporting line (and outside HR
    admin's whole-company reach) is denied rather than answered."""
    target_id = employee_id if employee_id is not None else current_user.id
    if employee_id is not None and employee_id != current_user.id:
        target = db.query(models.User).filter(models.User.id == employee_id).first()
        if target is None:
            raise TEAM_DASHBOARD_EMPLOYEE_NOT_FOUND
        authorized = current_user.role == "hr_admin" or is_in_reporting_line(
            db, current_user.id, employee_id
        )
        if not authorized:
            raise TEAM_DASHBOARD_FORBIDDEN
    reports = team_dashboard_reports(db, target_id)
    return TeamDashboardResponse(reports=reports)
