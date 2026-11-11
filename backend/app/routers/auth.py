"""Authentication: login, logout and password reset.

Login and logout are fully implemented here; password reset is still the
scaffold's stub (a later ticket's work).
"""

import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import models, settings
from app.database import get_db
from app.email import send_password_reset_email
from app.schemas import (
    LoginRequest,
    LoginResponse,
    LoginUser,
    PasswordResetConfirmRequest,
    PasswordResetRequest,
)
from app.security import (
    create_access_token,
    denylist_token,
    get_token_payload,
    hash_password,
    verify_password,
)

# AC-008/NFR-003: time-limited, single-use reset tokens.
_RESET_TOKEN_TTL = timedelta(minutes=30)
# Account-enumeration-safe: identical whether the email is known or not, and
# never mentions "token" so the response body never hints at the mechanism.
_GENERIC_RESET_RESPONSE = {
    "detail": "If that email is registered, a reset link has been sent."
}
_INVALID_RESET_TOKEN_DETAIL = (
    "This reset link is invalid or has expired. Please request a new one."
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


@router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
async def request_password_reset(
    payload: PasswordResetRequest, db: Session = Depends(get_db)  # noqa: B008
) -> dict:
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if user is not None:
        plaintext_token = secrets.token_urlsafe(32)
        db.add(
            models.PasswordResetToken(
                user_id=user.id,
                token_hash=hash_password(plaintext_token),
                expires_at=datetime.now(UTC) + _RESET_TOKEN_TTL,
            )
        )
        db.commit()
        reset_link = f"{settings.PASSWORD_RESET_URL_BASE}?token={plaintext_token}"
        send_password_reset_email(user.email, reset_link)
    return _GENERIC_RESET_RESPONSE


@router.post("/password-reset/confirm")
async def confirm_password_reset(
    payload: PasswordResetConfirmRequest, db: Session = Depends(get_db)  # noqa: B008
) -> dict:
    now = datetime.now(UTC)
    candidates = (
        db.query(models.PasswordResetToken)
        .filter(models.PasswordResetToken.used_at.is_(None))
        .all()
    )
    matched = next(
        (t for t in candidates if verify_password(payload.token, t.token_hash)), None
    )
    if matched is not None:
        expires_at = matched.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=UTC)
        if expires_at < now:
            matched = None

    if matched is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=_INVALID_RESET_TOKEN_DETAIL
        )

    user = db.query(models.User).filter(models.User.id == matched.user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=_INVALID_RESET_TOKEN_DETAIL
        )

    user.password_hash = hash_password(payload.new_password)
    matched.used_at = now
    db.commit()
    return {"detail": "Your password has been updated."}
