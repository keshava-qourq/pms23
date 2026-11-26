"""Due-date and check-in reminder scheduling (US-012).

`run_reminder_scan` is what a scheduler (cron, worker queue, ...) calls once
per run. Standing up that scheduler is infrastructure, not this ticket's
work: this module is the job body -- find what is due, write the in-app
notification, attempt the email -- that whatever triggers it imports and
calls.

AC-032: a goal whose due date is approaching, or whose check-in is overdue,
gets an in-app notification for its owner and an attempted reminder email.
AC-033: a missing (or failing) email credential never blocks the in-app
notification -- `app.email.send_reminder_email` already logs the failure,
and the notification is written either way, with `email_status` recording
which happened.
"""

from datetime import UTC, date, datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models
from app.email import send_reminder_email

# AC-032: a due date on or before this many days from today counts as
# "approaching".
DUE_SOON_WITHIN_DAYS = 3

DUE_DATE_REMINDER = "due_date_reminder"
CHECK_IN_OVERDUE = "check_in_overdue"


def run_reminder_scan(db: Session, *, today: date | None = None) -> list[models.Notification]:
    """Scans every open (not completed) goal for an approaching due date or
    an overdue check-in, writes an in-app notification for each, attempts
    the matching reminder email, and commits. Returns the notifications
    created this run."""
    today = today or datetime.now(UTC).date()

    created = [
        _notify(db, goal, DUE_DATE_REMINDER, _due_date_message(goal, today))
        for goal in _due_soon_goals(db, today)
    ] + [
        _notify(db, goal, CHECK_IN_OVERDUE, _check_in_message(goal))
        for goal in _overdue_check_in_goals(db, today)
    ]

    db.commit()
    for notification in created:
        db.refresh(notification)
    return created


def _due_soon_goals(db: Session, today: date) -> list[models.Goal]:
    cutoff = today + timedelta(days=DUE_SOON_WITHIN_DAYS)
    return (
        db.query(models.Goal)
        .filter(models.Goal.completed_at.is_(None))
        .filter(models.Goal.due_date >= today)
        .filter(models.Goal.due_date <= cutoff)
        .all()
    )


def _overdue_check_in_goals(db: Session, today: date) -> list[models.Goal]:
    """Every open goal with a check-in interval whose most recent check-in
    (or, lacking one, whose creation) is old enough that the next one is
    already due."""
    candidates = (
        db.query(models.Goal)
        .filter(models.Goal.completed_at.is_(None))
        .filter(models.Goal.check_in_interval_days.isnot(None))
        .all()
    )
    overdue = []
    for goal in candidates:
        last_check_in_at = (
            db.query(func.max(models.CheckIn.created_at))
            .filter(models.CheckIn.goal_id == goal.id)
            .scalar()
        )
        anchor = last_check_in_at or goal.created_at
        anchor_date = anchor.date() if hasattr(anchor, "date") else today
        next_due = anchor_date + timedelta(days=goal.check_in_interval_days)
        if next_due <= today:
            overdue.append(goal)
    return overdue


def _due_date_message(goal: models.Goal, today: date) -> str:
    due = goal.due_date.isoformat()
    if goal.due_date <= today:
        return f"Your goal '{goal.title}' is overdue -- it was due on {due}."
    return f"Your goal '{goal.title}' is due on {due}."


def _check_in_message(goal: models.Goal) -> str:
    return f"Your goal '{goal.title}' is overdue for a check-in."


def _notify(
    db: Session, goal: models.Goal, notification_type: str, message: str
) -> models.Notification:
    owner = db.query(models.User).filter(models.User.id == goal.owner_id).first()
    notification = models.Notification(
        user_id=goal.owner_id,
        type=notification_type,
        message=message,
        is_read=False,
    )
    db.add(notification)
    sent = (
        send_reminder_email(owner.email, "A goal needs your attention", message)
        if owner is not None
        else False
    )
    notification.email_status = "sent" if sent else "failed"
    return notification
