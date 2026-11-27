"""Password reset and reminder email delivery via SendGrid (AC-008, AC-032,
AC-033).

Best-effort: the reset request's response must stay identical and fast
whether or not the account exists (no account enumeration), so a SendGrid
failure here is swallowed, never raised back to the caller. No personal data
beyond the recipient address and the reset link itself goes in the message
(NFR-006): no name, no role, nothing else about the account.

`send_reminder_email` (AC-032) is the same best-effort shape, but for a
reminder a missing or failing credential must never block the in-app
notification the caller writes alongside it (AC-033) -- it returns whether
the send happened, and logs the reason when it did not, instead of raising.
"""

import logging
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app import settings

logger = logging.getLogger(__name__)

# AC-033 ASSUMPTION: a SendGrid (or equivalent) credential must be provisioned
# for reminder emails to send; read directly from the environment (rather
# than through app.settings) so this module works whether or not that
# credential has been wired into app.settings yet.
REMINDER_FROM_EMAIL = os.getenv("REMINDER_FROM_EMAIL", "reminders@example.com")


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    """Sends `reset_link` to `to_email`. A no-op when SendGrid is not
    configured, and best-effort (never raises) when it is."""
    if not settings.SENDGRID_API_KEY:
        return
    message = Mail(
        from_email=settings.PASSWORD_RESET_FROM_EMAIL,
        to_emails=to_email,
        subject="Reset your password",
        plain_text_content=f"Use this link to reset your password: {reset_link}",
    )
    try:
        SendGridAPIClient(settings.SENDGRID_API_KEY).send(message)
    except Exception:  # noqa: BLE001 -- best-effort; never fails the request
        pass


def send_reminder_email(to_email: str, subject: str, body: str) -> bool:
    """Attempts a due-date/check-in reminder email (AC-032).

    Returns True on a successful send, False when the SendGrid credential is
    not configured or the send itself raises (AC-033) -- in both failure
    cases the reason is logged here, and the caller still writes the in-app
    notification: a missing or broken email credential never blocks it.
    """
    api_key = os.getenv("SENDGRID_API_KEY")
    if not api_key:
        logger.warning(
            "Reminder email to %s not sent: SENDGRID_API_KEY is not configured", to_email
        )
        return False
    message = Mail(
        from_email=REMINDER_FROM_EMAIL,
        to_emails=to_email,
        subject=subject,
        plain_text_content=body,
    )
    try:
        SendGridAPIClient(api_key).send(message)
    except Exception:  # noqa: BLE001 -- best-effort; logged, never raised
        logger.exception("Reminder email to %s failed to send", to_email)
        return False
    return True
