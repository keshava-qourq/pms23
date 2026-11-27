"""In-app notifications (US-012.2, AC-034).

GET /notifications lists the caller's own notifications, newest first.
PATCH /notifications/{id}/read dismisses one of them: 404 for an id that is
not a valid identifier or that names no row, 403 for a row that belongs to
someone else.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import NotificationRead
from app.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationRead])
async def list_notifications(
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Notification]:
    return (
        db.query(models.Notification)
        .filter(models.Notification.user_id == current_user.id)
        .order_by(models.Notification.created_at.desc())
        .all()
    )


def _get_notification_or_404(db: Session, id: str) -> models.Notification:
    try:
        notification_id = uuid.UUID(str(id))
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        ) from None
    notification = (
        db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    )
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification


@router.patch("/{id}/read", response_model=NotificationRead)
async def mark_notification_read(
    id: str,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Notification:
    notification = _get_notification_or_404(db, id)
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
