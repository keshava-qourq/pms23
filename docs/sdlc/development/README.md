# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### PLAN-v1 · approved · source: plan

Development plan version 1 is approved, organized into 5 sprints of 20-point capacity each (100 points total) covering authentication/RBAC, employee records, goal setting, progress tracking, and praise/recognition.

Sprint 1: core login and foundational employee/reporting-line management so HR can onboard the org (maps to US-001, US-004, US-005). Sprint 2: role-based access control, password recovery, lightweight praise/recognition, sign-in screen cleanup (maps to US-002, US-003, US-015, US-016, US-017). Sprint 3: SMART/OKR goal creation, manager-assigned goals, optional cascading, HR data-protection/audit controls (maps to US-007, US-008, US-009, US-006). Sprint 4: goal progress tracking, periodic check-ins, personal goal dashboard (maps to US-010, US-011, US-013). Sprint 5: automated reminders and manager's team-goals view (maps to US-012, US-014). Each sprint has capacity=20.

**Related:** US-001, US-004, US-005, US-002, US-003, US-015, US-016, US-017, US-007, US-008, US-009, US-006, US-010, US-011, US-013, US-012, US-014

- ⚠ The input does not explicitly assign backlog items to sprints; the mapping above is inferred by matching sprint goal text to known requirement keys, not an explicit sprint-to-item assignment in the plan -- treat as approximate and confirm against the authoritative sprint board.

### EPIC-001 · approved · source: plan:EPIC-001

Epic covering access, authentication, and role-based access control for the system.

Contains: US-001 Email/password login (8 pts, backend-agent) with tasks US-001-T1 (login/logout endpoints and session handling, backend-agent), US-001-T2 (login form UI, frontend-agent), US-001-T3 (role-appropriate post-login redirect, frontend-agent); US-002 Role-based access to sensitive HR data (8 pts, backend-agent) with tasks US-002-T1 (role-based authorization checks in API), US-002-T2 (restrict executive role to read-only analytics), US-002-T3 (frontend route guards per role); US-003 Password reset (3 pts, backend-agent); US-017 Remove role-permission description text from sign-in form (1 pt, frontend-agent). Epic itself has no assigned role.

**Related:** US-001, US-002, US-003, US-017

### EPIC-002 · approved · source: plan:EPIC-002

Epic covering employee records management and reporting-line structure.

Contains: US-004 HR creates and maintains employee records (5 pts, backend-agent); US-005 Define and maintain reporting lines (5 pts, backend-agent); US-006 Data protection: export, delete and audit trail (5 pts, security-agent). Epic itself has no assigned role.

**Related:** US-004, US-005, US-006

### EPIC-003 · approved · source: plan:EPIC-003

Epic covering SMART/OKR goal setting functionality.

Contains: US-007 Create a goal with SMART/OKR structure (5 pts, backend-agent); US-008 Manager sets goals for direct reports (5 pts, backend-agent); US-009 Optionally cascade a goal from a higher-level objective (3 pts, backend-agent). Epic itself has no assigned role.

**Related:** US-007, US-008, US-009

### EPIC-004 · approved · source: plan:EPIC-004

Epic covering goal progress tracking, due dates, and check-ins.

Contains: US-010 Update goal progress by percentage or status (5 pts, backend-agent); US-011 Record periodic check-ins on a goal (3 pts, backend-agent); US-012 Due-date and check-in reminders (8 pts, integration-agent) with tasks US-012-T1 (scheduled reminder job, integration-agent), US-012-T2 (SendGrid email send with failure logging, integration-agent), US-012-T3 (in-app notification records and read/unread API, backend-agent), US-012-T4 (notifications UI panel, frontend-agent). Epic itself has no assigned role.

**Related:** US-010, US-011, US-012

### EPIC-005 · approved · source: plan:EPIC-005

Epic covering the personal goal dashboard for employees and managers.

Contains: US-013 Employee views personal goal dashboard (5 pts, frontend-agent); US-014 Manager views direct reports' goals (5 pts, frontend-agent). Epic itself has no assigned role.

**Related:** US-013, US-014

### EPIC-006 · approved · source: plan:EPIC-006

Epic covering praise and recognition features.

Contains: US-015 Give a praise/recognition note (3 pts, backend-agent); US-016 View praise received (2 pts, frontend-agent). Epic itself has no assigned role.

**Related:** US-015, US-016

### DEV-RUN-STATUS · draft · source: dev

The development run for this phase is marked 'completed' overall, but the only ticket with an individual delivery record provided is US-017.

Input states development run status = completed, yet supplies ticket-level detail for just one item (US-017: delivered, commit f83df11dcc1d965d4b3d89db0a4988fe55f8c095). No ticket records (status, commits) were provided for US-001 through US-016 or their sub-tasks.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017

- ⚠ Discrepancy: overall run status says 'completed' but only 1 of 17 stories (and none of the associated tasks) has a recorded delivery/commit -- cannot confirm whether the remaining stories and tasks were actually built, tested, or merged.
- ⚠ No per-ticket status is available for US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012 (and its tasks), US-013, US-014, US-015, US-016.

### US-017 · approved · source: dev:US-017

Ticket US-017 (remove role-permission description text from sign-in form) was delivered.

Status: delivered. Commit: f83df11dcc1d965d4b3d89db0a4988fe55f8c095. Corresponds to planned backlog item US-017 (1 pt, frontend-agent) under EPIC-001.

**Related:** US-017, EPIC-001

- ⚠ No date recorded for delivery; no reviewer/approval information provided beyond 'delivered' status.
<!-- sdlc:auto:end narrative -->
