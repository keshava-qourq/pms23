"""In-app notifications."""

from fastapi import APIRouter, Depends, Response, status

from app import models
from app.schemas import StubResponse
from app.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=StubResponse)
async def list_notifications(
    _current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> StubResponse:
    return StubResponse(endpoint="GET /notifications")


@router.patch("/{id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_notification_read(
    id: str,
    _current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)
