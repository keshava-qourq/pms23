"""Praise: give-and-receive notes with an in-app notification (US-015).

AC-040 POST /praise persists the note and creates a notification row for the
recipient. AC-041 an empty recipient or empty message is rejected and
nothing is written. AC-042/AC-043 GET /praise/received returns only the
caller's own notes, newest first, and an empty list when they have none.
NFR-001 one user cannot read another user's received praise.
"""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password

PASSWORD = "correct horse battery staple"


def _create_user(
    db_session: Session, *, email: str, role: str = "employee", is_active: bool = True
) -> models.User:
    user = models.User(
        email=email,
        name="Test User",
        password_hash=hash_password(PASSWORD),
        role=role,
        is_active=is_active,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _login(client: TestClient, email: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ============================================================================
# AC-040: sending praise persists the note and notifies the recipient
# ============================================================================


def test_ac040_post_praise_persists_note_and_creates_notification(
    client: TestClient, db_session: Session
) -> None:
    sender = _create_user(db_session, email="ac040-sender@example.com")
    recipient = _create_user(db_session, email="ac040-recipient@example.com")
    token = _login(client, "ac040-sender@example.com")

    response = client.post(
        "/praise",
        headers=_headers(token),
        json={"recipient_id": str(recipient.id), "message": "Great work on the launch"},
    )

    assert response.status_code == 201, response.text
    body = response.json()
    assert body["sender_id"] == str(sender.id)
    assert body["recipient_id"] == str(recipient.id)
    assert body["message"] == "Great work on the launch"

    praise_rows = db_session.query(models.Praise).filter_by(recipient_id=recipient.id).all()
    assert len(praise_rows) == 1
    assert praise_rows[0].message == "Great work on the launch"

    notifications = db_session.query(models.Notification).filter_by(user_id=recipient.id).all()
    assert len(notifications) == 1
    assert notifications[0].type == "praise"


# ============================================================================
# AC-041: empty recipient or empty message is rejected; nothing is written
# ============================================================================


def test_ac041_empty_message_is_rejected_and_writes_no_row(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac041a-sender@example.com")
    recipient = _create_user(db_session, email="ac041a-recipient@example.com")
    token = _login(client, "ac041a-sender@example.com")

    response = client.post(
        "/praise",
        headers=_headers(token),
        json={"recipient_id": str(recipient.id), "message": "   "},
    )

    assert response.status_code == 422
    assert db_session.query(models.Praise).count() == 0
    assert db_session.query(models.Notification).count() == 0


def test_ac041_missing_recipient_is_rejected_and_writes_no_row(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac041b-sender@example.com")
    token = _login(client, "ac041b-sender@example.com")

    response = client.post(
        "/praise",
        headers=_headers(token),
        json={"recipient_id": "", "message": "Nice work"},
    )

    assert response.status_code == 422
    assert db_session.query(models.Praise).count() == 0
    assert db_session.query(models.Notification).count() == 0


def test_ac041_missing_message_field_is_rejected_and_writes_no_row(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac041c-sender@example.com")
    recipient = _create_user(db_session, email="ac041c-recipient@example.com")
    token = _login(client, "ac041c-sender@example.com")

    response = client.post(
        "/praise",
        headers=_headers(token),
        json={"recipient_id": str(recipient.id)},
    )

    assert response.status_code == 422
    assert db_session.query(models.Praise).count() == 0


# ============================================================================
# AC-042/AC-043: GET /praise/received is scoped to the caller, newest first,
# empty when there is none
# ============================================================================


def test_ac042_received_praise_ordered_newest_first(
    client: TestClient, db_session: Session
) -> None:
    import datetime

    sender = _create_user(db_session, email="ac042-sender@example.com")
    recipient = _create_user(db_session, email="ac042-recipient@example.com")
    earlier = datetime.datetime(2026, 1, 1, tzinfo=datetime.UTC)
    later = datetime.datetime(2026, 1, 2, tzinfo=datetime.UTC)
    first = models.Praise(
        sender_id=sender.id, recipient_id=recipient.id, message="first", created_at=earlier
    )
    second = models.Praise(
        sender_id=sender.id, recipient_id=recipient.id, message="second", created_at=later
    )
    db_session.add_all([first, second])
    db_session.commit()
    token = _login(client, "ac042-recipient@example.com")

    response = client.get("/praise/received", headers=_headers(token))

    assert response.status_code == 200
    messages = [p["message"] for p in response.json()]
    assert messages == ["second", "first"]


def test_ac043_received_praise_is_empty_list_for_user_with_none(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac043-lonely@example.com")
    token = _login(client, "ac043-lonely@example.com")

    response = client.get("/praise/received", headers=_headers(token))

    assert response.status_code == 200
    assert response.json() == []


# ============================================================================
# NFR-001: one user cannot read another user's received praise
# ============================================================================


def test_nfr001_one_user_cannot_read_anothers_received_praise(
    client: TestClient, db_session: Session
) -> None:
    sender = _create_user(db_session, email="nfr001-sender@example.com")
    recipient = _create_user(db_session, email="nfr001-recipient@example.com")
    _create_user(db_session, email="nfr001-other@example.com")
    db_session.add(
        models.Praise(sender_id=sender.id, recipient_id=recipient.id, message="private note")
    )
    db_session.commit()
    other_token = _login(client, "nfr001-other@example.com")

    response = client.get("/praise/received", headers=_headers(other_token))

    assert response.status_code == 200
    messages = {p["message"] for p in response.json()}
    assert "private note" not in messages
