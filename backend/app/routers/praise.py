"""Praise: peer recognition notes."""

from fastapi import APIRouter

from app.schemas import PraiseCreate, StubResponse

router = APIRouter(prefix="/praise", tags=["praise"])


@router.post("", response_model=StubResponse)
async def send_praise(payload: PraiseCreate) -> StubResponse:
    return StubResponse(endpoint="POST /praise")


@router.get("/received", response_model=StubResponse)
async def received_praise() -> StubResponse:
    return StubResponse(endpoint="GET /praise/received")
