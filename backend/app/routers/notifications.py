"""In-app notifications, scoped to the authenticated caller."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import NotificationRead
from app.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])

_LIMIT_QUERY = Query(default=50, ge=1, le=200)
_OFFSET_QUERY = Query(default=0, ge=0)


@router.get("", response_model=list[NotificationRead])
async def list_notifications(
    limit: int = _LIMIT_QUERY,
    offset: int = _OFFSET_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Notification]:
    return (
        db.query(models.Notification)
        .filter(models.Notification.user_id == current_user.id)
        .order_by(models.Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.patch("/{id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_notification_read(
    id: uuid.UUID,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> Response:
    notification = db.query(models.Notification).filter(models.Notification.id == id).first()
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    notification.is_read = True
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
