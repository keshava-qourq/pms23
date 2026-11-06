"""HR admin: employee records, reporting lines, exports and GDPR deletion."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import (
    EmployeeCreate,
    EmployeeRead,
    EmployeeUpdate,
    ManagerAssignment,
    PersonalDataDeleteRequest,
    StubResponse,
)
from app.scoping import is_in_reporting_line, would_create_cycle
from app.security import get_current_user, require_roles

router = APIRouter(prefix="/employees", tags=["employees"])


def _get_employee_or_404(db: Session, employee_id: uuid.UUID) -> models.User:
    employee = db.query(models.User).filter(models.User.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.post("", response_model=StubResponse)
async def create_employee(payload: EmployeeCreate) -> StubResponse:
    return StubResponse(endpoint="POST /employees")


@router.put("/{id}", response_model=StubResponse)
async def update_employee(id: str, payload: EmployeeUpdate) -> StubResponse:
    return StubResponse(endpoint="PUT /employees/{id}")


@router.post("/{id}/deactivate", response_model=StubResponse)
async def deactivate_employee(id: str) -> StubResponse:
    return StubResponse(endpoint="POST /employees/{id}/deactivate")


@router.put("/{id}/manager", response_model=EmployeeRead)
async def set_manager(
    id: uuid.UUID,
    payload: ManagerAssignment,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> models.User:
    employee = _get_employee_or_404(db, id)
    _get_employee_or_404(db, payload.manager_id)  # 404s on an unknown manager id

    if would_create_cycle(db, id, payload.manager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigning this manager would create a reporting-line cycle",
        )

    previous_manager_id = employee.manager_id
    employee.manager_id = payload.manager_id
    db.add(
        models.AuditLog(
            actor_id=current_user.id,
            entity_type="reporting_line",
            entity_id=employee.id,
            action="manager_changed",
            changes={
                "previous_manager_id": str(previous_manager_id) if previous_manager_id else None,
                "new_manager_id": str(payload.manager_id),
            },
        )
    )
    db.commit()
    db.refresh(employee)
    return employee


@router.get("/{id}/reports", response_model=list[EmployeeRead])
async def list_direct_reports(
    id: uuid.UUID,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.User]:
    employee = _get_employee_or_404(db, id)
    authorized = (
        current_user.role == "hr_admin"
        or current_user.id == employee.id
        or is_in_reporting_line(db, current_user.id, employee.id)
    )
    if not authorized:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return (
        db.query(models.User)
        .filter(models.User.manager_id == employee.id)
        .order_by(models.User.name)
        .all()
    )


@router.get("/{id}/export", response_model=StubResponse)
async def export_employee(id: str) -> StubResponse:
    return StubResponse(endpoint="GET /employees/{id}/export")


@router.delete("/{id}/personal-data", status_code=status.HTTP_204_NO_CONTENT)
async def delete_personal_data(id: str, payload: PersonalDataDeleteRequest) -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)
