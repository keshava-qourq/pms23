"""Cached personal and team dashboards (US-014).

GET /dashboard/team (AC-038, AC-039): each of the named employee's (or, with
none named, the caller's own) direct reports together with their goals and
progress, wrapped as `{reports: [...]}` per the approved API spec. Naming
someone outside the caller's own reporting line is a 403 (AC-039); naming an
unknown employee id is a 404; an hr_admin may name anyone.
"""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import StubResponse
from app.scoping import is_in_reporting_line
from app.security import get_current_user
from app.services import team_dashboard_reports

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/me", response_model=StubResponse)
async def personal_dashboard() -> StubResponse:
    return StubResponse(endpoint="GET /dashboard/me")


@router.get("/team")
async def team_dashboard(
    employee_id: uuid.UUID | None = Query(default=None),
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> dict[str, Any]:
    target_id = employee_id if employee_id is not None else current_user.id

    if employee_id is not None and employee_id != current_user.id:
        target = db.query(models.User).filter(models.User.id == employee_id).first()
        if target is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
        authorized = current_user.role == "hr_admin" or is_in_reporting_line(
            db, current_user.id, employee_id
        )
        if not authorized:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return {"reports": team_dashboard_reports(db, target_id)}
