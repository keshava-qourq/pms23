# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `634c876` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
PMS23 is an AI-SDLC-generated performance management system consisting of two separate apps in one repo: a Vite + React 19 single-page frontend that renders fully-approved screens against seeded sample data, and a FastAPI 0.115 backend that currently only has a real `/health` check, working auth (login/logout) and employee/reporting-line management implemented, with every other endpoint (goals, objectives, dashboard, analytics, praise, notifications, password reset) scaffolded as typed stub responses awaiting implementation. The backend persists through SQLAlchemy models to SQLite by default (Postgres in the approved architecture), with schema managed via Alembic migrations, and the frontend is not yet wired to the backend API.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for npm/Vite 6, React 19, TypeScript 5.6)
- Python 3.12
- pip
- Docker and Docker Compose (optional, for Postgres/Redis via docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. Backend: cd backend && pip install -r requirements.txt
3. Backend: apply database migrations with `alembic upgrade head` (schema comes from Alembic, not runtime create_all)
4. Backend: optionally set DATABASE_URL to point at a Postgres instance; defaults to sqlite:///./app.db if unset
5. Frontend: cd frontend && npm install
6. Frontend: optionally set VITE_API_BASE_URL to point at a running backend; defaults to http://localhost:8000
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service locally with autoreload |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA |
| frontend build | `cd frontend && npm run build` | Bundles the app with Vite (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally |
| docker services | `docker compose up` | Starts Postgres and Redis containers defined in docker-compose.yml |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `backend/` | FastAPI service: app code, Alembic migrations, tests, Dockerfile |
| `backend/app` | Application package: main entrypoint, models, schemas, routers, security, database |
| `backend/app/routers` | One router module per API resource (auth, employees, goals, objectives, dashboard, analytics, praise, notifications, audit) |
| `backend/alembic` | Alembic migration environment and versioned schema migrations |
| `backend/tests` | Pytest suite covering auth, employees, security, health, and route stubs |
| `backend/scripts` | Operational helper scripts (e.g. connection checks) |
| `frontend/` | Vite + React 19 single-page app: approved screens running on seeded sample data |
| `frontend/src` | Application source: screens, shared lib (api client, UI kit, icons, brand tokens) |
| `frontend/src/screens` | One module per approved screen (Login, Dashboard, GoalDetail, Team, Praise, Employees) |
| `frontend/src/lib` | Shared API client (api.ts), UI component/icon vocabulary, brand tokens, navigation helpers |
| `frontend/e2e` | Playwright acceptance tests run against a locally served build or a deployed URL |
| `.devcontainer` | VS Code/Codespaces container configuration |
| `.quorq` | Quorq platform metadata (handoff/prepared state), not application code |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend: one FastAPI router per resource, all mounted via the ALL_ROUTERS tuple in app/routers/__init__.py
- Unimplemented endpoints return a typed StubResponse(endpoint=..., status='not_implemented') rather than erroring, keeping the OpenAPI schema complete
- SQLAlchemy models use UUID primary keys (custom GUID type) and contain columns/foreign keys only, no relationship() graphs or query helpers
- Pydantic schemas follow a *Create / *Update / *Read naming pattern per entity, with from_attributes for ORM reads
- Role-based access enforced via security.require_roles / get_current_user dependencies (e.g. hr_admin-only employee and audit endpoints)
- Mutations that matter for compliance call app.audit.record_change to write an AuditLog row with before/after state
- Frontend screens are one-per-file under src/screens, currently rendering seeded data rather than calling the API
- Shared API calls go through src/lib/api.ts's apiFetch, which attaches a bearer token (session token or baked-in secret) and handles base URL joining
- Frontend styling uses Tailwind CSS plus CSS variables for brand tokens (src/lib/brand.ts, src/index.css)
- Database defaults to SQLite locally; DATABASE_URL env var switches to the production Postgres target with no code changes
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite (auth, employees, security, health, routes) |
| backend lint | `cd backend && ruff check .` | Lints the backend Python code |
| backend format check | `cd backend && ruff format .` | Formats backend Python code with ruff |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests beside the components they cover |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend app (CI gate) |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit (not enforced by npm run build) |
| frontend format check | `cd frontend && npm run format:check` | Checks formatting with Prettier |
| frontend e2e | `cd frontend && npm run test:e2e` | Runs Playwright acceptance tests from e2e/, booting backend and frontend locally unless E2E_BASE_URL is set |
| install e2e browser | `cd frontend && npm run test:e2e:install` | Installs the Chromium browser Playwright needs |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| `pytest` fails with `ModuleNotFoundError: No module named 'app'` when run from backend/ | Run pytest from the backend/ directory; backend/pytest.ini sets pythonpath=. so `import app` resolves |
| Frontend requests to the backend are blocked by CORS | Set the backend's ALLOWED_ORIGINS env var (comma-separated) to include the frontend origin; it defaults to the Vite dev server origins (localhost:5173) |
| `npm run build` succeeds but the app has type errors | vite build does not typecheck; run `npm run typecheck` (tsc --noEmit) separately to catch issues before shipping |
| Calling most API endpoints (goals, objectives, dashboard, analytics, praise, notifications, password reset) returns a stub body instead of real data | These routes are scaffolded placeholders per README; only /health, /auth/login, /auth/logout, and the /employees endpoints have real behavior implemented |
| Playwright e2e tests fail to start the backend | The webServer config expects a Python venv at backend/.venv with dependencies installed (`.venv/bin/python -m uvicorn ...`); create and populate that venv, or set E2E_BASE_URL to run against an already-deployed instance |
| Backend can't connect to a database | By default DATABASE_URL is unset and the app uses local SQLite (sqlite:///./app.db); only set DATABASE_URL to Postgres if that server is actually running, and apply `alembic upgrade head` against it first |
<!-- sdlc:auto:end troubleshooting -->
