"""The shared audit write path (NFR-004): every create, edit and deactivate
across this application calls `record_change` in the same transaction as the
change it records, so the audit row never exists without the change, or the
change without the row.
"""

import uuid
from typing import Any

from sqlalchemy.orm import Session

from app import models


def _diff(before: dict[str, Any] | None, after: dict[str, Any] | None) -> dict[str, Any]:
    """Field-level before/after for every key either side mentions. A field
    that didn't change is left out, so the stored diff only ever names what
    actually moved."""
    keys = set((before or {}).keys()) | set((after or {}).keys())
    changes: dict[str, Any] = {}
    for key in keys:
        old = (before or {}).get(key)
        new = (after or {}).get(key)
        if old != new:
            changes[key] = {"before": old, "after": new}
    return changes


def record_change(
    db: Session,
    actor: models.User | None,
    entity_type: str,
    entity_id: uuid.UUID,
    action: str,
    before: dict[str, Any] | None = None,
    after: dict[str, Any] | None = None,
) -> models.AuditLog:
    """Adds (but does not commit) an audit row capturing who (`actor`), what
    (`entity_type`/`entity_id`), the action, and a field-level before/after.
    The caller commits -- together with the change itself -- so the two never
    diverge."""
    entry = models.AuditLog(
        actor_id=actor.id if actor is not None else None,
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        changes=_diff(before, after),
    )
    db.add(entry)
    return entry
