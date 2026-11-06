"""Goals, their progress and their check-ins."""

from fastapi import APIRouter

from app.schemas import (
    CheckInCreate,
    GoalCreate,
    GoalProgressUpdate,
    GoalUpdate,
    StubResponse,
)

router = APIRouter(tags=["goals"])


@router.post("/goals", response_model=StubResponse)
async def create_goal(payload: GoalCreate) -> StubResponse:
    return StubResponse(endpoint="POST /goals")


@router.get("/goals", response_model=StubResponse)
async def list_goals() -> StubResponse:
    return StubResponse(endpoint="GET /goals")


@router.put("/goals/{id}", response_model=StubResponse)
async def update_goal(id: str, payload: GoalUpdate) -> StubResponse:
    return StubResponse(endpoint="PUT /goals/{id}")


@router.patch("/goals/{id}/progress", response_model=StubResponse)
async def update_goal_progress(id: str, payload: GoalProgressUpdate) -> StubResponse:
    return StubResponse(endpoint="PATCH /goals/{id}/progress")


@router.post("/goals/{id}/check-ins", response_model=StubResponse)
async def add_check_in(id: str, payload: CheckInCreate) -> StubResponse:
    return StubResponse(endpoint="POST /goals/{id}/check-ins")


@router.get("/goals/{id}/check-ins", response_model=StubResponse)
async def list_check_ins(id: str) -> StubResponse:
    return StubResponse(endpoint="GET /goals/{id}/check-ins")
