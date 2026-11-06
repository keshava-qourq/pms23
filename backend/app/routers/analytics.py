"""Executive and HR admin read-only org-level analytics (NFR-001, NFR-009).

Aggregated in SQL from PostgreSQL (NFR-006), cached briefly in Redis; a
missing cache key just means the next read recomputes it. No individually
editable record is ever included -- only organisation-level counts.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models
from app.cache import get_cached, set_cached
from app.database import get_db
from app.schemas import AnalyticsResponse
from app.security import require_roles

router = APIRouter(tags=["analytics"])

_CACHE_KEY = "analytics:org"
_CACHE_TTL = 60


@router.get("/analytics", response_model=AnalyticsResponse)
async def analytics(
    db: Session = Depends(get_db),  # noqa: B008
    _current_user: models.User = Depends(require_roles("executive", "hr_admin")),  # noqa: B008
) -> AnalyticsResponse:
    cached = get_cached(_CACHE_KEY)
    if cached is not None:
        return AnalyticsResponse.model_validate(cached)

    total_employees = (
        db.query(func.count(models.User.id)).filter(models.User.is_active.is_(True)).scalar() or 0
    )
    goal_counts = (
        db.query(models.Goal.status, func.count(models.Goal.id)).group_by(models.Goal.status).all()
    )
    goals_by_status = {status: count for status, count in goal_counts}
    total_goals = sum(goals_by_status.values())
    completed_goals = goals_by_status.get("Completed", 0)
    average_progress = db.query(func.avg(models.Goal.progress_percent)).scalar()

    response = AnalyticsResponse(
        total_employees=total_employees,
        total_goals=total_goals,
        completed_goals=completed_goals,
        average_progress=round(float(average_progress), 2) if average_progress is not None else 0.0,
        goals_by_status=goals_by_status,
    )
    set_cached(_CACHE_KEY, response.model_dump(mode="json"), ttl=_CACHE_TTL)
    return response
