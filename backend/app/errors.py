"""Error codes: one constant per error a route in this ticket can raise.

Each is a ready-to-raise `HTTPException` carrying its HTTP status and a short,
user-facing message. A router raises the constant itself rather than building
an ad hoc `HTTPException` inline, so the OpenAPI document lists the exact
status and body the frontend should expect for that failure.
"""

from fastapi import HTTPException, status

# ---- notifications ------------------------------------------------------------

NOTIFICATION_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Notification not found",
)

NOTIFICATION_FORBIDDEN = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You cannot access another user's notification",
)
