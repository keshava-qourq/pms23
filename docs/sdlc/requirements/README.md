# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-SCOPE-001 · draft · source: requirements:scope

Defines PMS23 as a lightweight-delivery, v2 requirements set covering goal management, employee/reporting-line admin, and praise/recognition for an internal performance management tool.

Delivery scope: lightweight. Requirements version: 2. Capabilities explicitly in scope: goal creation with SMART/OKR structure, goal progress tracking by percentage or status, goal due dates and periodic check-ins, personal dashboard of an employee's own goals, manual employee records and reporting-line entry by HR, praise and recognition notes. Explicitly out of scope for this release: native mobile apps (iOS/Android); payroll/compensation processing; learning/training management; recruitment/ATS; HRIS or SSO directory integration.

### REQ-TECHSTACK-001 · approved · source: requirements:tech-stack

Product owner approved an exact technology stack: FastAPI backend, AWS cloud, PostgreSQL 16 database, React 19 frontend.

Backend: FastAPI 0.115 — chosen to express role-based access rules, configurable review cycles, cascading goals and audit trail clearly, with built-in request validation for configurable forms/permission checks. Cloud: AWS — chosen for dependable hosting, backups, access controls and single-jurisdiction data residency for sensitive internal HR data, with managed PostgreSQL and room to grow. Database: PostgreSQL 16 — chosen for enforcing highly relational data (employees, reporting lines, cascaded goals, cycles, forms, ratings, feedback), reliable aggregate queries for analytics dashboards, and row-level control/auditability. Frontend: React 19 — chosen for the four interaction-heavy surfaces (goal trackers, multi-step review forms, feedback threads, analytics dashboards) and for developer availability under a tight deadline. Stack to be designed against exactly as specified, no substitutions.

### REQ-SERVICES-001 · approved · source: requirements:services

Product owner approved three runtime services: SendGrid for transactional email, Redis as a background job queue, and Redis as a dashboard cache.

Email: SendGrid (SaaS, env var SENDGRID_API_KEY) — drives deadline/check-in/feedback/sign-off email reminders. Queue: Redis (container redis:7-alpine, used as a queue) — runs batched, time-based reminder jobs as background work rather than blocking the app. Cache: Redis (container redis:7-alpine) — caches executive/HR analytics dashboard aggregates (goals, ratings, cycle completion) for performance during busy appraisal periods. Required API keys/env vars for the app: REDIS_URL, SENDGRID_API_KEY.

**Related:** US-012, US-013, US-014

### US-001 · draft · source: requirements:US-001

Critical story: any registered user logs in with email/password and is taken to a role-appropriate home screen; incorrect credentials show a generic error; logout ends the session.

Priority: critical. Epic: EPIC-001 Access, Authentication & RBAC. AC-001: correct credentials authenticate and route to role-appropriate home screen. AC-002: incorrect password or unknown email is denied with a generic error that does not reveal which field was wrong. AC-003: logout ends the session, requiring re-login. Epic-level assumptions: four roles (employee, manager, HR admin, executive/leadership read-only analytics) assumed, not independently verified; email/password authentication only, no SSO or HRIS directory sync in first release; no payment/billing/subscription functionality exists (internal single-org tool).

**Related:** EPIC-001, US-002, US-003, US-017

### US-002 · draft · source: requirements:US-002

Critical story: role-based access ensures employees see only their own data, managers see their reporting line, executives get read-only analytics, and HR admins see and manage org-wide records.

Priority: critical. Epic: EPIC-001. AC-004: employee is denied access to another employee's goals/praise detail. AC-005: manager sees own records plus direct reports, not employees outside their reporting line. AC-006: executive/leadership has read-only analytics-level access, cannot edit individual employee records or goals. AC-007: HR admin can view and manage records across the organisation.

**Related:** EPIC-001, US-001, US-004, US-005, US-013, US-014

### US-003 · draft · source: requirements:US-003

Medium-priority story: users can reset a forgotten password via a time-limited email link without contacting IT.

