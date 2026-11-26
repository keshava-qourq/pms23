"""The backing services this application is configured to reach.

Each entry maps a service to the environment variable that addresses it. The value
comes from docker-compose.yml through .env.example, so the health check reports
what the running deployment can actually reach.
"""

import os
import uuid
from typing import Any

from sqlalchemy.orm import Session

from app import models
from app.cache import get_cached, set_cached

SERVICES = {
    "redis-queue": "REDIS_QUEUE_URL",
    "redis": "REDIS_URL",
}


def configured_services() -> dict[str, bool]:
    """Each service mapped to whether its connection variable is set."""
    return {name: bool(os.getenv(var)) for name, var in SERVICES.items()}


# ---- team dashboard (US-014) -----------------------------------------------

TEAM_DASHBOARD_CACHE_TTL_SECONDS = 60


def _team_dashboard_cache_key(employee_id: uuid.UUID) -> str:
    return f"dashboard:team:{employee_id}"


def team_dashboard_reports(db: Session, employee_id: uuid.UUID) -> list[dict[str, Any]]:
    """AC-038: each of `employee_id`'s direct reports with their goals and
    progress, read through a short-lived cache (NFR-009) so a manager
    opening their team view repeatedly does not re-walk the table every
    time; a cache miss or a disabled cache falls straight through to the
    database and still answers correctly."""
    cache_key = _team_dashboard_cache_key(employee_id)
    cached = get_cached(cache_key)
    if cached is not None:
        return cached

    reports = (
        db.query(models.User)
        .filter(models.User.manager_id == employee_id)
        .order_by(models.User.name)
        .all()
    )
    result: list[dict[str, Any]] = []
    for report in reports:
        goals = (
            db.query(models.Goal)
            .filter(models.Goal.owner_id == report.id)
            .order_by(models.Goal.due_date)
            .all()
        )
        result.append(
            {
                "id": str(report.id),
                "name": report.name,
                "email": report.email,
                "goals": [
                    {
                        "id": str(goal.id),
                        "title": goal.title,
                        "progress_type": goal.progress_type,
                        "progress_percent": goal.progress_percent,
                        "status": goal.status,
                        "due_date": goal.due_date.isoformat(),
                    }
                    for goal in goals
                ],
            }
        )
    set_cached(cache_key, result, TEAM_DASHBOARD_CACHE_TTL_SECONDS)
    return result
