"""Integration tests for POST /auth/password-reset/request and /confirm
(US-003-1): time-limited, single-use reset tokens with SendGrid delivery.

SendGrid is faked: `app.routers.auth.send_password_reset_email` is
monkeypatched to record its call instead of reaching the network, per the
project's "give external calls a fake in tests" rule.
"""

from datetime import UTC, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password, verify_password

_STRONG_PASSWORD = "NewStr0ngPass!"


def _make_user(db_session: Session, email: str = "reset.me@example.com") -> models.User:
    user = models.User(
        name="Reset Me",
        email=email,
        password_hash=hash_password("OldPassw0rd!"),
        role="employee",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def fake_sendgrid(monkeypatch):
    sent = []

    def _fake_send(to_email: str, reset_link: str) -> None:
        sent.append({"to": to_email, "link": reset_link})

    monkeypatch.setattr("app.routers.auth.send_password_reset_email", _fake_send)
    return sent


def test_ac008_registered_email_creates_token_row_and_sends_email(
    client: TestClient, db_session: Session, fake_sendgrid
) -> None:
    user = _make_user(db_session)

    response = client.post("/auth/password-reset/request", json={"email": user.email})

    assert response.status_code == 202
    tokens = db_session.query(models.PasswordResetToken).filter_by(user_id=user.id).all()
    assert len(tokens) == 1
    assert tokens[0].expires_at is not None
    assert tokens[0].used_at is None
    # Only the hash is stored -- never the plaintext token.
    assert tokens[0].token_hash != user.email
    assert len(fake_sendgrid) == 1
    assert fake_sendgrid[0]["to"] == user.email
    assert "token=" in fake_sendgrid[0]["link"]


def test_no_account_enumeration_identical_response_known_and_unknown_email(
    client: TestClient, db_session: Session, fake_sendgrid
) -> None:
    user = _make_user(db_session)

    known = client.post("/auth/password-reset/request", json={"email": user.email})
    unknown = client.post("/auth/password-reset/request", json={"email": "nobody@example.com"})

    assert known.status_code == 202
    assert unknown.status_code == 202
    assert known.json() == unknown.json()
    # Only the known email actually triggered a send.
    assert len(fake_sendgrid) == 1


def test_ac009_valid_token_updates_password_and_allows_immediate_login(
    client: TestClient, db_session: Session, fake_sendgrid
) -> None:
    user = _make_user(db_session)
    client.post("/auth/password-reset/request", json={"email": user.email})
    plaintext_token = fake_sendgrid[0]["link"].split("token=")[1]

    response = client.post(
        "/auth/password-reset/confirm",
        json={"token": plaintext_token, "new_password": _STRONG_PASSWORD},
    )

    assert response.status_code == 200
    db_session.refresh(user)
    assert verify_password(_STRONG_PASSWORD, user.password_hash)

    login = client.post("/auth/login", json={"email": user.email, "password": _STRONG_PASSWORD})
    assert login.status_code == 200


def test_ac010_unknown_token_rejected_with_retry_message(client: TestClient) -> None:
    response = client.post(
        "/auth/password-reset/confirm",
        json={"token": "not-a-real-token", "new_password": _STRONG_PASSWORD},
    )

    assert response.status_code == 400
    assert "new" in response.json()["detail"].lower()


def test_ac010_expired_token_rejected_and_password_unchanged(
    client: TestClient, db_session: Session
) -> None:
    user = _make_user(db_session)
    plaintext_token = "expired-token-value"
    db_session.add(
        models.PasswordResetToken(
            user_id=user.id,
            token_hash=hash_password(plaintext_token),
            expires_at=datetime.now(UTC) - timedelta(minutes=1),
        )
    )
    db_session.commit()
    original_hash = user.password_hash

    response = client.post(
        "/auth/password-reset/confirm",
        json={"token": plaintext_token, "new_password": _STRONG_PASSWORD},
    )

    assert response.status_code == 400
    db_session.refresh(user)
    assert user.password_hash == original_hash


def test_ac010_already_used_token_rejected_and_password_unchanged(
    client: TestClient, db_session: Session
) -> None:
    user = _make_user(db_session)
    plaintext_token = "used-token-value"
    db_session.add(
        models.PasswordResetToken(
            user_id=user.id,
            token_hash=hash_password(plaintext_token),
            expires_at=datetime.now(UTC) + timedelta(minutes=30),
            used_at=datetime.now(UTC),
        )
    )
    db_session.commit()
    original_hash = user.password_hash

    response = client.post(
        "/auth/password-reset/confirm",
        json={"token": plaintext_token, "new_password": _STRONG_PASSWORD},
    )

    assert response.status_code == 400
    db_session.refresh(user)
    assert user.password_hash == original_hash


def test_nfr003_replay_of_already_confirmed_token_is_rejected(
    client: TestClient, db_session: Session, fake_sendgrid
) -> None:
    user = _make_user(db_session)
    client.post("/auth/password-reset/request", json={"email": user.email})
    plaintext_token = fake_sendgrid[0]["link"].split("token=")[1]

    first = client.post(
        "/auth/password-reset/confirm",
        json={"token": plaintext_token, "new_password": _STRONG_PASSWORD},
    )
    assert first.status_code == 200

    replay = client.post(
        "/auth/password-reset/confirm",
        json={"token": plaintext_token, "new_password": "AnotherStr0ng!"},
    )
    assert replay.status_code == 400


def test_password_rule_violation_names_the_rule_without_leaking_token(
    client: TestClient,
) -> None:
    response = client.post(
        "/auth/password-reset/confirm",
        json={"token": "some-token", "new_password": "short"},
    )

    assert response.status_code == 422
    body = response.text
    assert "some-token" not in body
    assert "at least" in body.lower()


def test_response_never_contains_the_plaintext_token(
    client: TestClient, db_session: Session, fake_sendgrid
) -> None:
    user = _make_user(db_session)
    response = client.post("/auth/password-reset/request", json={"email": user.email})
    assert "token" not in response.text.lower()

    plaintext_token = fake_sendgrid[0]["link"].split("token=")[1]
    confirm = client.post(
        "/auth/password-reset/confirm",
        json={"token": plaintext_token, "new_password": _STRONG_PASSWORD},
    )
    assert plaintext_token not in confirm.text
