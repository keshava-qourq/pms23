"""In-app notifications (AC-034): list the caller's own, and dismiss one."""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.errors import NOTIFICATION_FORBIDDEN, NOTIFICATION_NOT_FOUND
from app.schemas import NotificationRead
from app.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationRead])
async def list_notifications(
    user: models.User = Depends(get_current_user),  # noqa: B008
    db: Session = Depends(get_db),  # noqa: B008
) -> list[models.Notification]:
    """The caller's own notifications, newest first -- never another user's
    (scoped by the signed-in user, never by anything the request names)."""
    return (
        db.query(models.Notification)
        .filter(models.Notification.user_id == user.id)
        .order_by(models.Notification.created_at.desc())
        .all()
    )


@router.patch(
    "/{id}/read",
    response_model=NotificationRead,
    responses={
        NOTIFICATION_NOT_FOUND.status_code: {"description": NOTIFICATION_NOT_FOUND.detail},
        NOTIFICATION_FORBIDDEN.status_code: {"description": NOTIFICATION_FORBIDDEN.detail},
    },
)
async def mark_notification_read(
    id: str,
    user: models.User = Depends(get_current_user),  # noqa: B008
    db: Session = Depends(get_db),  # noqa: B008
) -> models.Notification:
    """Marks/dismisses one of the caller's own notifications as read."""
    try:
        notification_id = uuid.UUID(id)
    except ValueError:
        raise NOTIFICATION_NOT_FOUND from None

    notification = (
        db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    )
    if notification is None:
        raise NOTIFICATION_NOT_FOUND
    if notification.user_id != user.id:
        raise NOTIFICATION_FORBIDDEN

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
