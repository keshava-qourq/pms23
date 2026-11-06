"""Authentication: login, logout and password reset.

Login and logout are fully implemented here; password reset is still the
scaffold's stub (a later ticket's work).
"""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import (
    LoginRequest,
    LoginResponse,
    LoginUser,
    PasswordResetConfirmRequest,
    PasswordResetRequest,
    StubResponse,
)
from app.security import (
    create_access_token,
    denylist_token,
    get_token_payload,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# NFR-002: one generic message, used whether the email is unknown, the password is
# wrong, or the account is deactivated -- never anything that discloses which.
_GENERIC_LOGIN_ERROR = "Invalid email or password"

# Hashed once at import so a request for an unknown email still pays the cost of a
# bcrypt verify -- shape and timing match the "known email, wrong password" case.
_DUMMY_PASSWORD_HASH = hash_password("not-a-real-password-used-only-for-timing-parity")

_HOME_ROUTES = {
    "employee": "/dashboard",
    "manager": "/team",
    "hr_admin": "/employees",
    "executive": "/dashboard",
}


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:  # noqa: B008
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    password_hash = user.password_hash if user is not None else _DUMMY_PASSWORD_HASH
    password_ok = verify_password(payload.password, password_hash)

    if user is None or not user.is_active or not password_ok:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=_GENERIC_LOGIN_ERROR)

    token = create_access_token(subject=str(user.id), role=user.role)
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=LoginUser(id=user.id, name=user.name, email=user.email, role=user.role),
        home_route=_HOME_ROUTES.get(user.role, "/dashboard"),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(payload: dict = Depends(get_token_payload)) -> Response:  # noqa: B008
    jti = payload.get("jti")
    exp = payload.get("exp")
    if jti and exp:
        denylist_token(jti, datetime.fromtimestamp(exp, tz=UTC))
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
