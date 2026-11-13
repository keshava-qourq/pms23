"""HR admin: employee records, reporting lines, exports and GDPR deletion."""

import json
import secrets
import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models
from app.audit import record_change
from app.database import get_db
from app.schemas import (
    EmployeeCreate,
    EmployeeRead,
    EmployeeUpdate,
    ManagerAssignment,
    PersonalDataDeleteRequest,
)
from app.scoping import is_in_reporting_line, would_create_cycle
from app.security import get_current_user, hash_password, require_roles

router = APIRouter(prefix="/employees", tags=["employees"])


def _get_employee_or_404(db: Session, employee_id: uuid.UUID) -> models.User:
    employee = db.query(models.User).filter(models.User.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
async def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> models.User:
    existing = (
        db.query(models.User).filter(func.lower(models.User.email) == payload.email.lower()).first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="An employee with this email exists"
        )
    if payload.manager_id is not None:
        _get_employee_or_404(db, payload.manager_id)

    employee = models.User(
        name=payload.name,
        email=payload.email,
        role=payload.role,
        manager_id=payload.manager_id,
        password_hash=hash_password(secrets.token_urlsafe(24)),
        is_active=True,
    )
    db.add(employee)
    db.flush()
    record_change(
        db,
        current_user,
        "employee",
        employee.id,
        "created",
        before=None,
        after={"name": employee.name, "email": employee.email, "role": employee.role},
    )
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{id}", response_model=EmployeeRead)
async def update_employee(
    id: uuid.UUID,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> models.User:
    employee = _get_employee_or_404(db, id)

    if payload.email is not None and payload.email.lower() != employee.email.lower():
        existing = (
            db.query(models.User)
            .filter(func.lower(models.User.email) == payload.email.lower())
            .first()
        )
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="An employee with this email exists"
            )

    before = {"name": employee.name, "email": employee.email, "role": employee.role}
    if payload.name is not None:
        employee.name = payload.name
    if payload.email is not None:
        employee.email = payload.email
    if payload.role is not None:
        employee.role = payload.role
    after = {"name": employee.name, "email": employee.email, "role": employee.role}

    record_change(db, current_user, "employee", employee.id, "updated", before=before, after=after)
    db.commit()
    db.refresh(employee)
    return employee


@router.post("/{id}/deactivate", response_model=EmployeeRead)
async def deactivate_employee(
    id: uuid.UUID,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> models.User:
    employee = _get_employee_or_404(db, id)
    before = {"is_active": employee.is_active}
    employee.is_active = False
    record_change(
        db,
        current_user,
        "employee",
        employee.id,
        "deactivated",
        before=before,
        after={"is_active": False},
    )
    db.commit()
    db.refresh(employee)
    return employee


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
    entry = record_change(
        db,
        current_user,
        "reporting_line",
        employee.id,
        "manager_changed",
        before={"manager_id": str(previous_manager_id) if previous_manager_id else None},
        after={"manager_id": str(payload.manager_id)},
    )
    entry.changes = {
        "previous_manager_id": str(previous_manager_id) if previous_manager_id else None,
        "new_manager_id": str(payload.manager_id),
    }
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


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value is not None else None


@router.get("/{id}/export")
async def export_employee(
    id: uuid.UUID,
    db: Session = Depends(get_db),  # noqa: B008
    _current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> Response:
    employee = _get_employee_or_404(db, id)

    goals = db.query(models.Goal).filter(models.Goal.owner_id == employee.id).all()
    goal_ids = [g.id for g in goals]
    check_ins = (
        db.query(models.CheckIn).filter(models.CheckIn.goal_id.in_(goal_ids)).all()
        if goal_ids
        else []
    )
    praise_received = (
        db.query(models.Praise).filter(models.Praise.recipient_id == employee.id).all()
    )
    audit_entries = (
        db.query(models.AuditLog)
        .filter(
            models.AuditLog.entity_type == "employee",
            models.AuditLog.entity_id == employee.id,
        )
        .order_by(models.AuditLog.created_at.desc())
        .all()
    )

    body = {
        "employee": {
            "id": str(employee.id),
            "name": employee.name,
            "email": employee.email,
            "role": employee.role,
            "manager_id": str(employee.manager_id) if employee.manager_id else None,
            "is_active": employee.is_active,
            "anonymised_at": _iso(employee.anonymised_at),
            "created_at": _iso(employee.created_at),
        },
        "goals": [
            {
                "id": str(g.id),
                "title": g.title,
                "description": g.description,
                "target_metric": g.target_metric,
                "progress_type": g.progress_type,
                "progress_percent": g.progress_percent,
                "status": g.status,
                "due_date": g.due_date.isoformat() if g.due_date else None,
                "created_at": _iso(g.created_at),
            }
            for g in goals
        ],
        "check_ins": [
            {
                "id": str(c.id),
                "goal_id": str(c.goal_id),
                "note": c.note,
                "created_at": _iso(c.created_at),
            }
            for c in check_ins
        ],
        "praise_received": [
            {
                "id": str(p.id),
                "sender_id": str(p.sender_id),
                "message": p.message,
                "created_at": _iso(p.created_at),
            }
            for p in praise_received
        ],
        "audit": [
            {
                "id": str(a.id),
                "action": a.action,
                "entity_type": a.entity_type,
                "changes": a.changes,
                "created_at": _iso(a.created_at),
            }
            for a in audit_entries
        ],
    }
    return Response(
        content=json.dumps(body),
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="employee-{employee.id}.json"'},
    )


@router.delete("/{id}/personal-data", status_code=status.HTTP_204_NO_CONTENT)
async def delete_personal_data(
    id: uuid.UUID,
    payload: PersonalDataDeleteRequest,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> Response:
    employee = _get_employee_or_404(db, id)
    before = {"name": employee.name, "email": employee.email}
    old_name, old_email = employee.name, employee.email

    employee.name = "Anonymised User"
    employee.email = f"anonymised-{employee.id}@deleted.invalid"
    employee.password_hash = hash_password(secrets.token_urlsafe(32))
    employee.is_active = False
    employee.anonymised_at = datetime.now(UTC)

    after = {"name": employee.name, "email": employee.email, "reason": payload.reason}
    record_change(
        db,
        current_user,
        "employee",
        employee.id,
        "personal_data_deleted",
        before=before,
        after=after,
    )

    # The user row is now anonymised, but the real name/email were already
    # baked as literal text into other tables (praise notifications, and
    # earlier audit-log before/after snapshots of this same employee).
    # Anonymising only the users row would leave the deleted PII readable
    # there forever, defeating the point of this endpoint -- scrub both.
    _scrub_praise_notifications(db, employee.id, old_name, employee.name)
    _scrub_audit_history(db, employee.id, old_name, employee.name, old_email, employee.email)

    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def _scrub_praise_notifications(
    db: Session, employee_id: uuid.UUID, old_name: str, new_name: str
) -> None:
    """Notifications created by `send_praise` bake the sender's name as
    literal text into the message (see routers/praise.py). Replace it so a
    deleted sender's real name does not remain readable there."""
    sent_praise_ids = [
        row.id
        for row in db.query(models.Praise.id).filter(models.Praise.sender_id == employee_id).all()
    ]
    if not sent_praise_ids:
        return
    notifications = (
        db.query(models.Notification)
        .filter(
            models.Notification.type == "praise",
            models.Notification.message.contains(old_name),
        )
        .all()
    )
    for note in notifications:
        note.message = note.message.replace(old_name, new_name)


def _redact(value, old_name: str, new_name: str, old_email: str, new_email: str):
    if isinstance(value, dict):
        return {k: _redact(v, old_name, new_name, old_email, new_email) for k, v in value.items()}
    if isinstance(value, list):
        return [_redact(v, old_name, new_name, old_email, new_email) for v in value]
    if value == old_name:
        return new_name
    if value == old_email:
        return new_email
    return value


def _scrub_audit_history(
    db: Session,
    employee_id: uuid.UUID,
    old_name: str,
    new_name: str,
    old_email: str,
    new_email: str,
) -> None:
    """Earlier audit-log rows for this employee (created/updated/...) store
    the original name/email forever in their before/after snapshot. Redact
    those values in place so the 'deleted' PII does not remain readable in
    the audit trail."""
    rows = (
        db.query(models.AuditLog)
        .filter(
            models.AuditLog.entity_type == "employee",
            models.AuditLog.entity_id == employee_id,
        )
        .all()
    )
    for row in rows:
        if not row.changes:
            continue
        row.changes = _redact(row.changes, old_name, new_name, old_email, new_email)
