"""Higher-level objectives goals can cascade from."""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(tags=["objectives"])


@router.get("/objectives", response_model=StubResponse)
async def list_objectives() -> StubResponse:
    return StubResponse(endpoint="GET /objectives")
