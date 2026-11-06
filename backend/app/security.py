"""Shared auth primitives: password hashing, JWT issuance/verification, and
the reusable RBAC dependency every data endpoint imports.

Not a feature by itself for most of this file -- `app.security` only wires the
two library-backed primitives the architecture named (passlib/bcrypt for
passwords, pyjwt for tokens) to the right secret -- but `get_current_user` and
`require_roles` *are* the RBAC dependency later tickets import, and
`denylist_token` / `is_token_denylisted` are what makes `POST /auth/logout`
actually end a session.

`JWT_SECRET_KEY` signs tokens and must stay private. `SECRET_KEY` is the
public shared bearer the generated frontend sends before a user has signed
in (see frontend/src/lib/api.ts) -- never sign anything with it.
"""

import os
import uuid
from datetime import UTC, datetime, timedelta

import bcrypt
import jwt

# passlib 1.7.4 -- its last release -- predates a change bcrypt made at >=4.1 (the version
# this project's architecture requires): hashing a secret over 72 bytes now raises
# ValueError where it used to truncate silently. That would be someone else's problem to
# handle on their own input, except passlib's own one-time backend self-test hashes a fixed
# secret in exactly that position, so *every* call to hash or verify raises before user code
# ever runs. Restoring the old truncate-at-72-bytes behaviour fixes the self-test and matches
# what passlib already assumes bcrypt does; it is also standard bcrypt practice elsewhere.
# See https://github.com/pyca/bcrypt/issues/684.
if not getattr(bcrypt, "_passlib_truncate_patch", False):
    _hashpw = bcrypt.hashpw

    def _hashpw_truncated(password: bytes, salt: bytes) -> bytes:
        return _hashpw(password[:72], salt)

    bcrypt.hashpw = _hashpw_truncated
    bcrypt._passlib_truncate_patch = True

import redis  # noqa: E402
from fastapi import Depends, HTTPException, status  # noqa: E402
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer  # noqa: E402
from passlib.context import CryptContext  # noqa: E402 -- must follow the patch above
from sqlalchemy.orm import Session  # noqa: E402

from app import models  # noqa: E402
from app.database import get_db  # noqa: E402

SECRET_KEY = os.getenv("SECRET_KEY", "dev-shared-secret-change-me")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-insecure-jwt-secret-change-before-deploy")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
REDIS_URL = os.getenv("REDIS_URL")
_DENYLIST_PREFIX = "auth:denylist:"

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_bearer_scheme = HTTPBearer(auto_error=False)

_UNAUTHENTICATED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
)


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return _pwd_context.verify(password, password_hash)


def create_access_token(subject: str, role: str, expires_delta: timedelta | None = None) -> str:
    """A JWT carrying the user's id (`sub`), role and a unique `jti` -- the
    claim `POST /auth/logout` denylists -- signed with `JWT_SECRET_KEY`,
    never `SECRET_KEY`, which is public."""
    expire = datetime.now(UTC) + (expires_delta or ACCESS_TOKEN_EXPIRES)
    payload = {"sub": subject, "role": role, "exp": expire, "jti": str(uuid.uuid4())}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """The token's payload, or raises `jwt.PyJWTError` when it is invalid,
    expired, or signed with a different secret."""
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])


def _redis_client() -> "redis.Redis | None":
    """A connected Redis client, or None when Redis is unreachable or
    unconfigured. Every caller treats None the same way it treats an
    operation that raises: as "no denylist today", never as a reason to
    refuse a request that would otherwise be allowed."""
    if not REDIS_URL:
        return None
    try:
        client = redis.from_url(REDIS_URL, socket_connect_timeout=1, socket_timeout=1)
        client.ping()
        return client
    except Exception:  # noqa: BLE001 -- Redis is best-effort; never block auth on it
        return None


# In-process fallback, used only when Redis cannot be reached. A denylisted
# jti still has to make the *next* request on this same process fail even
# when Redis is down -- "graceful degradation" means the shared, cross-process
# record is best-effort, not that logout stops working altogether. Redis
# stays the source of truth whenever it answers.
_memory_denylist: dict[str, datetime] = {}


def denylist_token(jti: str, expires_at: datetime) -> None:
    """Record `jti` as revoked until the token would have expired anyway.
    Falls back to an in-memory record when Redis is unavailable, so logout
    still takes effect within this process -- graceful degradation, not a
    login/logout failure."""
    _memory_denylist[jti] = expires_at
    client = _redis_client()
    if client is None:
        return
    ttl_seconds = max(int((expires_at - datetime.now(UTC)).total_seconds()), 1)
    try:
        client.setex(_DENYLIST_PREFIX + jti, ttl_seconds, "1")
    except Exception:  # noqa: BLE001
        pass


def is_token_denylisted(jti: str) -> bool:
    client = _redis_client()
    if client is not None:
        try:
            if client.exists(_DENYLIST_PREFIX + jti):
                return True
        except Exception:  # noqa: BLE001
            pass
    expires_at = _memory_denylist.get(jti)
    if expires_at is None:
        return False
    if expires_at < datetime.now(UTC):
        del _memory_denylist[jti]
        return False
    return True


def get_token_payload(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),  # noqa: B008
) -> dict:
    """The verified JWT payload for the request's bearer token. Fails closed:
    a missing header, a bad signature, an expired token or a denylisted jti
    all raise the same 401."""
    if credentials is None:
        raise _UNAUTHENTICATED
    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise _UNAUTHENTICATED from None
    jti = payload.get("jti")
    if jti and is_token_denylisted(jti):
        raise _UNAUTHENTICATED
    return payload


def get_current_user(
    payload: dict = Depends(get_token_payload),  # noqa: B008
    db: Session = Depends(get_db),  # noqa: B008
) -> models.User:
    """The reusable RBAC dependency: the active user named by the verified
    token, never by anything the request body claims. Other routers import
    this (and `require_roles` below) to protect their endpoints."""
    try:
        user_id = uuid.UUID(str(payload.get("sub")))
    except (ValueError, TypeError):
        raise _UNAUTHENTICATED from None
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None or not user.is_active:
        raise _UNAUTHENTICATED
    return user


def require_roles(*roles: str):
    """A dependency factory: only a current user whose role is in `roles`
    may proceed; everyone else gets a 403."""

    def _dependency(user: models.User = Depends(get_current_user)) -> models.User:  # noqa: B008
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return user

    return _dependency
