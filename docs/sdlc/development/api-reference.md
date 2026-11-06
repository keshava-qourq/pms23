# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /analytics | analytics | `backend/app/routers/analytics.py:10` | — |
| GET | /audit-log | list_audit_log | `backend/app/routers/audit.py:22` | — |
| POST | /auth/login | login | `backend/app/routers/auth.py:48` | — |
| POST | /auth/logout | logout | `backend/app/routers/auth.py:66` | — |
| POST | /auth/password-reset/confirm | confirm_password_reset | `backend/app/routers/auth.py:84` | — |
| POST | /auth/password-reset/request | request_password_reset | `backend/app/routers/auth.py:75` | — |
| GET | /dashboard/me | personal_dashboard | `backend/app/routers/dashboard.py:10` | — |
| GET | /dashboard/team | team_dashboard | `backend/app/routers/dashboard.py:15` | — |
| POST | /employees | create_employee | `backend/app/routers/employees.py:33` | — |
| PUT | /employees/{id} | update_employee | `backend/app/routers/employees.py:71` | — |
| POST | /employees/{id}/deactivate | deactivate_employee | `backend/app/routers/employees.py:102` | — |
| GET | /employees/{id}/export | export_employee | `backend/app/routers/employees.py:182` | — |
| PUT | /employees/{id}/manager | set_manager | `backend/app/routers/employees.py:125` | — |
| DELETE | /employees/{id}/personal-data | delete_personal_data | `backend/app/routers/employees.py:187` | — |
| GET | /employees/{id}/reports | list_direct_reports | `backend/app/routers/employees.py:160` | — |
| GET | /goals | list_goals | `backend/app/routers/goals.py:21` | — |
| POST | /goals | create_goal | `backend/app/routers/goals.py:16` | — |
| PUT | /goals/{id} | update_goal | `backend/app/routers/goals.py:26` | — |
| GET | /goals/{id}/check-ins | list_check_ins | `backend/app/routers/goals.py:41` | — |
| POST | /goals/{id}/check-ins | add_check_in | `backend/app/routers/goals.py:36` | — |
| PATCH | /goals/{id}/progress | update_goal_progress | `backend/app/routers/goals.py:31` | — |
| GET | /health | health | `backend/app/main.py:59` | Liveness probe, and the only route here that is not a stub. |
| GET | /notifications | list_notifications | `backend/app/routers/notifications.py:10` | — |
| PATCH | /notifications/{id}/read | mark_notification_read | `backend/app/routers/notifications.py:15` | — |
| GET | /objectives | list_objectives | `backend/app/routers/objectives.py:10` | — |
| POST | /praise | send_praise | `backend/app/routers/praise.py:10` | — |
| GET | /praise/received | received_praise | `backend/app/routers/praise.py:15` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Code only:**

- GET /employees/{id}/reports
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `634c876`
<!-- sdlc:auto:end source -->
