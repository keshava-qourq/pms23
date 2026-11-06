"""Praise: peer recognition notes, with an in-app notification to the
recipient (AC-040). Scoped to the caller: `GET /praise/received` only ever
reads the authenticated caller's own praise (AC-004, AC-042, AC-043), and
executives -- read-only everywhere else in this app (NFR-001) -- may not
send praise either (AC-006).
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import PraiseCreate, PraiseRead
from app.security import get_current_user

router = APIRouter(prefix="/praise", tags=["praise"])

_LIMIT_QUERY = Query(default=50, ge=1, le=200)
_OFFSET_QUERY = Query(default=0, ge=0)


@router.post("", response_model=PraiseRead, status_code=status.HTTP_201_CREATED)
async def send_praise(
    payload: PraiseCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Praise:
    if current_user.role == "executive":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    recipient = db.query(models.User).filter(models.User.id == payload.recipient_id).first()
    if recipient is None or not recipient.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipient must be an active employee",
        )

    praise = models.Praise(
        sender_id=current_user.id,
        recipient_id=recipient.id,
        message=payload.message,
    )
    db.add(praise)
    db.flush()
    db.add(
        models.Notification(
            user_id=recipient.id,
            type="praise",
            message=f"{current_user.name} sent you praise: {payload.message}",
        )
    )
    db.commit()
    db.refresh(praise)
    return praise


@router.get("/received", response_model=list[PraiseRead])
async def received_praise(
    limit: int = _LIMIT_QUERY,
    offset: int = _OFFSET_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Praise]:
    return (
        db.query(models.Praise)
        .filter(models.Praise.recipient_id == current_user.id)
        .order_by(models.Praise.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
