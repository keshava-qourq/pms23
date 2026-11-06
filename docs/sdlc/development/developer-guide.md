# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `9b91c03` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
PMS23 is a generated performance-management system consisting of two separate applications in one repo: a React 19 + Vite single-page frontend whose screens were approved by the team and currently render seeded sample data, and a FastAPI 0.115 backend with SQLAlchemy models, Alembic migrations, JWT-based auth/RBAC, Redis caching and a SendGrid email hook. The backend persists to SQLite by default (via DATABASE_URL) so it runs without any database server, while the approved architecture targets PostgreSQL 16 and Redis in deployment (see docker-compose.yml). Most backend routes beyond auth, goals, employees, dashboard, analytics, praise and notifications are implemented; a few (employee export, personal-data deletion) are still typed stubs. The frontend is not yet wired to this API -- frontend/src/lib/api.ts is the integration seam.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for Vite 6 / React 19, per frontend/package.json)
- npm
- Python 3.12 (per backend/Dockerfile)
- pip
- Docker and Docker Compose (optional, for Postgres and Redis via docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. Copy .env.example to .env and adjust values as needed
3. cd backend && pip install -r requirements.txt
4. (Optional) Start Postgres/Redis for a closer-to-deployment setup: docker compose up -d
5. cd backend && uvicorn app.main:app --reload  # starts the API on http://localhost:8000
6. cd frontend && npm install
7. cd frontend && npm run dev  # starts the SPA on http://localhost:5173
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI app with auto-reload; defaults to a local SQLite DB (app.db) unless DATABASE_URL is set. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the SPA. |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite; does not run TypeScript type-checking. |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally. |
| docker compose | `docker compose up -d` | Starts Postgres 16 and two Redis instances (redis-queue, redis) defined in docker-compose.yml. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `backend/app` | FastAPI application: main.py entrypoint, models.py (SQLAlchemy), schemas.py (Pydantic), database.py, security.py, scoping.py, audit.py, cache.py, email.py, settings.py |
| `backend/app/routers` | One router module per resource (auth, employees, goals, objectives, dashboard, analytics, praise, notifications, audit), all mounted via ALL_ROUTERS in routers/__init__.py |
| `backend/alembic` | Alembic migration environment and versioned schema migrations; the app no longer calls create_all, so migrations must be applied before/at startup |
| `backend/tests` | Pytest suite: auth, RBAC, employees, praise, password rules/reset, security, health and route tests, plus e2e seeding/reset helpers |
| `backend/scripts` | Standalone operational scripts (e.g. check_connections.py) |
| `frontend/src` | React SPA source: App.tsx (routes/shell), main.tsx (bootstrap), screens/, lib/ |
| `frontend/src/screens` | One module per approved screen (Login, Dashboard, GoalDetail, Team, Praise, Employees, ForgotPassword, ResetPassword) plus their colocated Vitest tests |
| `frontend/src/lib` | Shared frontend code: api.ts (API client/session token handling), ui.tsx/icons.tsx (component vocabulary), brand.ts (design tokens), navigate.ts |
| `frontend/e2e` | Playwright acceptance specs (login, employees, praise, password reset) and fixtures |
| `.devcontainer` | Dev container configuration for the repo |
| `.quorq` | Platform metadata (handoff.json, prepared.json) used by the Quorq SDLC platform, not application code |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend: one router module per resource, all registered together in app/routers/__init__.py's ALL_ROUTERS tuple, which app/main.py mounts
- Backend: one Pydantic Create/Update/Read schema pair per entity in app/schemas.py, mirroring the SQLAlchemy models in app/models.py
- SQLAlchemy models use a custom GUID TypeDecorator so the same model works against Postgres (native uuid) and SQLite (CHAR(36)) in tests
- Role-based access is enforced via shared security.py dependencies: get_current_user and require_roles(...), applied per-route rather than globally
- Ownership/reporting-line scoping logic is centralized in app/scoping.py (visible_owner_ids, is_in_reporting_line, would_create_cycle) and reused across routers
- Mutations that matter for compliance are recorded via app/audit.py's record_change into the audit_log table
- Any endpoint not yet implemented returns a typed StubResponse rather than a 404/501, keeping the OpenAPI spec complete
- Schema changes are made via Alembic migrations in backend/alembic/versions; the app never calls create_all at runtime
- Frontend: one screen module per approved design screen under src/screens/, each colocated with its own Vitest test file
- Frontend screens currently render seeded/sample data and are not yet wired to the backend; frontend/src/lib/api.ts (apiFetch, session token helpers) is the intended integration point
- Frontend styling uses Tailwind utility classes plus CSS variables/tokens defined in src/lib/brand.ts and src/index.css
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite (auth, RBAC, employees, praise, password rules, security, routes, health). |
| backend lint | `cd backend && ruff check .` | Lints the backend Python code with ruff. |
| backend format | `cd backend && ruff format .` | Formats backend Python code with ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests located beside the components they cover. |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit; not run by `npm run build`, so worth running separately before shipping. |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend app (the gate the platform runs during development). |
| frontend e2e install | `cd frontend && npm run test:e2e:install` | Installs the Chromium browser Playwright needs. |
| frontend e2e | `cd frontend && npm run test:e2e` | Runs Playwright acceptance specs from e2e/; without E2E_BASE_URL it boots the backend (from backend/.venv) and builds/serves the frontend itself. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Frontend calls to the backend fail with a CORS error | Set the ALLOWED_ORIGINS env var (comma-separated) read in backend/app/main.py to include the frontend's origin; it defaults to http://localhost:5173/http://127.0.0.1:5173 only. |
| Backend fails to start or query against an unreachable database | Check DATABASE_URL (backend/app/database.py); it defaults to a local SQLite file (sqlite:///./app.db), so point it at a reachable Postgres instance (e.g. via docker compose up -d) or unset it to fall back to SQLite. |
| `npm run build` succeeds but the app is actually type-broken | Run `npm run typecheck` (tsc --noEmit) separately -- the build step does not type-check, per frontend/README.md. |
| `npm run test:e2e` fails to boot the backend | Playwright's webServer expects a Python venv at backend/.venv with dependencies installed (see frontend/playwright.config.ts); create it with `cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt` before running e2e tests, or set E2E_BASE_URL to point at an already-running deployment. |
| Running `pytest` from the repo root fails to import `app` | Run pytest from inside backend/ (backend/pytest.ini sets pythonpath = . relative to that directory): `cd backend && pytest`. |
<!-- sdlc:auto:end troubleshooting -->
