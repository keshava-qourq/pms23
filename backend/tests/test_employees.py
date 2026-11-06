"""Employee record maintenance, deactivation, reporting lines, cycle
prevention and the audit trail (US-004-1/US-004-2 contract; absorbs US-005).

AC-011 create, AC-012 edit-and-reflect and AC-013 deactivate exercise
`POST /employees`, `PUT /employees/{id}` and `POST /employees/{id}/deactivate`.
As of this run those three handlers are still scaffolded stubs (see
backend/app/routers/employees.py -- each just returns `StubResponse`), so
these tests are written against the acceptance criteria and the approved
schemas/spec, not against today's stub behaviour. They are expected to start
failing the moment the real handlers land and to then prove them. Until then
their failures are not defects in these tests; they are the hand-off point for
whoever implements AC-011/012/013.

AC-014/015/016 and the manager-change half of NFR-004 exercise
`PUT /employees/{id}/manager` and `GET /employees/{id}/reports`, which are
already implemented, so those run for real against the sandbox-equivalent
in-memory database the `client`/`db_session` fixtures provide.
"""

import datetime
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import create_access_token, hash_password

PASSWORD = "Str0ng!PassQA123"


def _create_user(
    db_session: Session,
    *,
    email: str,
    role: str,
    is_active: bool = True,
    manager_id: uuid.UUID | None = None,
    name: str = "Test User",
    password: str = PASSWORD,
) -> models.User:
    user = models.User(
        email=email,
        name=name,
        password_hash=hash_password(password),
        role=role,
        is_active=is_active,
        manager_id=manager_id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _headers(user: models.User) -> dict:
    token = create_access_token(subject=str(user.id), role=user.role)
    return {"Authorization": f"Bearer {token}"}


# ============================================================================
# AC-011: HR admin creates an employee record
# ============================================================================


def test_ac011_hr_admin_creates_employee(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac011@example.com", role="hr_admin")

    response = client.post(
        "/employees",
        headers=_headers(hr_admin),
        json={"name": "New Hire", "email": "new.hire@example.com", "role": "employee"},
    )

    assert response.status_code in (200, 201), response.text
    body = response.json()
    assert body["name"] == "New Hire"
    assert body["email"] == "new.hire@example.com"
    assert body["role"] == "employee"
    assert body["is_active"] is True
    created = db_session.query(models.User).filter_by(email="new.hire@example.com").first()
    assert created is not None


def test_ac011_duplicate_email_returns_409(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-dup@example.com", role="hr_admin")
    _create_user(db_session, email="taken@example.com", role="employee")

    response = client.post(
        "/employees",
        headers=_headers(hr_admin),
        json={"name": "Someone Else", "email": "taken@example.com", "role": "employee"},
    )

    assert response.status_code == 409, response.text


@pytest.mark.parametrize("role", ["employee", "manager", "executive"])
def test_ac011_non_hr_admin_cannot_create_employee(
    client: TestClient, db_session: Session, role: str
) -> None:
    caller = _create_user(db_session, email=f"caller-{role}@example.com", role=role)

    response = client.post(
        "/employees",
        headers=_headers(caller),
        json={"name": "Blocked Hire", "email": "blocked.hire@example.com", "role": "employee"},
    )

    assert response.status_code == 403


# ============================================================================
# AC-012: HR admin edits an employee record, response and store reflect it
# ============================================================================


def test_ac012_edit_reflects_in_response_and_store(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac012@example.com", role="hr_admin")
    employee = _create_user(db_session, email="before-edit@example.com", role="employee")

    response = client.put(
        f"/employees/{employee.id}",
        headers=_headers(hr_admin),
        json={"name": "After Edit", "email": "after-edit@example.com"},
    )

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["name"] == "After Edit"
    assert body["email"] == "after-edit@example.com"
    db_session.refresh(employee)
    assert employee.name == "After Edit"
    assert employee.email == "after-edit@example.com"


def test_ac012_non_hr_admin_cannot_edit_employee(client: TestClient, db_session: Session) -> None:
    manager = _create_user(db_session, email="mgr-ac012@example.com", role="manager")
    employee = _create_user(db_session, email="target-ac012@example.com", role="employee")

    response = client.put(
        f"/employees/{employee.id}",
        headers=_headers(manager),
        json={"name": "Should Not Apply"},
    )

    assert response.status_code == 403


# ============================================================================
# AC-013: deactivation blocks login while goals/praise/history survive
# ============================================================================


def test_ac013_deactivate_blocks_login(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac013@example.com", role="hr_admin")
    employee = _create_user(db_session, email="soon-gone@example.com", role="employee")

    response = client.post(f"/employees/{employee.id}/deactivate", headers=_headers(hr_admin))
    assert response.status_code == 200, response.text
    assert response.json()["is_active"] is False

    login = client.post("/auth/login", json={"email": "soon-gone@example.com", "password": PASSWORD})
    assert login.status_code == 401


def test_ac013_deactivation_preserves_goals_praise_and_history(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="hr-ac013b@example.com", role="hr_admin")
    employee = _create_user(db_session, email="leaving@example.com", role="employee")

    goal = models.Goal(
        owner_id=employee.id,
        created_by=employee.id,
        title="Ship the thing",
        target_metric="done",
        progress_type="status",
        status="In progress",
        due_date=datetime.date(2026, 12, 31),
    )
    praise = models.Praise(sender_id=hr_admin.id, recipient_id=employee.id, message="Nice work")
    db_session.add_all([goal, praise])
    db_session.commit()

    response = client.post(f"/employees/{employee.id}/deactivate", headers=_headers(hr_admin))
    assert response.status_code == 200, response.text

    assert db_session.query(models.Goal).filter_by(owner_id=employee.id).count() == 1
    assert db_session.query(models.Praise).filter_by(recipient_id=employee.id).count() == 1
    still_there = db_session.query(models.User).filter_by(id=employee.id).first()
    assert still_there is not None


def test_ac013_non_hr_admin_cannot_deactivate(client: TestClient, db_session: Session) -> None:
    manager = _create_user(db_session, email="mgr-ac013@example.com", role="manager")
    employee = _create_user(db_session, email="target-ac013@example.com", role="employee")

    response = client.post(f"/employees/{employee.id}/deactivate", headers=_headers(manager))

    assert response.status_code == 403


# ============================================================================
# AC-014: a direct report appears under its manager
# ============================================================================


def test_ac014_direct_report_appears_in_manager_reports(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="hr-ac014@example.com", role="hr_admin")
    manager = _create_user(db_session, email="mgr-ac014@example.com", role="manager")
    employee = _create_user(db_session, email="report-ac014@example.com", role="employee")

    assign = client.put(
        f"/employees/{employee.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(manager.id)},
    )
    assert assign.status_code == 200, assign.text

    reports = client.get(f"/employees/{manager.id}/reports", headers=_headers(manager))
    assert reports.status_code == 200
    ids = {row["id"] for row in reports.json()}
    assert str(employee.id) in ids


# ============================================================================
# AC-015: reassignment revokes the previous manager's access
# ============================================================================


def test_ac015_reassignment_revokes_previous_manager_access(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="hr-ac015@example.com", role="hr_admin")
    old_manager = _create_user(db_session, email="old-mgr@example.com", role="manager")
    new_manager = _create_user(db_session, email="new-mgr@example.com", role="manager")
    employee = _create_user(
        db_session, email="movable@example.com", role="employee", manager_id=old_manager.id
    )

    before = client.get(f"/employees/{employee.id}/reports", headers=_headers(old_manager))
    assert before.status_code == 200  # old manager can read while still in the line

    reassign = client.put(
        f"/employees/{employee.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(new_manager.id)},
    )
    assert reassign.status_code == 200, reassign.text

    after = client.get(f"/employees/{employee.id}/reports", headers=_headers(old_manager))
    assert after.status_code in (403, 404)

    confirm_new = client.get(f"/employees/{employee.id}/reports", headers=_headers(new_manager))
    assert confirm_new.status_code == 200


# ============================================================================
# AC-016: self, two-node and three-node cycles are rejected, nothing persisted
# ============================================================================


def test_ac016_rejects_self_assignment(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac016a@example.com", role="hr_admin")
    employee = _create_user(db_session, email="self-loop@example.com", role="employee")

    response = client.put(
        f"/employees/{employee.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(employee.id)},
    )

    assert response.status_code == 400
    db_session.refresh(employee)
    assert employee.manager_id is None


def test_ac016_rejects_two_node_cycle(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac016b@example.com", role="hr_admin")
    a = _create_user(db_session, email="two-a@example.com", role="manager")
    b = _create_user(db_session, email="two-b@example.com", role="manager", manager_id=a.id)

    response = client.put(
        f"/employees/{a.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(b.id)},
    )

    assert response.status_code == 400
    db_session.refresh(a)
    assert a.manager_id is None


def test_ac016_rejects_three_node_cycle(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac016c@example.com", role="hr_admin")
    a = _create_user(db_session, email="three-a@example.com", role="manager")
    b = _create_user(db_session, email="three-b@example.com", role="manager", manager_id=a.id)
    _ = _create_user(db_session, email="three-c@example.com", role="manager", manager_id=b.id)
    c = _ = db_session.query(models.User).filter_by(email="three-c@example.com").first()

    response = client.put(
        f"/employees/{a.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(c.id)},
    )

    assert response.status_code == 400
    db_session.refresh(a)
    assert a.manager_id is None


# ============================================================================
# NFR-004: manager-change audit trail, retrievable and hr_admin only
# ============================================================================


def test_nfr004_manager_change_produces_audit_row(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="hr-nfr004@example.com", role="hr_admin")
    manager = _create_user(db_session, email="mgr-nfr004@example.com", role="manager")
    employee = _create_user(db_session, email="emp-nfr004@example.com", role="employee")

    before_call = client.put(
        f"/employees/{employee.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(manager.id)},
    )
    assert before_call.status_code == 200

    audit = client.get("/audit-log", headers=_headers(hr_admin))
    assert audit.status_code == 200
    entries = audit.json()
    matches = [
        e
        for e in entries
        if e["entity_id"] == str(employee.id) and e["action"] == "manager_changed"
    ]
    assert len(matches) == 1
    entry = matches[0]
    assert entry["actor_id"] == str(hr_admin.id)
    assert entry["changes"]["new_manager_id"] == str(manager.id)
    assert entry["changes"]["previous_manager_id"] is None
    assert entry["created_at"]


@pytest.mark.parametrize("role", ["employee", "manager", "executive"])
def test_nfr004_audit_log_is_hr_admin_only(
    client: TestClient, db_session: Session, role: str
) -> None:
    caller = _create_user(db_session, email=f"audit-caller-{role}@example.com", role=role)

    response = client.get("/audit-log", headers=_headers(caller))

    assert response.status_code == 403
