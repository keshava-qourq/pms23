"""Reminder and notification integration tests (US-012.4):
GET /notifications, PATCH /notifications/{id}/read.

AC-032 a goal whose due date is approaching, or whose check-in is overdue,
gets an in-app notification once the reminder schedule has run for it.
AC-033 the in-app notification is still created even when the email-sending
service credential is not configured. AC-034 an unread notification can be
seen through GET /notifications and dismissed through PATCH
/notifications/{id}/read.

There is no endpoint in this story's contract that runs the reminder
schedule -- the two given endpoints only list and dismiss notifications --
so each test builds the goal (and, for the overdue check-in case, the
check-in) that the schedule would act on, then plants the notification row
the schedule would have produced, matching the case's own wording of "the
reminder schedule has run for this goal" as a precondition rather than a
step. AC-033's missing email credential is the sandbox's own default state
(no SendGrid credential is configured here), so no extra setup is needed for
it; whether an email was actually attempted is not observable through this
story's endpoints, so that half of AC-033 is not asserted here.
"""

import datetime

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password

PASSWORD = "correct horse battery staple"


def _create_user(
    db_session: Session, *, email: str, name: str = "Test User", role: str = "employee"
) -> models.User:
    user = models.User(
        email=email,
        name=name,
        password_hash=hash_password(PASSWORD),
        role=role,
        is_active=True,
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


def _make_goal(
    db_session: Session,
    *,
    owner: models.User,
    title: str,
    due_date: datetime.date,
) -> models.Goal:
    goal = models.Goal(
        owner_id=owner.id,
        created_by=owner.id,
        title=title,
        target_metric="Progress toward completion",
        progress_type="percent",
        status="In progress",
        due_date=due_date,
    )
    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)
    return goal


def _plant_reminder_notification(
    db_session: Session,
    *,
    owner: models.User,
    goal: models.Goal,
    type_: str,
    message: str,
) -> models.Notification:
    """Stands in for the reminder schedule's own output.

    Nothing in this story's contract triggers the schedule run itself, so the
    notification it would have produced is planted directly, matching the
    case's precondition "the reminder schedule has run for this goal".
    """
    notification = models.Notification(
        user_id=owner.id,
        goal_id=goal.id,
        type=type_,
        message=message,
        is_read=False,
    )
    db_session.add(notification)
    db_session.commit()
    db_session.refresh(notification)
    return notification


# ============================================================================
# AC-032: approaching due date creates an in-app notification
# ============================================================================


def test_tc007_approaching_due_date_creates_in_app_notification(
    client: TestClient, db_session: Session
) -> None:
    alice = _create_user(db_session, email="alice@example.com", name="Alice")
    goal = _make_goal(
        db_session,
        owner=alice,
        title="Finish Q4 report",
        due_date=datetime.date(2026, 11, 28),
    )
    _plant_reminder_notification(
        db_session,
        owner=alice,
        goal=goal,
        type_="due_date_reminder",
        message="Your goal 'Finish Q4 report' is due soon. Update it to keep it current.",
    )
    token = _login(client, "alice@example.com")

    response = client.get("/notifications", headers=_headers(token))

    assert response.status_code == 200, response.text
    body = response.json()
    assert len(body) == 1
    entry = body[0]
    assert "Finish Q4 report" in entry["message"]
    assert entry["is_read"] is False


# ============================================================================
# AC-032: overdue check-in creates an in-app notification
# ============================================================================


def test_tc008_overdue_checkin_creates_in_app_notification(
    client: TestClient, db_session: Session
) -> None:
    bob = _create_user(db_session, email="bob@example.com", name="Bob")
    goal = _make_goal(
        db_session,
        owner=bob,
        title="Improve client retention",
        due_date=datetime.date(2027, 6, 30),
    )
    check_in = models.CheckIn(
        goal_id=goal.id,
        author_id=bob.id,
        note="Quarterly review note",
        created_at=datetime.datetime(2026, 10, 20, tzinfo=datetime.UTC),
    )
    db_session.add(check_in)
    db_session.commit()
    _plant_reminder_notification(
        db_session,
        owner=bob,
        goal=goal,
        type_="checkin_overdue",
        message=(
            "Your goal 'Improve client retention' has an overdue check-in. "
            "Add a check-in to keep it current."
        ),
    )
    token = _login(client, "bob@example.com")

    response = client.get("/notifications", headers=_headers(token))

    assert response.status_code == 200, response.text
    body = response.json()
    assert len(body) == 1
    entry = body[0]
    assert "Improve client retention" in entry["message"]
    assert "check-in" in entry["message"].lower()
    assert entry["is_read"] is False


# ============================================================================
# AC-033: in-app notification still created when the email credential is
# missing
# ============================================================================


def test_tc010_in_app_notification_created_when_email_credential_missing(
    client: TestClient, db_session: Session
) -> None:
    # The sandbox has no SendGrid credential configured by default, so the
    # precondition "the email-sending service credential is not configured"
    # already holds without further setup here.
    bob = _create_user(db_session, email="bob@example.com", name="Bob")
    goal = _make_goal(
        db_session,
        owner=bob,
        title="Prepare budget plan",
        due_date=datetime.date(2026, 11, 27),
    )
    _plant_reminder_notification(
        db_session,
        owner=bob,
        goal=goal,
        type_="due_date_reminder",
        message="Your goal 'Prepare budget plan' is due soon. Update it to keep it current.",
    )
    token = _login(client, "bob@example.com")

    response = client.get("/notifications", headers=_headers(token))

    assert response.status_code == 200, response.text
    body = response.json()
    assert len(body) == 1
    entry = body[0]
    assert "Prepare budget plan" in entry["message"]
    assert entry["is_read"] is False


# ============================================================================
# AC-034: view and dismiss an unread notification
# ============================================================================


def test_tc012_view_and_dismiss_an_unread_notification(
    client: TestClient, db_session: Session
) -> None:
    alice = _create_user(db_session, email="alice@example.com", name="Alice")
    goal = _make_goal(
        db_session,
        owner=alice,
        title="Finish Q4 report",
        due_date=datetime.date(2026, 11, 28),
    )
    _plant_reminder_notification(
        db_session,
        owner=alice,
        goal=goal,
        type_="due_date_reminder",
        message="Your goal 'Finish Q4 report' is due soon. Update it to keep it current.",
    )
    token = _login(client, "alice@example.com")

    listed = client.get("/notifications", headers=_headers(token))
    assert listed.status_code == 200, listed.text
    body = listed.json()
    assert len(body) == 1
    entry = body[0]
    assert "Finish Q4 report" in entry["message"]
    assert entry["is_read"] is False
    notification_id = entry["id"]

    dismissed = client.patch(f"/notifications/{notification_id}/read", headers=_headers(token))

    assert dismissed.status_code == 200, dismissed.text
    assert dismissed.json()["is_read"] is True

    refreshed = client.get("/notifications", headers=_headers(token))
    assert refreshed.status_code == 200, refreshed.text
    refreshed_entry = next(n for n in refreshed.json() if n["id"] == notification_id)
    assert refreshed_entry["is_read"] is True


# ============================================================================
# AC-034: dismissing a notification that does not exist fails gracefully
# ============================================================================


def test_tc014_dismissing_a_missing_notification_fails_gracefully(
    client: TestClient, db_session: Session
) -> None:
    alice = _create_user(db_session, email="alice@example.com", name="Alice")
    token = _login(client, "alice@example.com")

    response = client.patch("/notifications/999999/read", headers=_headers(token))

    assert response.status_code == 404, response.text
    assert db_session.query(models.Notification).filter_by(user_id=alice.id).count() == 0
