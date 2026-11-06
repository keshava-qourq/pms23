"""Helper for the password-reset e2e suite (US-003-3).

There is no API that discloses a reset token -- by design (AC-008/NFR-003),
the response never contains it -- so the e2e suite cannot get one the way it
gets a session token, by just calling the endpoint and reading the body. This
drives the real `POST /auth/password-reset/request` through the real FastAPI
application against the real sandbox Postgres named by `DATABASE_URL` (never
a mock, never SQLite -- the project's rule), and intercepts only the one
thing that never reaches a response or a database row: the plaintext link
`app.email.send_password_reset_email` would otherwise hand to SendGrid.

Invoked by frontend/e2e/fixtures.ts via execFileSync, the same way
e2e_seed.py seeds users. Not named test_*.py so pytest never collects it.

Usage:
    python e2e_reset_helper.py request <email>   prints the plaintext token
    python e2e_reset_helper.py expire <email>    expires that user's latest token
    python e2e_reset_helper.py use <email>       marks that user's latest token used
"""

import os
import sys
from datetime import UTC, datetime, timedelta
from unittest.mock import patch

# Running this file directly only puts backend/tests/ on sys.path, not
# backend/ itself -- same fix as e2e_seed.py.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app import models  # noqa: E402, F401 -- registers tables
from app.database import get_db  # noqa: E402
from app.main import app  # noqa: E402


def _engine_and_factory():
    database_url = os.environ["DATABASE_URL"]
    engine = create_engine(database_url, pool_pre_ping=True, future=True)
    factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    return engine, factory


def request_token(email: str) -> str:
    """Drives POST /auth/password-reset/request for real, against the real
    database, intercepting only the outbound email to recover the token the
    response itself never discloses."""
    engine, factory = _engine_and_factory()
    session = factory()
    captured: dict[str, str] = {}

    def _fake_send(to_email: str, reset_link: str) -> None:
        captured["link"] = reset_link

    def _get_db():
        yield session

    app.dependency_overrides[get_db] = _get_db
    try:
        with patch("app.routers.auth.send_password_reset_email", _fake_send):
            client = TestClient(app)
            response = client.post("/auth/password-reset/request", json={"email": email})
            response.raise_for_status()
    finally:
        app.dependency_overrides.pop(get_db, None)
        session.close()
        engine.dispose()

    link = captured.get("link")
    if not link or "token=" not in link:
        raise RuntimeError(f"no reset email was sent for {email}")
    return link.rsplit("token=", 1)[-1]


def _latest_token_row(session, email: str) -> models.PasswordResetToken:
    user = session.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise RuntimeError(f"no such user: {email}")
    row = (
        session.query(models.PasswordResetToken)
        .filter(models.PasswordResetToken.user_id == user.id)
        .order_by(models.PasswordResetToken.created_at.desc())
        .first()
    )
    if row is None:
        raise RuntimeError(f"no reset token row for {email}")
    return row


def expire_latest_token(email: str) -> None:
    """Back-dates the user's most recent token past its TTL, in the
    database only -- it was already issued through the real endpoint."""
    engine, factory = _engine_and_factory()
    session = factory()
    try:
        row = _latest_token_row(session, email)
        row.expires_at = datetime.now(UTC) - timedelta(minutes=1)
        session.commit()
    finally:
        session.close()
        engine.dispose()


def use_latest_token(email: str) -> None:
    """Marks the user's most recent token spent, so the e2e suite can open
    the same link twice and see the second attempt rejected."""
    engine, factory = _engine_and_factory()
    session = factory()
    try:
        row = _latest_token_row(session, email)
        row.used_at = datetime.now(UTC)
        session.commit()
    finally:
        session.close()
        engine.dispose()


def main() -> None:
    action, email = sys.argv[1], sys.argv[2]
    if action == "request":
        print(request_token(email))
    elif action == "expire":
        expire_latest_token(email)
    elif action == "use":
        use_latest_token(email)
    else:
        raise SystemExit(f"unknown action: {action}")


if __name__ == "__main__":
    main()
