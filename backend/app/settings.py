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
