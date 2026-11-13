"""HR admin: the audit trail of who changed what and when."""

from datetime import UTC, date, datetime, time

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import AuditLogEntry
from app.security import require_roles

router = APIRouter(tags=["audit"])

_ENTITY_QUERY = Query(default=None)
_FROM_QUERY = Query(default=None, alias="from")
_TO_QUERY = Query(default=None, alias="to")
_LIMIT_QUERY = Query(default=50, ge=1, le=200)
_OFFSET_QUERY = Query(default=0, ge=0)


@router.get("/audit-log", response_model=list[AuditLogEntry])
async def list_audit_log(
    entity: str | None = _ENTITY_QUERY,
    from_date: date | None = _FROM_QUERY,
    to_date: date | None = _TO_QUERY,
    limit: int = _LIMIT_QUERY,
    offset: int = _OFFSET_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    _current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> list[AuditLogEntry]:
    query = db.query(models.AuditLog, models.User.name).outerjoin(
        models.User, models.AuditLog.actor_id == models.User.id
    )
    if entity:
        query = query.filter(models.AuditLog.entity_type == entity)
    if from_date:
        query = query.filter(
            models.AuditLog.created_at >= datetime.combine(from_date, time.min, tzinfo=UTC)
        )
    if to_date:
        query = query.filter(
            models.AuditLog.created_at <= datetime.combine(to_date, time.max, tzinfo=UTC)
        )
    rows = query.order_by(models.AuditLog.created_at.desc()).offset(offset).limit(limit).all()
    return [
        AuditLogEntry(
            id=log.id,
            actor_id=log.actor_id,
            actor_name=actor_name,
            entity_type=log.entity_type,
            entity_id=log.entity_id,
            action=log.action,
            changes=log.changes,
            created_at=log.created_at,
        )
        for log, actor_name in rows
    ]