Priority: medium. Epic: EPIC-001. AC-008: requesting a reset for a registered email sends a time-limited reset link. AC-009: setting a new password via a valid, unexpired link that meets password rules updates the password and allows login. AC-010: an expired or already-used reset link is rejected and the user is prompted to request a new one.

**Related:** EPIC-001, US-001

### US-017 · draft · source: requirements:US-017

Low-priority UI cleanup story: remove the role-permission explanatory paragraph from the sign-in form while keeping all other sign-in elements unchanged.

Priority: low. Epic: EPIC-001. AC-044: the paragraph with class "description" containing the text "PMS23 shows only what your role permits..." is removed from the sign-in form. AC-045: email field, password field, submit button and forgot-password link remain unchanged in behaviour and position after the text is removed.

**Related:** EPIC-001, US-001

### US-004 · draft · source: requirements:US-004

Critical story: HR admins manually create, edit and deactivate employee records since there is no HRIS integration.

Priority: critical. Epic: EPIC-002 Employee Records & Reporting-Line Management. AC-011: creating a record with name, email, role saves it and enables goal/reporting-line assignment. AC-012: editing details (name, email, role) updates and reflects across the app. AC-013: deactivating a departed employee's record blocks their login while preserving historical goals/praise for reporting. Epic assumption: performance/employee data treated as sensitive HR data; GDPR-style practices (access control, retention, export/delete, audit trail) assumed for an unspecified single jurisdiction.

**Related:** EPIC-002, US-005, US-006

### US-005 · draft · source: requirements:US-005

Critical story: HR admins assign managers and build the reporting-line structure that drives manager visibility and access control.

Priority: critical. Epic: EPIC-002. AC-014: setting an employee's manager makes them a direct report of that manager. AC-015: reassigning to a different manager updates the reporting line and revokes the previous manager's access to that employee's data. AC-016: an assignment that would create a reporting cycle (e.g. A reports to B and B reports to A) is prevented with an error.

**Related:** EPIC-002, US-004, US-002

### US-006 · draft · source: requirements:US-006

Medium-priority story: HR admins can export or delete an individual's personal data and view an audit trail of record changes for data-protection compliance.

Priority: medium. Epic: EPIC-002. AC-017: requesting an export produces a file with the person's personal and performance data. AC-018: an approved deletion request removes/anonymises identifying data and is recorded in the audit trail. AC-019: the audit trail shows who changed employee records or reporting lines, and when. Assumption: GDPR-style retention/export/delete is assumed because the organisation's region was not specified.

**Related:** EPIC-002, US-004, US-005

### US-007 · draft · source: requirements:US-007

Critical story: an employee creates a SMART/OKR-style goal with title, description, measurable target and due date.

Priority: critical. Epic: EPIC-003 Goal Setting (SMART/OKR). AC-020: a goal with title, description, measurable target/metric and due date is saved and linked to the creating employee. AC-021: omitting a required field (e.g. title, due date) blocks saving and prompts completion. AC-022: editing title, description, target or due date saves the changes. Epic assumption: SMART/OKR-style structure (specific, measurable, target, timeframe) assumed from confirmed understanding; cascading from higher objectives is optional, not mandatory.

**Related:** EPIC-003, US-008, US-009

### US-008 · draft · source: requirements:US-008

High-priority story: managers create or assign goals to their direct reports, restricted to their own reporting line.

Priority: high. Epic: EPIC-003. AC-023: a goal created and assigned to a direct report appears on that report's goal list, attributed to them. AC-024: attempting to assign a goal to someone who is not a direct report is not permitted.

**Related:** EPIC-003, US-005, US-007

### US-009 · draft · source: requirements:US-009

Medium-priority story: employees or managers can optionally link a goal to a higher-level manager or company objective to show contribution, but linking is not required.

Priority: medium. Epic: EPIC-003. AC-025: linking a goal to an existing higher-level objective shows that parent objective on the goal. AC-026: choosing not to link a goal still saves it as a valid standalone goal.

**Related:** EPIC-003, US-007, US-008

### US-010 · draft · source: requirements:US-010

High-priority story: goal owners update progress as a percentage (0-100) or a status value, with completion recorded when done.

