"""Goals, their progress and their check-ins."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
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
from app.scoping import is_in_reporting_line
from app.security import get_current_user

router = APIRouter(tags=["goals"])


def _get_goal_or_404(db: Session, goal_id: uuid.UUID) -> models.Goal:
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if goal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


def _can_access_goal(db: Session, current_user: models.User, goal: models.Goal) -> bool:
    if current_user.role == "hr_admin":
        return True
    if goal.owner_id == current_user.id:
        return True
    if current_user.role == "manager" and is_in_reporting_line(db, current_user.id, goal.owner_id):
        return True
    return False


def _get_objective_or_404(db: Session, objective_id: uuid.UUID) -> models.Objective:
    objective = db.query(models.Objective).filter(models.Objective.id == objective_id).first()
    if objective is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Objective not found")
    return objective


@router.post("/goals", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
async def create_goal(
    payload: GoalCreate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    if current_user.role not in ("employee", "manager", "hr_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    owner_id = payload.owner_id or current_user.id
    if owner_id != current_user.id:
        if current_user.role == "manager":
            if not is_in_reporting_line(db, current_user.id, owner_id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        elif current_user.role != "hr_admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    owner = db.query(models.User).filter(models.User.id == owner_id).first()
    if owner is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")

    parent_objective_id = None
    if payload.parent_objective_id is not None:
        objective = _get_objective_or_404(db, payload.parent_objective_id)
        parent_objective_id = objective.id

    goal = models.Goal(
        owner_id=owner_id,
        created_by=current_user.id,
        parent_objective_id=parent_objective_id,
        title=payload.title,
        description=payload.description,
        target_metric=payload.target_metric,
        progress_type=payload.progress_type,
        due_date=payload.due_date,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/goals", response_model=list[GoalRead])
async def list_goals(
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> list[models.Goal]:
    goals = db.query(models.Goal).all()
    if current_user.role == "hr_admin":
        return goals
    return [
        goal
        for goal in goals
        if goal.owner_id == current_user.id
        or is_in_reporting_line(db, current_user.id, goal.owner_id)
    ]


@router.put("/goals/{id}", response_model=GoalRead)
async def update_goal(
    id: uuid.UUID,
    payload: GoalUpdate,
    db: Session = Depends(get_db),  # noqa: B008
    current_user: models.User = Depends(get_current_user),  # noqa: B008
) -> models.Goal:
    goal = _get_goal_or_404(db, id)
    if not _can_access_goal(db, current_user, goal):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    if payload.parent_objective_id is not None:
        objective = _get_objective_or_404(db, payload.parent_objective_id)
        goal.parent_objective_id = objective.id

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
    if not _can_access_goal(db, current_user, goal):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    if payload.progress_percent is not None:
        goal.progress_percent = payload.progress_percent
    if payload.status is not None:
        goal.status = payload.status

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
    if not _can_access_goal(db, current_user, goal):
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
    if not _can_access_goal(db, current_user, goal):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return (
        db.query(models.CheckIn)
        .filter(models.CheckIn.goal_id == goal.id)
        .order_by(models.CheckIn.created_at.desc())
        .all()
    )
