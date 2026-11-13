"""Applies this project's Alembic migrations against whatever `DATABASE_URL`
names, so the e2e fixtures (`e2e_seed.py`, `e2e_reset_helper.py`) never fail
with "no such table" / "relation does not exist" just because nobody has run
`alembic upgrade head` against the sandbox database yet.

`alembic upgrade head` is idempotent -- a database already at head is left
alone -- so calling this at the start of every fixture script is safe to run
repeatedly and concurrently across spec files, the same way `e2e_seed.py`'s
upsert-by-email seeding already is.
"""

import os

from alembic.config import Config

from alembic import command

_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ensure_schema() -> None:
    config = Config(os.path.join(_BACKEND_DIR, "alembic.ini"))
    config.set_main_option("script_location", os.path.join(_BACKEND_DIR, "alembic"))
    command.upgrade(config, "head")