Priority: high. Epic: EPIC-004 Goal Progress Tracking, Due Dates & Check-ins. AC-027: setting percentage-based completion between 0 and 100 is saved and displayed. AC-028: changing status (e.g. Not started, In progress, Completed, Blocked) is saved and displayed. AC-029: reaching 100% or Completed status marks the goal complete and records a completion date.

**Related:** EPIC-004, US-007, US-013

### US-011 · draft · source: requirements:US-011

Medium-priority story: goal owners add dated check-in notes to maintain an ongoing progress/blocker record, shown in chronological order.

Priority: medium. Epic: EPIC-004. AC-030: a check-in note is saved with its date and author and appears in the goal's check-in history. AC-031: multiple check-ins are displayed in chronological order.

**Related:** EPIC-004, US-007

### US-012 · draft · source: requirements:US-012

High-priority story: goal owners receive email and in-app reminders for approaching due dates and overdue check-ins.

Priority: high. Epic: EPIC-004. AC-032: when the reminder schedule runs for an approaching due date or overdue check-in, the owner receives both an email and an in-app notification. AC-033: if the email-sending service credential is not configured, the in-app notification is still created and the email failure is logged. AC-034: unread in-app notifications can be viewed and dismissed. Assumption: email reminders require an email-sending service credential (e.g. SendGrid/SMTP API key) to be provisioned; in-app notifications are provided regardless.

**Related:** EPIC-004, US-010, US-011

### US-013 · draft · source: requirements:US-013

High-priority story: employees see a personal dashboard of their own goals with progress, due dates, and flags for overdue/due-soon items, plus an empty state when no goals exist.

Priority: high. Epic: EPIC-005 Personal Goal Dashboard. AC-035: dashboard shows goals with progress (percentage or status) and due dates. AC-036: overdue or due-soon goals are highlighted/flagged. AC-037: an employee with no goals sees an empty state inviting them to create one.

**Related:** EPIC-005, US-007, US-010

### US-014 · draft · source: requirements:US-014

Medium-priority story: managers view a team view of their direct reports' goals and progress, restricted to their own reporting line.

Priority: medium. Epic: EPIC-005. AC-038: team view shows each direct report's goals and progress. AC-039: attempting to view goals of an employee outside the reporting line is denied.

**Related:** EPIC-005, US-002, US-005

### US-015 · draft · source: requirements:US-015

Medium-priority story: employees or managers send a praise/recognition note naming a recipient and message, with required-field validation.

Priority: medium. Epic: EPIC-006 Praise & Recognition (peer/360 feedback, 1:1 notes and structured reviews are explicitly out of scope for this MVP). AC-040: creating a praise note with a recipient and message saves it and notifies the recipient in-app. AC-041: leaving recipient or message empty blocks saving and prompts completion.

**Related:** EPIC-006, US-016

### US-016 · draft · source: requirements:US-016

Low-priority story: employees view praise they have received, most recent first, with an empty state when none exists.

Priority: low. Epic: EPIC-006. AC-042: praise view shows each received note with message and sender, ordered most recent first. AC-043: an employee with no received praise sees an empty state.

**Related:** EPIC-006, US-015
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v2  
**Delivery scope:** lightweight  
**Approved:** 2026-11-06

