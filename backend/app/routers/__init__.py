"""Generated routers: one module per resource the approved API spec groups
together, all owned by the one `backend_api` architecture component.

`app.main` mounts every router in `ALL_ROUTERS` below; that tuple is the one
place that has to stay in sync with what this package contains.
"""

from app.routers import (
    analytics,
    audit,
    auth,
    dashboard,
    employees,
    goals,
    notifications,
    objectives,
    praise,
)

ALL_ROUTERS = (
    auth.router,
    employees.router,
    audit.router,
    goals.router,
    objectives.router,
    dashboard.router,
    analytics.router,
    praise.router,
    notifications.router,
)

__all__ = ["ALL_ROUTERS"]
