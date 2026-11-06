# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-001 · approved · source: plan

Development plan version 1 is approved, organized into 5 sprints of 20-point capacity each, covering 6 epics and 16 user stories (plus sub-tasks for US-001, US-002, US-012).

Plan status: approved, version 1. Epics: EPIC-001 Access, Authentication & RBAC (US-001, US-001-T1..T3, US-002, US-002-T1..T3, US-003); EPIC-002 Employee Records & Reporting-Line Management (US-004, US-005, US-006); EPIC-003 Goal Setting SMART/OKR (US-007, US-008, US-009); EPIC-004 Goal Progress Tracking, Due Dates & Check-ins (US-010, US-011, US-012, US-012-T1..T3); EPIC-005 Personal Goal Dashboard (US-013, US-014); EPIC-006 Praise & Recognition (US-015, US-016). Each story has an assigned agent role (backend-agent, frontend-agent, security-agent, integration-agent, devops-agent) and story points; epics themselves carry no points/role.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 goal: stand up authentication and organization people data -- login/logout plus HR-managed employee records with reporting lines.

Capacity: 20 points. Planned scope: US-001 Email/password login (8 pts, backend-agent) with sub-tasks for login/logout endpoints with credential verification and session issuance, a login page with generic error messaging, and role-based post-login redirect; US-004 HR creates and maintains employee records (5 pts, backend-agent); US-005 Define and maintain reporting lines (5 pts, backend-agent).

**Related:** US-001, US-001-T1, US-001-T2, US-001-T3, US-004, US-005

- ⚠ No delivery/ticket status reported for US-001, US-004, or US-005 despite the development run being marked 'completed'.

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 goal: enforce role-based access control, enable password recovery, and ship praise/recognition notes.

Capacity: 20 points. Planned scope: US-002 Role-based access to sensitive HR data (8 pts, backend-agent) with sub-tasks for a role-based authorization dependency, manager-scoped data filtering by reporting line, and read-only executive access on edit endpoints; US-003 Password reset (3 pts, backend-agent); US-015 Give a praise/recognition note (3 pts, backend-agent); US-016 View praise received (2 pts, frontend-agent).

**Related:** US-002, US-002-T1, US-002-T2, US-002-T3, US-003, US-015, US-016

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 goal: deliver HR data-protection tooling and core goal creation/assignment, including optional cascading to objectives.

Capacity: 20 points. Planned scope: US-006 Data protection: export, delete and audit trail (5 pts, security-agent); US-007 Create a goal with SMART/OKR structure (5 pts, backend-agent); US-008 Manager sets goals for direct reports (5 pts, backend-agent); US-009 Optionally cascade a goal from a higher-level objective (3 pts, backend-agent).

**Related:** US-006, US-007, US-008, US-009

- ⚠ No delivery/ticket status reported for US-006, US-007, US-008, or US-009 despite the development run being marked 'completed'.

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 goal: enable goal progress updates, check-ins, and the employee's personal goal dashboard.

Capacity: 20 points. Planned scope: US-010 Update goal progress by percentage or status (5 pts, backend-agent); US-011 Record periodic check-ins on a goal (3 pts, backend-agent); US-013 Employee views personal goal dashboard (5 pts, frontend-agent).

**Related:** US-010, US-011, US-013

- ⚠ No delivery/ticket status reported for US-010, US-011, or US-013 despite the development run being marked 'completed'.

### DEV-SPRINT-5 · approved · source: plan:Sprint 5

Sprint 5 goal: deliver due-date/check-in reminders and the manager's team goals view.

Capacity: 20 points. Planned scope: US-012 Due-date and check-in reminders (8 pts, integration-agent) with sub-tasks for a scheduled reminder job (devops-agent), SendGrid email integration with failure logging (integration-agent), and an in-app notification list with read/dismiss endpoints (backend-agent); US-014 Manager views direct reports' goals (5 pts, frontend-agent).

**Related:** US-012, US-012-T1, US-012-T2, US-012-T3, US-014

- ⚠ No delivery/ticket status reported for US-012 or US-014 despite the development run being marked 'completed'.

### DEV-US-002 · approved · source: dev:US-002

Ticket US-002 (Role-based access to sensitive HR data) was delivered.

Status: delivered. Commit: 75de0b543235efe101869030e9b9cdea4441675e. Covers the backend authorization scope defined in the plan for US-002 (role-based authorization dependency, manager-scoped filtering, read-only executive access), though the input does not break out which specific sub-tasks (US-002-T1/T2/T3) were completed individually.

**Related:** US-002

- ⚠ Input does not confirm per-sub-task completion (US-002-T1, US-002-T2, US-002-T3) separately from the parent story.

### DEV-US-003 · approved · source: dev:US-003

Ticket US-003 (Password reset) was delivered.

Status: delivered. Commit: e3b055e1a6ac49bf90a11dac75e059ef31d34196.

**Related:** US-003

### DEV-US-015 · approved · source: dev:US-015

Ticket US-015 (Give a praise/recognition note) was delivered.

Status: delivered. Commit: de16eb51a722219aada45123727d7385e627a3bd.

**Related:** US-015

### DEV-US-016 · approved · source: dev:US-016

Ticket US-016 (View praise received) was delivered.

Status: delivered. Commit: de16eb51a722219aada45123727d7385e627a3bd (same commit hash as US-015, suggesting both were shipped together).

**Related:** US-016

- ⚠ Same commit hash is listed for US-015 and US-016; confirm whether this is intentional (combined commit) or a reporting duplication.

### DEV-RUN-STATUS · draft · source: dev:run-status

The development run is reported as 'completed', but only 4 of the 16 planned stories have an associated ticket/delivery status in the input.

Development run status: completed. Only US-002, US-003, US-015, and US-016 appear as individual tickets with status=delivered and commit hashes. US-001, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, and all listed sub-tasks (US-001-T1..T3, US-002-T1..T3, US-012-T1..T3) have no reported ticket status.

**Related:** US-001, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014

- ⚠ Discrepancy: run-level status says 'completed' while 12 of 16 planned stories (and all sub-tasks) have no delivery evidence -- needs confirmation of whether they were completed outside reported tickets, descoped, or omitted from reporting.
<!-- sdlc:auto:end narrative -->
