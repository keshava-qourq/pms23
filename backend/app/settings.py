"""Process-wide settings read from the environment, each with a working
local default so a fresh clone runs unconfigured.

The platform always injects these at deploy time: `ALLOWED_ORIGINS` for CORS
(read directly in app.main, next to the middleware it configures) and
`SECRET_KEY` / `JWT_SECRET_KEY` for auth (read in app.security, next to the
code that signs with them). `MEDIA_ROOT` -- the writable directory that
survives redeploys -- lives here for whichever ticket ends up writing an
export or an upload to disk.
"""

import os

MEDIA_ROOT = os.getenv("MEDIA_ROOT", "./media")

# Password reset (AC-008): SendGrid API key, the sender address to use, and
# the frontend page that performs the confirm step. All optional for a local
# run -- when SENDGRID_API_KEY is unset, app.email.send_password_reset_email
# is a no-op, matching the account-enumeration-safe behaviour the endpoint
# needs regardless of whether email delivery is configured.
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
PASSWORD_RESET_FROM_EMAIL = os.getenv("PASSWORD_RESET_FROM_EMAIL", "no-reply@example.com")
PASSWORD_RESET_URL_BASE = os.getenv(
    "PASSWORD_RESET_URL_BASE", "http://localhost:5173/reset-password"
)
