# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan

Approved development plan (version 1) organizes PMS23 work into 5 sprints of 20-point capacity each, spanning 6 epics: access/auth/RBAC, employee records & reporting lines, goal setting (SMART/OKR), goal progress & check-ins, personal goal dashboard, and praise & recognition.

Sprint 1 goal: deliver core login and foundational employee/reporting-line management so HR can onboard the organisation. Sprint 2 goal: complete role-based access control and password recovery, ship lightweight praise/recognition, and clean up the sign-in screen. Sprint 3 goal: enable SMART/OKR goal creation, manager-assigned goals, optional objective cascading, and HR data-protection/audit controls. Sprint 4 goal: deliver goal progress tracking, periodic check-ins, and the employee's personal goal dashboard. Sprint 5 goal: deliver automated due-date/check-in reminders and the manager's team-goals view. Backlog breakdown: EPIC-001 Access/Auth/RBAC contains US-001 (Email/password login, 8pts, backend-agent, tasks T1 login/logout+session, T2 login form UI, T3 role-based post-login redirect), US-002 (Role-based access to sensitive HR data, 8pts, backend-agent, tasks T1 API authz checks, T2 executive read-only restriction, T3 frontend route guards), US-003 (Password reset, 3pts, backend-agent), US-017 (Remove role-permission description text from sign-in form, 1pt, frontend-agent). EPIC-002 Employee Records & Reporting-Line Management contains US-004 (HR creates/maintains employee records, 5pts, backend-agent), US-005 (Define/maintain reporting lines, 5pts, backend-agent), US-006 (Data protection: export, delete, audit trail, 5pts, security-agent). EPIC-003 Goal Setting contains US-007 (Create SMART/OKR goal, 5pts, backend-agent), US-008 (Manager sets goals for direct reports, 5pts, backend-agent), US-009 (Optional cascading from higher-level objective, 3pts, backend-agent). EPIC-004 Goal Progress Tracking contains US-010 (Update progress by percentage/status, 5pts, backend-agent), US-011 (Record periodic check-ins, 3pts, backend-agent), US-012 (Due-date and check-in reminders, 8pts, integration-agent, tasks T1 scheduled reminder job, T2 SendGrid email integration with failure logging, T3 in-app notification records + read/unread API, T4 notifications UI panel). EPIC-005 Personal Goal Dashboard contains US-013 (Employee views personal goal dashboard, 5pts, frontend-agent), US-014 (Manager views direct reports' goals, 5pts, frontend-agent). EPIC-006 Praise & Recognition contains US-015 (Give praise/recognition note, 3pts, backend-agent), US-016 (View praise received, 2pts, frontend-agent).

**Related:** US-001, US-002, US-003, US-017, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016

### DEV-US-002 · approved · source: dev:US-002

Ticket US-002 (Role-based access to sensitive HR data) was delivered, implementing backend authorization and frontend route guarding per role.

Status: delivered. Commit: 75de0b543235efe101869030e9b9cdea4441675e. Planned scope per backlog: role-based authorization checks in the API, restriction of the executive role to read-only analytics, and frontend route guards per role (tasks US-002-T1/T2/T3). Role: backend-agent, 8 story points, part of Sprint 2 goal to complete role-based access control.

**Related:** US-002, US-001

- ⚠ Delivery record does not confirm whether all three sub-tasks (T1-T3) were completed individually -- only a single ticket-level delivered status and commit are given.

### DEV-US-003 · approved · source: dev:US-003

Ticket US-003 (Password reset) was delivered as part of Sprint 2's role-based access control and password recovery goal.

Status: delivered. Commit: e3b055e1a6ac49bf90a11dac75e059ef31d34196. Role: backend-agent, 3 story points. No sub-tasks were listed in the plan for this story.

**Related:** US-003, US-001

### DEV-US-015 · approved · source: dev:US-015

Ticket US-015 (Give a praise/recognition note) was delivered, part of Sprint 2's lightweight praise/recognition feature.

Status: delivered. Commit: de16eb51a722219aada45123727d7385e627a3bd. Role: backend-agent, 3 story points.

**Related:** US-015, US-016

- ⚠ US-015 and US-016 both report the identical commit hash de16eb51a722219aada45123727d7385e627a3bd -- flagged as a discrepancy: unclear if this is a single combined commit covering both stories or a reporting error.

### DEV-US-016 · approved · source: dev:US-016

Ticket US-016 (View praise received) was delivered, part of Sprint 2's lightweight praise/recognition feature.

Status: delivered. Commit: de16eb51a722219aada45123727d7385e627a3bd. Role: frontend-agent, 2 story points.

**Related:** US-016, US-015

- ⚠ US-016 and US-015 both report the identical commit hash de16eb51a722219aada45123727d7385e627a3bd -- flagged as a discrepancy: unclear if this is a single combined commit covering both stories or a reporting error.

### DEV-GAP-COVERAGE · draft · source: dev:run-status

The development run is marked 'completed', but ticket-level delivery records were only provided for 4 of the 17 planned stories.

The approved plan (v1) schedules 17 stories across 5 sprints, but the development run input lists delivered status only for US-002, US-003, US-015, and US-016. No ticket records (status or commit) were given for US-001, US-017, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, or US-014, despite the overall run being reported as 'completed'.

**Related:** US-001, US-017, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014

- ⚠ No ticket-level status/commit provided for US-001 (Email/password login) despite being foundational to Sprint 1.
- ⚠ No ticket-level status/commit provided for US-017 (sign-in form cleanup).
- ⚠ No ticket-level status/commit provided for US-004 (HR employee records) and US-005 (reporting lines), both Sprint 1 goals.
- ⚠ No ticket-level status/commit provided for US-006 (data protection/audit trail), a Sprint 3 goal assigned to security-agent.
- ⚠ No ticket-level status/commit provided for US-007, US-008, US-009 (goal setting/SMART/OKR/cascading), Sprint 3 goals.
- ⚠ No ticket-level status/commit provided for US-010, US-011, US-012 (progress tracking, check-ins, reminders), Sprint 4/5 goals.
- ⚠ No ticket-level status/commit provided for US-013, US-014 (personal and manager goal dashboards), Sprint 4/5 goals.
- ⚠ Conflict: run status field says 'completed' while 13 of 17 planned stories show no delivery evidence -- needs confirmation whether these were deferred, dropped, or simply omitted from reporting.
<!-- sdlc:auto:end narrative -->
