"""Executive, read-only org-level analytics."""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(tags=["analytics"])


@router.get("/analytics", response_model=StubResponse)
async def analytics() -> StubResponse:
    return StubResponse(endpoint="GET /analytics")
