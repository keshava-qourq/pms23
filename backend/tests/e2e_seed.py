"""Seeds known users for the Playwright e2e suite, against the real sandbox
Postgres named by DATABASE_URL (see ENVIRONMENT.md) -- never SQLite, and
never mocked.

Idempotent: upserts by email, so re-running the suite (or running it
concurrently across spec files) never accumulates duplicate rows or fails on
a unique-email constraint.

Not named test_*.py on purpose: pytest must never collect this as a test; it
is a fixture script the e2e suite's spec files invoke directly, the way
backend/tests/conftest.py is a fixture module pytest imports rather than a
test itself.
"""

import os
import sys

# Running this file directly (`python tests/e2e_seed.py`) only puts
# backend/tests/ on sys.path, not backend/ itself. Add the parent so
# `import app` resolves the same way it does for every other test here.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from app import models  # noqa: E402
from app.security import hash_password  # noqa: E402

E2E_PASSWORD = "Str0ng!PassE2E"

E2E_USERS = [
    {"email": "e2e.employee@example.com", "name": "E2E Employee", "role": "employee", "is_active": True},
    {"email": "e2e.manager@example.com", "name": "E2E Manager", "role": "manager", "is_active": True},
    {"email": "e2e.hradmin@example.com", "name": "E2E HR Admin", "role": "hr_admin", "is_active": True},
    {
        "email": "e2e.executive@example.com",
        "name": "E2E Executive",
        "role": "executive",
        "is_active": True,
    },
    {
        "email": "e2e.deactivated@example.com",
        "name": "E2E Deactivated",
        "role": "employee",
        "is_active": False,
    },
]


def main() -> None:
    database_url = os.environ["DATABASE_URL"]
    engine = create_engine(database_url, pool_pre_ping=True, future=True)
    password_hash = hash_password(E2E_PASSWORD)
    try:
        with Session(engine) as session:
            for spec in E2E_USERS:
                user = (
                    session.query(models.User)
                    .filter(models.User.email == spec["email"])
                    .first()
                )
                if user is None:
                    user = models.User(
                        email=spec["email"],
                        name=spec["name"],
                        role=spec["role"],
                        password_hash=password_hash,
                        is_active=spec["is_active"],
                    )
                    session.add(user)
                else:
                    user.name = spec["name"]
                    user.role = spec["role"]
                    user.password_hash = password_hash
                    user.is_active = spec["is_active"]
            session.commit()
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
