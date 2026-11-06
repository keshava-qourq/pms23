# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Email/password login | US-001, US-001-T1, US-001-T2, US-001-T3 | 1 | POST /auth/login, POST /auth/logout, backend_api, database, frontend, users | backend/alembic.ini, backend/alembic/env.py, backend/alembic/script.py.mako, backend/alembic/versions/0001_initial_schema.py, backend/app/main.py +12 more | 7e32224 | delivered | not run | 3/3 tested · 1/3 passing | — |
| US-002 | EPIC-001 | Role-based access to sensitive HR data | US-002, US-002-T1, US-002-T2, US-002-T3 | 2 | backend_api, database, frontend, users | backend/app/cache.py, backend/app/routers/analytics.py, backend/app/routers/dashboard.py, backend/app/routers/goals.py, backend/app/routers/objectives.py +3 more | 75de0b5 | delivered | not run | 4/4 tested · 4/4 passing | — |
| US-003 | EPIC-001 | Password reset | US-003 | 2 | POST /auth/password-reset/confirm, POST /auth/password-reset/request, backend_api, email, password_reset_tokens | backend/app/email.py, backend/app/routers/auth.py, backend/app/schemas.py, backend/app/settings.py, backend/tests/e2e_reset_helper.py +13 more | e3b055e | delivered | not run | 3/3 tested · 0/3 passing | — |
| US-017 | EPIC-001 | Remove role-permission description text from sign-in form | US-017 | 2 | frontend | frontend/e2e/login.spec.ts, frontend/src/screens/Login.tsx | f83df11 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-004 | EPIC-002 | HR creates and maintains employee records | US-004 | 1 | POST /employees, POST /employees/{id}/deactivate, PUT /employees/{id}, backend_api, database, frontend, users | backend/alembic/versions/0002_index_manager_id.py, backend/alembic/versions/0002_reporting_line_indexes.py, backend/app/audit.py, backend/app/models.py, backend/app/routers/audit.py +5 more | 85b066b | delivered | not run | 3/3 tested · 0/3 passing | — |
| US-005 | EPIC-002 | Define and maintain reporting lines | US-005 | 1 | PUT /employees/{id}/manager, backend_api, database, users | — | 85b066b | delivered | not run | 3/3 tested · 2/3 passing | — |
| US-006 | EPIC-002 | Data protection: export, delete and audit trail | US-006 | 3 | DELETE /employees/{id}/personal-data, GET /audit-log, GET /employees/{id}/export, audit_log, backend_api, database, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-007 | EPIC-003 | Create a goal with SMART/OKR structure | US-007 | 3 | GET /goals, POST /goals, PUT /goals/{id}, backend_api, database, frontend, goals | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-008 | EPIC-003 | Manager sets goals for direct reports | US-008 | 3 | POST /goals, backend_api, frontend, goals, users | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-009 | EPIC-003 | Optionally cascade a goal from a higher-level objective | US-009 | 3 | GET /objectives, POST /goals, PUT /goals/{id}, backend_api, database, goals, objectives | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-010 | EPIC-004 | Update goal progress by percentage or status | US-010 | 4 | PATCH /goals/{id}/progress, backend_api, frontend, goals | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-011 | EPIC-004 | Record periodic check-ins on a goal | US-011 | 4 | GET /goals/{id}/check-ins, POST /goals/{id}/check-ins, backend_api, check_ins, database, frontend | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-012 | EPIC-004 | Due-date and check-in reminders | US-012, US-012-T1, US-012-T2, US-012-T3, US-012-T4 | 5 | GET /notifications, PATCH /notifications/{id}/read, backend_api, email, frontend, goals, notifications, queue, worker | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-013 | EPIC-005 | Employee views personal goal dashboard | US-013 | 4 | GET /dashboard/me, backend_api, cache, frontend, goals | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-014 | EPIC-005 | Manager views direct reports' goals | US-014 | 5 | GET /dashboard/team, backend_api, frontend, goals, users | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-015 | EPIC-006 | Give a praise/recognition note | US-015 | 2 | POST /praise, backend_api, notifications, praise | backend/alembic/versions/0003_praise_notification_indexes.py, backend/app/models.py, backend/app/routers/notifications.py, backend/app/routers/praise.py, backend/app/schemas.py +3 more | de16eb5 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-016 | EPIC-006 | View praise received | US-016 | 2 | GET /praise/received, backend_api, frontend, praise | — | de16eb5 | delivered | not run | 2/2 tested · 0/2 passing | — |
<!-- sdlc:auto:end matrix -->
