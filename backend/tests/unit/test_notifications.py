"""Notifications list and read endpoints (US-012.2, AC-034).

Given an unread in-app notification, opening /notifications shows it, and
PATCH /notifications/{id}/read dismisses it.
"""

import datetime

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password

PASSWORD = "correct horse battery staple"


def _create_user(db_session: Session, *, email: str) -> models.User:
    user = models.User(
        email=email,
        name="Test User",
        password_hash=hash_password(PASSWORD),
        role="employee",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _create_notification(
    db_session: Session,
    user: models.User,
    *,
    message: str = "Your goal is due soon",
    is_read: bool = False,
    created_at: datetime.datetime | None = None,
) -> models.Notification:
    notification = models.Notification(
        user_id=user.id,
        type="due_date_reminder",
        message=message,
        is_read=is_read,
    )
    if created_at is not None:
        notification.created_at = created_at
    db_session.add(notification)
    db_session.commit()
    db_session.refresh(notification)
    return notification


def _login(client: TestClient, email: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ============================================================================
# AC-034: an unread notification is visible in the caller's list
# ============================================================================


def test_ac034_lists_the_callers_unread_notification(
    client: TestClient, db_session: Session
) -> None:
    user = _create_user(db_session, email="ac034-owner@example.com")
    notification = _create_notification(db_session, user)
    token = _login(client, "ac034-owner@example.com")

    response = client.get("/notifications", headers=_headers(token))

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == str(notification.id)
    assert body[0]["message"] == "Your goal is due soon"
    assert body[0]["is_read"] is False


def test_ac034_list_is_scoped_to_the_caller_and_newest_first(
    client: TestClient, db_session: Session
) -> None:
    owner = _create_user(db_session, email="ac034-scoped@example.com")
    other = _create_user(db_session, email="ac034-other@example.com")
    earlier = datetime.datetime(2026, 1, 1, tzinfo=datetime.UTC)
    later = datetime.datetime(2026, 1, 2, tzinfo=datetime.UTC)
    _create_notification(db_session, owner, message="first", created_at=earlier)
    _create_notification(db_session, owner, message="second", created_at=later)
    _create_notification(db_session, other, message="not mine")
    token = _login(client, "ac034-scoped@example.com")

    response = client.get("/notifications", headers=_headers(token))

    assert response.status_code == 200
    messages = [n["message"] for n in response.json()]
    assert messages == ["second", "first"]


def test_ac034_notifications_requires_a_bearer_token(client: TestClient) -> None:
    response = client.get("/notifications")

    assert response.status_code == 401


# ============================================================================
# AC-034: dismissing marks a notification read
# ============================================================================


def test_ac034_dismissing_marks_it_read(client: TestClient, db_session: Session) -> None:
    user = _create_user(db_session, email="ac034-dismiss@example.com")
    notification = _create_notification(db_session, user)
    token = _login(client, "ac034-dismiss@example.com")

    response = client.patch(f"/notifications/{notification.id}/read", headers=_headers(token))

    assert response.status_code == 200
    assert response.json()["is_read"] is True
    db_session.refresh(notification)
    assert notification.is_read is True


def test_ac034_dismissing_unknown_notification_returns_404(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac034-unknown@example.com")
    token = _login(client, "ac034-unknown@example.com")

    response = client.patch(
        "/notifications/11111111-1111-1111-1111-111111111111/read", headers=_headers(token)
    )

    assert response.status_code == 404


def test_ac034_dismissing_malformed_id_returns_404(client: TestClient, db_session: Session) -> None:
    _create_user(db_session, email="ac034-malformed@example.com")
    token = _login(client, "ac034-malformed@example.com")

    response = client.patch("/notifications/not-a-uuid/read", headers=_headers(token))

    assert response.status_code == 404


def test_ac034_cannot_dismiss_another_users_notification(
    client: TestClient, db_session: Session
) -> None:
    owner = _create_user(db_session, email="ac034-owner2@example.com")
    other = _create_user(db_session, email="ac034-intruder@example.com")
    notification = _create_notification(db_session, owner)
    token = _login(client, "ac034-intruder@example.com")

    response = client.patch(f"/notifications/{notification.id}/read", headers=_headers(token))

    assert response.status_code == 403
    db_session.refresh(notification)
    assert notification.is_read is False
    assert other.id != owner.id
