"""Executive, read-only org-level analytics."""

from fastapi import APIRouter, Depends

from app import models
from app.schemas import StubResponse
from app.security import get_current_user

router = APIRouter(tags=["analytics"])


@router.get("/analytics", response_model=StubResponse)
async def analytics(
    _current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> StubResponse:
    return StubResponse(endpoint="GET /analytics")
