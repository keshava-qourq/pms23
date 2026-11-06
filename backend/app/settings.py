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

# Password reset (US-003): SendGrid delivery and the reset link's lifetime.
# SENDGRID_API_KEY is optional in environments (like this sandbox) that have
# no SendGrid account configured -- sending is then a no-op and the request
# still answers its generic 202, since the response must never reveal
# whether the email was actually dispatched.
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
PASSWORD_RESET_FROM_EMAIL = os.getenv("PASSWORD_RESET_FROM_EMAIL", "no-reply@example.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
PASSWORD_RESET_TOKEN_TTL_MINUTES = int(os.getenv("PASSWORD_RESET_TOKEN_TTL_MINUTES", "30"))
