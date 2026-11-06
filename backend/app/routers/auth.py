"""Authentication: login, logout and password reset.

Every handler here is a stub (see app.main): it returns the typed
`StubResponse` placeholder until the development sprint implements it, so
the service starts and its OpenAPI document already carries the request
shapes the approved API spec agreed on.
"""

from fastapi import APIRouter, Response, status

from app.schemas import (
    LoginRequest,
    PasswordResetConfirmRequest,
    PasswordResetRequest,
    StubResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=StubResponse)
async def login(payload: LoginRequest) -> StubResponse:
    return StubResponse(endpoint="POST /auth/login")


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout() -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/password-reset/request",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=StubResponse,
)
async def request_password_reset(payload: PasswordResetRequest) -> StubResponse:
    return StubResponse(endpoint="POST /auth/password-reset/request")


@router.post("/password-reset/confirm", response_model=StubResponse)
async def confirm_password_reset(payload: PasswordResetConfirmRequest) -> StubResponse:
    return StubResponse(endpoint="POST /auth/password-reset/confirm")
