"""HR admin: the audit trail of who changed what and when."""

from datetime import UTC, date, datetime, time

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.security import require_roles

router = APIRouter(tags=["audit"])

_ENTITY_QUERY = Query(default=None)
_FROM_QUERY = Query(default=None, alias="from")
_TO_QUERY = Query(default=None, alias="to")
_LIMIT_QUERY = Query(default=50, ge=1, le=200)
_OFFSET_QUERY = Query(default=0, ge=0)


@router.get("/audit-log")
async def list_audit_log(
    entity: str | None = _ENTITY_QUERY,
    from_date: date | None = _FROM_QUERY,
    to_date: date | None = _TO_QUERY,
    limit: int = _LIMIT_QUERY,
    offset: int = _OFFSET_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    _current_user: models.User = Depends(require_roles("hr_admin")),  # noqa: B008
) -> list[dict]:
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
        {
            "id": str(entry.id),
            "actor_id": str(entry.actor_id) if entry.actor_id else None,
            "actor_name": actor_name,
            "entity_type": entry.entity_type,
            "entity_id": str(entry.entity_id),
            "action": entry.action,
            "changes": entry.changes,
            "created_at": entry.created_at.isoformat(),
        }
        for entry, actor_name in rows
    ]
