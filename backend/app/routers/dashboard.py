"""Cached personal and team dashboards."""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/me", response_model=StubResponse)
async def personal_dashboard() -> StubResponse:
    return StubResponse(endpoint="GET /dashboard/me")


@router.get("/team", response_model=StubResponse)
async def team_dashboard() -> StubResponse:
    return StubResponse(endpoint="GET /dashboard/team")
