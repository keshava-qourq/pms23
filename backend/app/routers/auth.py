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
    PasswordResetAccepted,
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

router = APIRouter(prefix="/auth", tags=["auth"])

# NFR-003/AC-010: one generic message for an expired, already-used or unknown token --
# never anything that would tell an attacker which of the three it was.
_RESET_INVALID_MESSAGE = "This reset link is invalid or has expired. Please request a new one."
# No account enumeration: this is returned whether or not the email is registered.
_RESET_REQUEST_MESSAGE = (
    "If an account with that email exists, a password reset link has been sent."
)

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
    response_model=PasswordResetAccepted,
)
async def request_password_reset(
    payload: PasswordResetRequest, db: Session = Depends(get_db)  # noqa: B008
) -> PasswordResetAccepted:
    """AC-008: on a registered, active email, creates a PasswordResetToken
    row holding only the token's hash and sends the plaintext token -- never
    persisted or logged -- as a link via SendGrid. The response is the same
    202 and body either way, so a caller cannot tell whether the email
    exists."""
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if user is not None and user.is_active:
        plaintext_token = secrets.token_urlsafe(32)
        expires_at = datetime.now(UTC) + timedelta(
            minutes=settings.PASSWORD_RESET_TOKEN_TTL_MINUTES
        )
        db.add(
            models.PasswordResetToken(
                user_id=user.id,
                token_hash=hash_password(plaintext_token),
                expires_at=expires_at,
            )
        )
        db.commit()
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={plaintext_token}"
        send_password_reset_email(user.email, reset_link)
    return PasswordResetAccepted(detail=_RESET_REQUEST_MESSAGE)


@router.post("/password-reset/confirm", response_model=PasswordResetAccepted)
async def confirm_password_reset(
    payload: PasswordResetConfirmRequest, db: Session = Depends(get_db)  # noqa: B008
) -> PasswordResetAccepted:
    """AC-009/AC-010/NFR-003: only a token that is unused and unexpired can
    match; an expired, already-used or unknown token all land on the same
    generic rejection. The candidate's hash is verified with the same bcrypt
    check used for passwords -- the plaintext token is never stored, so this
    is the only way to find the matching row."""
    now = datetime.now(UTC)
    candidates = (
        db.query(models.PasswordResetToken)
        .filter(models.PasswordResetToken.used_at.is_(None))
        .filter(models.PasswordResetToken.expires_at > now)
        .order_by(models.PasswordResetToken.created_at.desc())
        .all()
    )
    matched = next(
        (c for c in candidates if verify_password(payload.token, c.token_hash)), None
    )
    if matched is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=_RESET_INVALID_MESSAGE)

    user = db.query(models.User).filter(models.User.id == matched.user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=_RESET_INVALID_MESSAGE)

    user.password_hash = hash_password(payload.new_password)
    matched.used_at = now
    db.commit()
    return PasswordResetAccepted(detail="Your password has been updated.")
