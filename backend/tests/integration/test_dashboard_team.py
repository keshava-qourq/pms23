"""Manager team dashboard integration tests (US-014.3):
GET /dashboard/team.

AC-038 a manager's team view lists each direct report's goals together with
their current progress. AC-039 a manager who attempts to reach an employee
outside their reporting line is denied that employee's goal data.

The approved API spec fixes GET /dashboard/team's success body as
'{reports: [...]}', one entry per direct report with that report's name
and goals (each goal carrying its progress). TC-001/TC-002 read the
reports out of that envelope rather than assuming the whole body is a
bare array.

Progress is set through PATCH /goals/{id}/progress, the one confirmed
contract point for a goal's percentage (see
backend/tests/test_rbac.py::test_ac006_executive_cannot_update_goal_progress),
called by each goal's own owner; nothing in this story or the read files
says a manager can also set a report's progress directly.
"""

import datetime
import secrets

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password

PASSWORD = secrets.token_urlsafe(16)


def _create_user(
    db_session: Session,
    *,
    email: str,
    role: str,
    manager_id=None,
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


def _login(client: TestClient, email: str, *, expected_role: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["access_token"]
    assert body["user"]["role"] == expected_role
    return body["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _make_goal(
    db_session: Session,
    *,
    owner: models.User,
    title: str,
    status: str = "In progress",
) -> models.Goal:
    goal = models.Goal(
        owner_id=owner.id,
        created_by=owner.id,
        title=title,
        target_metric="done",
        progress_type="percent",
        status=status,
        due_date=datetime.date(2026, 12, 31),
    )
    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)
    return goal


# ============================================================================
# TC-001 / AC-038: the team view lists each direct report's goals and
# progress
# ============================================================================


def test_tc001_manager_retrieves_team_view_showing_direct_reports_goals_and_progress(
    client: TestClient, db_session: Session
) -> None:
    manager = _create_user(
        db_session, email="manager1@example.com", role="manager", name="Manager One"
    )
    alice = _create_user(
        db_session,
        email="alice.grey@example.com",
        role="employee",
        manager_id=manager.id,
        name="Alice Grey",
    )
    bob = _create_user(
        db_session,
        email="bob.stone@example.com",
        role="employee",
        manager_id=manager.id,
        name="Bob Stone",
    )
    alice_goal = _make_goal(db_session, owner=alice, title="Alice's goal", status="In progress")
    bob_goal = _make_goal(db_session, owner=bob, title="Bob's goal", status="Completed")

    alice_token = _login(client, alice.email, expected_role="employee")
    set_alice_progress = client.patch(
        f"/goals/{alice_goal.id}/progress",
        headers=_headers(alice_token),
        json={"progress_percent": 40},
    )
    assert set_alice_progress.status_code == 200, set_alice_progress.text

    bob_token = _login(client, bob.email, expected_role="employee")
    set_bob_progress = client.patch(
        f"/goals/{bob_goal.id}/progress",
        headers=_headers(bob_token),
        json={"progress_percent": 100},
    )
    assert set_bob_progress.status_code == 200, set_bob_progress.text

    manager_token = _login(client, manager.email, expected_role="manager")

    response = client.get("/dashboard/team", headers=_headers(manager_token))

    assert response.status_code == 200, response.text
    body = response.json()
    reports = body["reports"]
    assert len(reports) == 2
    reports_by_name = {r["name"]: r for r in reports}
    assert set(reports_by_name) == {"Alice Grey", "Bob Stone"}
    alice_goals = reports_by_name["Alice Grey"]["goals"]
    assert any(g["title"] == alice_goal.title and g["progress_percent"] == 40 for g in alice_goals)
    bob_goals = reports_by_name["Bob Stone"]["goals"]
    assert any(
        g["title"] == bob_goal.title
        and g["progress_percent"] == 100
        and g["status"] == "Completed"
        for g in bob_goals
    )


# ============================================================================
# TC-002 / AC-038: a manager with no direct reports sees an empty team view
# ============================================================================


def test_tc002_manager_with_no_direct_reports_sees_an_empty_team_view(
    client: TestClient, db_session: Session
) -> None:
    manager = _create_user(
        db_session, email="manager2@example.com", role="manager", name="Manager Two"
    )

    token = _login(client, manager.email, expected_role="manager")

    response = client.get("/dashboard/team", headers=_headers(token))

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["reports"] == []


# ============================================================================
# TC-005 / AC-039: a manager is denied access to the goals of an employee
# outside their reporting line
# ============================================================================


def test_tc005_manager_denied_access_to_goals_outside_reporting_line(
    client: TestClient, db_session: Session
) -> None:
    manager1 = _create_user(
        db_session, email="manager1@example.com", role="manager", name="Manager One"
    )
    manager3 = _create_user(
        db_session, email="manager3@example.com", role="manager", name="Manager Three"
    )
    _create_user(
        db_session,
        email="alice.grey@example.com",
        role="employee",
        manager_id=manager1.id,
        name="Alice Grey",
    )
    _create_user(
        db_session,
        email="bob.stone@example.com",
        role="employee",
        manager_id=manager1.id,
        name="Bob Stone",
    )
    carol = _create_user(
        db_session,
        email="carol.white@example.com",
        role="employee",
        manager_id=manager3.id,
        name="Carol White",
    )
    carol_goal = _make_goal(db_session, owner=carol, title="Carol's confidential goal")

    token = _login(client, manager1.email, expected_role="manager")

    response = client.get("/goals", headers=_headers(token))

    assert response.status_code == 200, response.text
    titles = {g["title"] for g in response.json()}
    assert carol_goal.title not in titles
    assert "Carol White" not in response.text