**Capabilities in scope:** Goal creation with SMART/OKR structure, Goal progress tracking by percentage or status, Goal due dates and periodic check-ins, Personal dashboard of an employee's own goals, Manual employee records and reporting-line entry by HR, Praise and recognition notes

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The heart of this system is business rules, not heavy computation: role-based access to sensitive HR data (employees see only their own and their reports'), configurable review cycles, cascading goals, and an audit trail. FastAPI lets a small team express these rules and APIs clearly and quickly, with built-in request validation that helps enforce the configurable forms and permission checks you need before the cycle opens. |
| cloud | AWS | This is an internal tool holding sensitive HR data for one organisation, so you need dependable hosting, backups, access controls and data-residency options in a single jurisdiction. AWS covers all of that with managed PostgreSQL and standard web hosting, and its breadth means you won't hit a wall as usage grows across the appraisal cycle. |
| database | PostgreSQL | Your data is highly relational — employees, reporting lines, goals cascaded from objectives, review cycles, forms, ratings and feedback all reference each other — and the analytics dashboards need reliable aggregate queries across the org. PostgreSQL enforces these relationships, handles the reporting queries well at your scale, and gives you the row-level control and auditability expected of sensitive HR data. |
| frontend | React | Your product is a responsive web app with four distinct, interaction-heavy surfaces — goal trackers with progress bars and cascading, multi-step review forms with configurable fields and rating scales, feedback threads, and analytics dashboards for executives. React handles this kind of stateful, form-driven UI well and makes the dashboards and configurable review forms practical to build quickly before your appraisal cycle. It also gives you the widest pool of developers, which matters for a tight deadline. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Access, Authentication & Role-Based Access Control

Foundation for the internal performance management tool: email/password login and four-role access control (employee, manager, HR admin, executive). This underpins every other capability so that sensitive HR data is only visible to authorised people. ASSUMPTION: four roles (employee, manager, HR admin, executive/leadership read-only analytics) are assumed from the confirmed understanding, not independently verified. ASSUMPTION: email/password authentication only — no SSO or HRIS directory sync in the first release. ASSUMPTION: no payment, billing or subscription functionality exists, as this is an internal single-organisation tool; that capability makes no sense here and is intentionally absent.

### US-001: Email/password login

**Priority:** critical

> As a registered user (employee, manager, HR admin or executive), I want to log in with my email address and password, so that I can access the performance management tool securely.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am an active user with a valid email and password | I submit correct credentials on the login page | I am authenticated and taken to my role-appropriate home screen |
| AC-002 | I am on the login page | I submit an incorrect password or an unknown email | I am denied access and shown a generic error message that does not reveal which field was wrong |
| AC-003 | I am logged in | I choose to log out | my session is ended and I must log in again to continue |

### US-002: Role-based access to sensitive HR data

**Priority:** critical

> As a security-conscious organisation, I want each user to see only the data permitted for their role, so that sensitive performance data is protected from unauthorised access.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | I am logged in as an employee | I try to open another employee's goals or praise detail that is not mine | access is denied |
| AC-005 | I am logged in as a manager | I view goals data | I can see my own records and those of my direct reports, but not employees outside my reporting line |
| AC-006 | I am logged in as an executive/leadership user | I access the application | I have read-only access to analytics-level views and cannot edit individual employee records or goals |
| AC-007 | I am logged in as an HR admin | I access employee and org data | I can view and manage records across the organisation |

### US-003: Password reset

**Priority:** medium

> As a user who has forgotten my password, I want to reset my password via my email address, so that I can regain access without contacting IT.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | I am on the login page and have forgotten my password | I request a reset for my registered email | a time-limited reset link is sent to that email address |
| AC-009 | I have received a valid, unexpired reset link | I set a new password meeting the password rules | my password is updated and I can log in with it |
| AC-010 | I have a reset link that has expired or already been used | I open it | it is rejected and I am prompted to request a new one |

### US-017: Remove role-permission description text from sign-in form

**Priority:** low

> As a user visiting the login page, I want the sign-in form to no longer show the role-permission description paragraph, so that the sign-in screen is cleaner and free of that explanatory text.

| ID | Given | When | Then |
|---|---|---|---|
| AC-044 | I am on the login page | the page renders | the paragraph with class "description" containing the text "PMS23 shows only what your role permits..." is not present anywhere on the sign-in form |
| AC-045 | I am on the login page after the text is removed | I view the form | all other sign-in elements (email field, password field, submit button, forgot-password link) remain unchanged in behaviour and position |

## EPIC-002: Employee Records & Reporting-Line Management

HR admins manually create and maintain employee accounts and the organisation's reporting structure inside the app, since there is no HRIS or SSO sync in the first release. Includes basic data-protection handling of these records. ASSUMPTION: performance/employee data is treated as sensitive HR data; a single jurisdiction with GDPR-style practices (access control, retention, export/delete on request) and an audit trail is assumed because the region was not specified.

### US-004: HR creates and maintains employee records

**Priority:** critical

> As a HR admin, I want to create and edit employee records manually, so that the organisation's people are represented in the system without an HRIS integration.

| ID | Given | When | Then |
|---|---|---|---|
| AC-011 | I am an HR admin | I create an employee record with name, email and role | the record is saved and the employee can be assigned goals and a reporting line |
| AC-012 | an employee record exists | I edit its details (e.g. name, email, role) and save | the updated details are stored and reflected across the application |
| AC-013 | an employee has left the organisation | I deactivate their record | they can no longer log in but their historical goals and praise remain for reporting |

### US-005: Define and maintain reporting lines

**Priority:** critical

> As a HR admin, I want to assign each employee a manager and build the org/reporting structure, so that managers see the right reports and access control works correctly.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | two employee records exist | I set one employee's manager to another | the first appears as a direct report of the second |
| AC-015 | an employee already has a manager | I reassign them to a different manager | the reporting line updates and the previous manager loses access to that employee's data |
| AC-016 | I attempt to set a reporting line | the assignment would create a cycle (e.g. A reports to B and B reports to A) | the system prevents the change and shows an error |

### US-006: Data protection: export, delete and audit trail

**Priority:** medium

> As a HR admin responsible for data protection, I want to export or delete an individual's personal data and see an audit trail of record changes, so that the organisation can honour data-protection obligations.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | an employee record exists | I request an export of that person's data | the system produces a file containing their personal and performance data |
| AC-018 | a valid data-deletion request is approved | I delete an employee's personal data | their identifying data is removed or anonymised and the action is recorded in the audit trail |
| AC-019 | changes are made to employee records or reporting lines | I view the audit trail | I can see who changed what and when. ASSUMPTION: GDPR-style retention/export/delete is assumed as region was unspecified. |

## EPIC-003: Goal Setting (SMART/OKR)

Employees and managers create goals with a SMART/OKR-style structure, optionally cascaded from company or manager objectives. ASSUMPTION: a SMART/OKR-style goal structure (specific, measurable, with a target and timeframe) is assumed from the confirmed understanding. Cascading from higher-level objectives is optional, not mandatory.

### US-007: Create a goal with SMART/OKR structure

**Priority:** critical

> As a employee, I want to create a goal with a clear title, description, measurable target and timeframe, so that my objectives are well defined and trackable.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | I am logged in as an employee | I create a goal with a title, description, measurable target/metric and a due date | the goal is saved and linked to me |
| AC-021 | I am creating a goal | I omit a required field such as title or due date | the goal is not saved and I am prompted to complete the missing field |
| AC-022 | I have created a goal | I edit its title, description, target or due date | the changes are saved |

### US-008: Manager sets goals for direct reports

**Priority:** high

> As a manager, I want to create or assign goals for my direct reports, so that team objectives are aligned and visible.

| ID | Given | When | Then |
|---|---|---|---|
| AC-023 | I am a manager with direct reports | I create a goal and assign it to one of my reports | the goal appears on that report's goal list attributed to them |
| AC-024 | I am a manager | I attempt to assign a goal to an employee who is not my direct report | the action is not permitted |

### US-009: Optionally cascade a goal from a higher-level objective

**Priority:** medium

> As a employee or manager, I want to optionally link my goal to a manager or company objective, so that individual goals show how they contribute to broader objectives.

| ID | Given | When | Then |
|---|---|---|---|
| AC-025 | a higher-level (manager or company) objective exists | I create or edit a goal and link it to that objective | the goal shows its parent objective |
| AC-026 | I am creating a goal | I choose not to link it to any parent objective | the goal is still saved as a valid standalone goal |

## EPIC-004: Goal Progress Tracking, Due Dates & Check-ins

Goals are kept up to date through percentage or status progress, due dates, and periodic check-ins, with reminders so updates actually happen. ASSUMPTION: progress may be expressed as a percentage or a status value; periodic check-in cadence is assumed and configurable per goal. ASSUMPTION: email reminders require an email-sending service and credential (e.g. SendGrid/SMTP API key) to be provisioned; in-app notifications are also provided.

### US-010: Update goal progress by percentage or status

**Priority:** high

> As a goal owner, I want to update my goal's progress as a percentage or a status, so that my progress is current and visible.

| ID | Given | When | Then |
|---|---|---|---|
| AC-027 | I own a goal that uses percentage progress | I set its completion to a value between 0 and 100 | the new percentage is saved and displayed |
| AC-028 | I own a goal that uses status progress | I change its status (e.g. Not started, In progress, Completed, Blocked) | the new status is saved and displayed |
| AC-029 | I set a goal's progress to 100% or Completed | I save it | the goal is marked complete and its completion date is recorded |

### US-011: Record periodic check-ins on a goal

**Priority:** medium

> As a goal owner, I want to add dated check-in notes against a goal, so that there is an ongoing record of progress and blockers.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | I own a goal | I add a check-in note | the note is saved with its date and author and shown in the goal's check-in history |
| AC-031 | a goal has multiple check-ins | I view the goal | I see the check-ins in chronological order |

### US-012: Due-date and check-in reminders

**Priority:** medium

> As a goal owner, I want to be reminded by email and in-app notification of upcoming due dates and overdue check-ins, so that I keep my goals up to date.

| ID | Given | When | Then |
|---|---|---|---|
| AC-032 | a goal's due date is approaching or a check-in is overdue | the reminder schedule runs | I receive an email and an in-app notification prompting me to update the goal |
| AC-033 | the email-sending service credential is not configured | a reminder is due | the in-app notification is still created and the email failure is logged. ASSUMPTION: an email service (e.g. SendGrid/SMTP) credential must be provisioned for emails to send. |
| AC-034 | I have an unread in-app notification | I open my notifications | I can see and dismiss it |

## EPIC-005: Personal Goal Dashboard

Each employee has a personal dashboard summarising their own goals, progress and upcoming due dates; managers can view the goals of their direct reports consistent with role-based access.

### US-013: Employee views personal goal dashboard

**Priority:** high

> As a employee, I want a dashboard of my own goals with their progress and due dates, so that I can see at a glance where I stand.

| ID | Given | When | Then |
|---|---|---|---|
| AC-035 | I am logged in as an employee with goals | I open my dashboard | I see my goals with their progress (percentage or status) and due dates |
| AC-036 | I have goals that are overdue or due soon | I view my dashboard | those goals are highlighted or clearly flagged |
| AC-037 | I have no goals | I open my dashboard | I see an empty state inviting me to create a goal |

### US-014: Manager views direct reports' goals

**Priority:** medium

> As a manager, I want to view the goals and progress of my direct reports, so that I can support and track my team.

| ID | Given | When | Then |
|---|---|---|---|
| AC-038 | I am a manager with direct reports who have goals | I open my team view | I see each direct report's goals and their progress |
| AC-039 | I am a manager | I attempt to view goals of an employee outside my reporting line | access is denied |

## EPIC-006: Praise & Recognition

Lightweight continuous feedback: employees and managers can give praise/recognition notes to colleagues, visible to the recipient. (Peer/360 feedback, 1:1 notes and structured reviews are out of scope for this MVP.)

### US-015: Give a praise/recognition note

**Priority:** medium

> As a employee or manager, I want to send a praise note to a colleague, so that good work is recognised.

| ID | Given | When | Then |
|---|---|---|---|
| AC-040 | I am logged in | I create a praise note naming a recipient and a message | the praise is saved and the recipient is notified in-app |
| AC-041 | I am writing a praise note | I leave the recipient or message empty | the praise is not saved and I am prompted to complete it |

### US-016: View praise received

**Priority:** low

> As a employee, I want to see the praise I have received, so that I feel recognised and can reference it later.

| ID | Given | When | Then |
|---|---|---|---|
| AC-042 | I have received praise notes | I open my praise/recognition view | I see each note with its message and sender, most recent first |
| AC-043 | I have received no praise | I open my praise view | I see an empty state |
<!-- sdlc:auto:end epics -->
