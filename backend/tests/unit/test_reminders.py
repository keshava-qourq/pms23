"""Reminder scheduling job (US-012.1).

AC-032: a goal whose due date is approaching, or whose check-in is overdue,
gets an in-app notification and an attempted reminder email.
AC-033: when the email credential is not configured, the in-app
notification is still created and the email failure is logged.
"""

import datetime
import logging

from sqlalchemy.orm import Session

from app import models, reminders
from app.security import hash_password

PASSWORD = "correct horse battery staple"


def _create_user(db_session: Session, *, email: str) -> models.User:
    user = models.User(
        email=email,
        name="Goal Owner",
        password_hash=hash_password(PASSWORD),
        role="employee",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _create_goal(
    db_session: Session,
    owner: models.User,
    *,
    due_date: datetime.date,
    check_in_interval_days: int | None = None,
    completed_at: datetime.datetime | None = None,
    created_at: datetime.datetime | None = None,
) -> models.Goal:
    goal = models.Goal(
        owner_id=owner.id,
        created_by=owner.id,
        title="Ship the migration",
        target_metric="Shipped",
        progress_type="status",
        status="In progress",
        due_date=due_date,
        check_in_interval_days=check_in_interval_days,
        completed_at=completed_at,
    )
    if created_at is not None:
        goal.created_at = created_at
    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)
    return goal


# ============================================================================
# AC-032: an approaching due date creates a notification and attempts email
# ============================================================================


def test_ac032_due_soon_goal_creates_notification_and_attempts_email(
    db_session: Session, monkeypatch
) -> None:
    owner = _create_user(db_session, email="ac032-due@example.com")
    today = datetime.date(2026, 11, 26)
    goal = _create_goal(db_session, owner, due_date=today + datetime.timedelta(days=2))

    sent_to = []

    def _fake_send(to_email: str, subject: str, body: str) -> bool:
        sent_to.append((to_email, subject, body))
        return True

    monkeypatch.setattr(reminders, "send_reminder_email", _fake_send)

    created = reminders.run_reminder_scan(db_session, today=today)

    assert len(created) == 1
    assert created[0].type == reminders.DUE_DATE_REMINDER
    assert created[0].user_id == owner.id
    assert created[0].is_read is False
    assert created[0].email_status == "sent"
    assert sent_to == [(owner.email, "A goal needs your attention", created[0].message)]

    rows = db_session.query(models.Notification).filter_by(user_id=owner.id).all()
    assert len(rows) == 1
    assert goal.owner_id == owner.id


def test_ac032_goal_due_further_out_is_not_reminded(db_session: Session) -> None:
    owner = _create_user(db_session, email="ac032-far@example.com")
    today = datetime.date(2026, 11, 26)
    _create_goal(db_session, owner, due_date=today + datetime.timedelta(days=30))

    created = reminders.run_reminder_scan(db_session, today=today)

    assert created == []
    assert db_session.query(models.Notification).count() == 0


def test_ac032_completed_goal_is_never_reminded(db_session: Session) -> None:
    owner = _create_user(db_session, email="ac032-done@example.com")
    today = datetime.date(2026, 11, 26)
    _create_goal(
        db_session,
        owner,
        due_date=today,
        completed_at=datetime.datetime(2026, 11, 20, tzinfo=datetime.UTC),
    )

    created = reminders.run_reminder_scan(db_session, today=today)

    assert created == []


def test_ac032_overdue_check_in_creates_notification(db_session: Session, monkeypatch) -> None:
    owner = _create_user(db_session, email="ac032-checkin@example.com")
    today = datetime.date(2026, 11, 26)
    goal = _create_goal(
        db_session,
        owner,
        due_date=today + datetime.timedelta(days=90),
        check_in_interval_days=7,
        created_at=datetime.datetime(2026, 11, 10, tzinfo=datetime.UTC),
    )

    monkeypatch.setattr(reminders, "send_reminder_email", lambda *a, **k: True)

    created = reminders.run_reminder_scan(db_session, today=today)

    assert len(created) == 1
    assert created[0].type == reminders.CHECK_IN_OVERDUE
    assert created[0].user_id == owner.id
    assert "check-in" in created[0].message
    assert goal.check_in_interval_days == 7


def test_ac032_recent_check_in_is_not_overdue(db_session: Session) -> None:
    owner = _create_user(db_session, email="ac032-recent@example.com")
    today = datetime.date(2026, 11, 26)
    goal = _create_goal(
        db_session,
        owner,
        due_date=today + datetime.timedelta(days=90),
        check_in_interval_days=14,
        created_at=datetime.datetime(2026, 11, 20, tzinfo=datetime.UTC),
    )
    db_session.add(
        models.CheckIn(
            goal_id=goal.id,
            author_id=owner.id,
            note="On track",
            created_at=datetime.datetime(2026, 11, 25, tzinfo=datetime.UTC),
        )
    )
    db_session.commit()

    created = reminders.run_reminder_scan(db_session, today=today)

    assert created == []


# ============================================================================
# AC-033: a missing email credential still creates the notification and
# logs the failure instead of raising
# ============================================================================


def test_ac033_missing_email_credential_still_creates_notification(
    db_session: Session, monkeypatch
) -> None:
    monkeypatch.delenv("SENDGRID_API_KEY", raising=False)
    owner = _create_user(db_session, email="ac033-owner@example.com")
    today = datetime.date(2026, 11, 26)
    _create_goal(db_session, owner, due_date=today)

    created = reminders.run_reminder_scan(db_session, today=today)

    assert len(created) == 1
    assert created[0].email_status == "failed"
    notification = db_session.query(models.Notification).filter_by(user_id=owner.id).one()
    assert notification.is_read is False


def test_ac033_missing_credential_is_logged(caplog, monkeypatch) -> None:
    from app.email import send_reminder_email

    monkeypatch.delenv("SENDGRID_API_KEY", raising=False)

    with caplog.at_level(logging.WARNING):
        sent = send_reminder_email("owner@example.com", "subject", "body")

    assert sent is False
    assert "SENDGRID_API_KEY" in caplog.text
