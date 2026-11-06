"""Goals, their progress and their check-ins.

Every endpoint sits behind the shared RBAC dependency (app.security) and the
reusable reporting-line scope (app.scoping.visible_owner_ids): employees see
only their own goals, managers see their own and their reports' (direct and
transitive), hr_admin and executive see every goal. Executives are
read-only everywhere here -- every write raises 403 (NFR-001/AC-006).
"""

import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import (
    CheckInCreate,
    CheckInRead,
    GoalCreate,
    GoalProgressUpdate,
    GoalRead,
    GoalUpdate,
)
from app.scoping import visible_owner_ids
from app.security import get_current_user

router = APIRouter(tags=["goals"])

_LIMIT_QUERY = Query(default=50, ge=1, le=200)
_OFFSET_QUERY = Query(default=0, ge=0)


def _get_goal_or_404(db: Session, goal_id: uuid.UUID) -> models.Goal:
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if goal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


def _can_view_goal(db: Session, user: models.User, goal: models.Goal) -> bool:
    ids = visible_owner_ids(db, user)
    return ids is None or goal.owner_id in ids


def _can_write_goal(db: Session, user: models.User, goal: models.Goal) -> bool:
    return user.role != "executive" and _can_view_goal(db, user, goal)


@router.post("/goals", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
async def create_goal(
    payload: GoalCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    if current_user.role == "executive":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    owner_id = payload.owner_id or current_user.id
    if owner_id != current_user.id:
        owner = db.query(models.User).filter(models.User.id == owner_id).first()
        if owner is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")
        ids = visible_owner_ids(db, current_user)
        if ids is not None and owner_id not in ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    if payload.parent_objective_id is not None:
        objective = (
            db.query(models.Objective)
            .filter(models.Objective.id == payload.parent_objective_id)
            .first()
        )
        if objective is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Objective not found")

    goal = models.Goal(
        owner_id=owner_id,
        created_by=current_user.id,
        parent_objective_id=payload.parent_objective_id,
        title=payload.title,
        description=payload.description,
        target_metric=payload.target_metric,
        progress_type=payload.progress_type,
        due_date=payload.due_date,
        status="Not started",
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/goals", response_model=list[GoalRead])
async def list_goals(
    limit: int = _LIMIT_QUERY,
    offset: int = _OFFSET_QUERY,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Goal]:
    ids = visible_owner_ids(db, current_user)
    query = db.query(models.Goal)
    if ids is not None:
        query = query.filter(models.Goal.owner_id.in_(ids))
    return query.order_by(models.Goal.created_at.desc()).offset(offset).limit(limit).all()


@router.put("/goals/{id}", response_model=GoalRead)
async def update_goal(
    id: uuid.UUID,
    payload: GoalUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    goal = _get_goal_or_404(db, id)
    if not _can_write_goal(db, current_user, goal):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    if payload.parent_objective_id is not None:
        objective = (
            db.query(models.Objective)
            .filter(models.Objective.id == payload.parent_objective_id)
            .first()
        )
        if objective is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Objective not found")
        goal.parent_objective_id = payload.parent_objective_id
    if payload.title is not None:
        goal.title = payload.title
    if payload.description is not None:
        goal.description = payload.description
    if payload.target_metric is not None:
        goal.target_metric = payload.target_metric
    if payload.due_date is not None:
        goal.due_date = payload.due_date

    db.commit()
    db.refresh(goal)
    return goal


@router.patch("/goals/{id}/progress", response_model=GoalRead)
async def update_goal_progress(
    id: uuid.UUID,
    payload: GoalProgressUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    goal = _get_goal_or_404(db, id)
    if not _can_write_goal(db, current_user, goal):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    if payload.progress_percent is not None:
        goal.progress_percent = payload.progress_percent
        if payload.progress_percent >= 100:
            goal.status = "Completed"
    if payload.status is not None:
        goal.status = payload.status

    if goal.status == "Completed":
        if goal.completed_at is None:
            goal.completed_at = datetime.now(UTC)
    else:
        goal.completed_at = None

    db.commit()
    db.refresh(goal)
    return goal


@router.post(
    "/goals/{id}/check-ins", response_model=CheckInRead, status_code=status.HTTP_201_CREATED
)
async def add_check_in(
    id: uuid.UUID,
    payload: CheckInCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.CheckIn:
    goal = _get_goal_or_404(db, id)
    if not _can_write_goal(db, current_user, goal):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    check_in = models.CheckIn(goal_id=goal.id, author_id=current_user.id, note=payload.note)
    db.add(check_in)
    db.commit()
    db.refresh(check_in)
    return check_in


@router.get("/goals/{id}/check-ins", response_model=list[CheckInRead])
async def list_check_ins(
    id: uuid.UUID,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.CheckIn]:
    goal = _get_goal_or_404(db, id)
    if not _can_view_goal(db, current_user, goal):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return (
        db.query(models.CheckIn)
        .filter(models.CheckIn.goal_id == goal.id)
        .order_by(models.CheckIn.created_at)
        .all()
    )
