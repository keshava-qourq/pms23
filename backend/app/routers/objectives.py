"""Higher-level objectives goals can cascade from.

Visible to any authenticated user (there is no per-objective ownership to
scope by); the shared `get_current_user` dependency is what rejects an
unauthenticated request, same as every other router here.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import ObjectiveRead
from app.security import get_current_user

router = APIRouter(tags=["objectives"])

_LIMIT_QUERY = Query(default=50, ge=1, le=200)
_OFFSET_QUERY = Query(default=0, ge=0)


@router.get("/objectives", response_model=list[ObjectiveRead])
async def list_objectives(
    limit: int = _LIMIT_QUERY,
    offset: int = _OFFSET_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    _current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Objective]:
    return (
        db.query(models.Objective)
        .order_by(models.Objective.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
