"""In-app notifications."""

from fastapi import APIRouter, Response, status

from app.schemas import StubResponse

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=StubResponse)
async def list_notifications() -> StubResponse:
    return StubResponse(endpoint="GET /notifications")


@router.patch("/{id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_notification_read(id: str) -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)
