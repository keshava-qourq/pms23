"""Praise: peer recognition notes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import PraiseCreate, PraiseRead
from app.security import get_current_user

router = APIRouter(prefix="/praise", tags=["praise"])


@router.post("", response_model=PraiseRead, status_code=status.HTTP_201_CREATED)
async def send_praise(
    payload: PraiseCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Praise:
    if not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="message must not be empty"
        )
    recipient = db.query(models.User).filter(models.User.id == payload.recipient_id).first()
    if recipient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient not found")

    praise = models.Praise(
        sender_id=current_user.id, recipient_id=payload.recipient_id, message=payload.message
    )
    db.add(praise)
    db.flush()
    db.add(
        models.Notification(
            user_id=payload.recipient_id,
            type="praise",
            message=f"{current_user.name} sent you praise: {payload.message}",
        )
    )
    db.commit()
    db.refresh(praise)
    return praise


@router.get("/received", response_model=list[PraiseRead])
async def received_praise(
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Praise]:
    return (
        db.query(models.Praise)
        .filter(models.Praise.recipient_id == current_user.id)
        .order_by(models.Praise.created_at.desc())
        .all()
    )
