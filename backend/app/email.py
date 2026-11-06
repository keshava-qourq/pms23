"""Password reset email delivery via SendGrid (AC-008).

Best-effort: the reset request's response must stay identical and fast
whether or not the account exists (no account enumeration), so a SendGrid
failure here is swallowed, never raised back to the caller. No personal data
beyond the recipient address and the reset link itself goes in the message
(NFR-006): no name, no role, nothing else about the account.
"""

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app import settings


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
