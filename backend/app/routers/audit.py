"""HR admin: the audit trail of who changed what and when."""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(tags=["audit"])


@router.get("/audit-log", response_model=StubResponse)
async def list_audit_log() -> StubResponse:
    return StubResponse(endpoint="GET /audit-log")
