"""Manager team dashboard (US-014).

AC-038: a manager opening their team view sees each direct report's goals
and progress. AC-039: naming an employee outside the caller's reporting
line is denied.
"""

import datetime
import uuid

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password

PASSWORD = "correct horse battery staple"


def _create_user(
    db_session: Session,
    *,
    email: str,
    role: str = "employee",
    manager_id: uuid.UUID | None = None,
    name: str = "Test User",
) -> models.User:
    user = models.User(
        email=email,
        name=name,
        password_hash=hash_password(PASSWORD),
        role=role,
        is_active=True,
        manager_id=manager_id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _make_goal(
    db_session: Session,
    *,
    owner: models.User,
    title: str = "A goal",
    progress_percent: int = 40,
    due_date: datetime.date = datetime.date(2026, 12, 31),
) -> models.Goal:
    goal = models.Goal(
        owner_id=owner.id,
        created_by=owner.id,
        title=title,
        target_metric="done",
        progress_type="percent",
        progress_percent=progress_percent,
        status="In progress",
        due_date=due_date,
    )
    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)
    return goal


def _login(client: TestClient, email: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ============================================================================
# AC-038: direct reports' goals and progress show up in the team view
# ============================================================================


def test_ac038_team_view_shows_each_direct_reports_goals_and_progress(
    client: TestClient, db_session: Session
) -> None:
    manager = _create_user(db_session, email="ac038-mgr@example.com", role="manager")
    report_a = _create_user(
        db_session, email="ac038-a@example.com", name="Report A", manager_id=manager.id
    )
    report_b = _create_user(
        db_session, email="ac038-b@example.com", name="Report B", manager_id=manager.id
    )
    goal_a = _make_goal(db_session, owner=report_a, title="A's goal", progress_percent=25)
    goal_b = _make_goal(db_session, owner=report_b, title="B's goal", progress_percent=75)
    token = _login(client, "ac038-mgr@example.com")

    response = client.get("/dashboard/team", headers=_headers(token))

    assert response.status_code == 200, response.text
    body = response.json()
    reports_by_name = {r["name"]: r for r in body["reports"]}
    assert set(reports_by_name) == {"Report A", "Report B"}
    assert reports_by_name["Report A"]["goals"][0]["title"] == goal_a.title
    assert reports_by_name["Report A"]["goals"][0]["progress_percent"] == 25
    assert reports_by_name["Report B"]["goals"][0]["title"] == goal_b.title
    assert reports_by_name["Report B"]["goals"][0]["progress_percent"] == 75


def test_ac038_manager_with_no_reports_sees_an_empty_team_view(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac038b-mgr@example.com", role="manager")
    token = _login(client, "ac038b-mgr@example.com")

    response = client.get("/dashboard/team", headers=_headers(token))

    assert response.status_code == 200
    assert response.json()["reports"] == []


def test_ac038_skip_level_report_is_reachable_through_a_named_employee_id(
    client: TestClient, db_session: Session
) -> None:
    manager = _create_user(db_session, email="ac038c-mgr@example.com", role="manager")
    direct_report = _create_user(
        db_session, email="ac038c-direct@example.com", manager_id=manager.id
    )
    skip_level_report = _create_user(
        db_session,
        email="ac038c-skip@example.com",
        name="Skip Level",
        manager_id=direct_report.id,
    )
    skip_goal = _make_goal(db_session, owner=skip_level_report, title="Skip-level goal")
    token = _login(client, "ac038c-mgr@example.com")

    response = client.get(
        "/dashboard/team",
        headers=_headers(token),
        params={"employee_id": str(direct_report.id)},
    )

    assert response.status_code == 200, response.text
    reports = response.json()["reports"]
    assert len(reports) == 1
    assert reports[0]["goals"][0]["title"] == skip_goal.title


# ============================================================================
# AC-039: an employee outside the caller's reporting line is denied
# ============================================================================


def test_ac039_manager_denied_an_employee_outside_their_reporting_line(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac039-mgr@example.com", role="manager")
    outsider = _create_user(db_session, email="ac039-outsider@example.com")
    token = _login(client, "ac039-mgr@example.com")

    response = client.get(
        "/dashboard/team", headers=_headers(token), params={"employee_id": str(outsider.id)}
    )

    assert response.status_code == 403


def test_ac039_unknown_employee_id_returns_404(client: TestClient, db_session: Session) -> None:
    _create_user(db_session, email="ac039b-mgr@example.com", role="manager")
    token = _login(client, "ac039b-mgr@example.com")

    response = client.get(
        "/dashboard/team", headers=_headers(token), params={"employee_id": str(uuid.uuid4())}
    )

    assert response.status_code == 404


def test_ac039_hr_admin_may_view_any_employees_team(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac039c-hr@example.com", role="hr_admin")
    unrelated_manager = _create_user(db_session, email="ac039c-mgr@example.com", role="manager")
    token = _login(client, "ac039c-hr@example.com")

    response = client.get(
        "/dashboard/team",
        headers=_headers(token),
        params={"employee_id": str(unrelated_manager.id)},
    )

    assert response.status_code == 200


def test_team_dashboard_requires_a_bearer_token(client: TestClient) -> None:
    response = client.get("/dashboard/team")

    assert response.status_code == 401
