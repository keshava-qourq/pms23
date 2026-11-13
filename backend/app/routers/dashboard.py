"""Cached personal and team dashboards."""

from fastapi import APIRouter, Depends

from app import models
from app.schemas import StubResponse
from app.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/me", response_model=StubResponse)
async def personal_dashboard(
    _current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> StubResponse:
    return StubResponse(endpoint="GET /dashboard/me")


@router.get("/team", response_model=StubResponse)
async def team_dashboard(
    _current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> StubResponse:
    return StubResponse(endpoint="GET /dashboard/team")
