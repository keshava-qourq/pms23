"""Shared auth primitives: password hashing and JWT issuance/verification.

Not a feature: nothing here decides who may call which endpoint. That RBAC
dependency -- "every data endpoint runs an RBAC dependency; manager and
employee scopes are filtered by reporting line" -- is each ticket's own work
once it has a user to check. This module only wires the two library-backed
primitives the architecture named (passlib/bcrypt for passwords, pyjwt for
tokens) to the right secret, so that work has something to import.

`JWT_SECRET_KEY` signs tokens and must stay private. `SECRET_KEY` is the
public shared bearer the generated frontend sends before a user has signed
in (see frontend/src/lib/api.ts) -- never sign anything with it.
"""

import os
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

from passlib.context import CryptContext  # noqa: E402 -- must follow the patch above

SECRET_KEY = os.getenv("SECRET_KEY", "dev-shared-secret-change-me")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-insecure-jwt-secret-change-before-deploy")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES = timedelta(hours=12)

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return _pwd_context.verify(password, password_hash)


def create_access_token(subject: str, role: str, expires_delta: timedelta | None = None) -> str:
    """A JWT carrying the user's id (`sub`) and role, signed with
    `JWT_SECRET_KEY` -- never `SECRET_KEY`, which is public."""
    expire = datetime.now(UTC) + (expires_delta or ACCESS_TOKEN_EXPIRES)
    payload = {"sub": subject, "role": role, "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """The token's payload, or raises `jwt.PyJWTError` when it is invalid,
    expired, or signed with a different secret."""
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
