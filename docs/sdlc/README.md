# PMS23 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
performance management system

**Documentation version:** v9
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v2 approved |
| [Architecture](architecture/README.md) | 16 entries |
| [Development](development/README.md) | 6 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 0 entries |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 5 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 27 routes |
| [Test report](testing/test-report.md) | no_tests |
| [Tests](testing/test-cases.md) | 116 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 17 requirements |
| [Changelog](CHANGELOG.md) | 9 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- Email reminders (US-012) depend on SENDGRID_API_KEY being provisioned before go-live; provisioning status not stated in this input.
- Four-role model is an epic-level assumption, not independently verified by the product owner.
- Email/password-only authentication (no SSO/HRIS sync) is an assumption for the first release, not a confirmed decision.
- "Password rules" referenced in AC-009 are not defined in this input (e.g. minimum length/complexity).
- Jurisdiction/regulatory regime (e.g. GDPR applicability) is assumed, not confirmed — region unspecified.
- No specific data-retention period is defined for historical goals/praise kept after deactivation or deletion.
- Who creates/owns the higher-level manager or company objectives being linked to is not specified in this input.
- Depends on SENDGRID_API_KEY being provisioned (see REQ-SERVICES-001); provisioning status not confirmed in this input.
- Exact reminder schedule/cadence (how long before due date, how often overdue check-ins nudge) is not specified.

### Architecture

- No named approver or approval date recorded for this architecture version.
- Input does not map architecture elements to specific requirement IDs (US-001..US-016), so traceability from architecture back to requirements cannot be established beyond general inference.
- Input does not clarify whether cache and queue are the same Redis instance/cluster or physically separate ElastiCache deployments.

### Development

- Delivery record does not confirm whether all three sub-tasks (T1-T3) were completed individually -- only a single ticket-level delivered status and commit are given.
- US-015 and US-016 both report the identical commit hash de16eb51a722219aada45123727d7385e627a3bd -- flagged as a discrepancy: unclear if this is a single combined commit covering both stories or a reporting error.
- US-016 and US-015 both report the identical commit hash de16eb51a722219aada45123727d7385e627a3bd -- flagged as a discrepancy: unclear if this is a single combined commit covering both stories or a reporting error.
- No ticket-level status/commit provided for US-001 (Email/password login) despite being foundational to Sprint 1.
- No ticket-level status/commit provided for US-017 (sign-in form cleanup).
- No ticket-level status/commit provided for US-004 (HR employee records) and US-005 (reporting lines), both Sprint 1 goals.
- No ticket-level status/commit provided for US-006 (data protection/audit trail), a Sprint 3 goal assigned to security-agent.
- No ticket-level status/commit provided for US-007, US-008, US-009 (goal setting/SMART/OKR/cascading), Sprint 3 goals.
- No ticket-level status/commit provided for US-010, US-011, US-012 (progress tracking, check-ins, reminders), Sprint 4/5 goals.
- No ticket-level status/commit provided for US-013, US-014 (personal and manager goal dashboards), Sprint 4/5 goals.
- Conflict: run status field says 'completed' while 13 of 17 planned stories show no delivery evidence -- needs confirmation whether these were deferred, dropped, or simply omitted from reporting.

### Testing

- No breakdown of what the 5 checks actually verify -- cannot confirm which functional areas were exercised.
- No mapping provided between these checks and specific requirement IDs (US-001 through US-016), so requirement-level test coverage cannot be confirmed.
- No ticket ID associated with this run, so it cannot be traced to a specific plan or development item.
- No information on test environment, test data, or whether these are unit, integration, or end-to-end checks.
- No record of any failed/retried runs prior to this success, or of manual/exploratory testing, if any was performed.
<!-- sdlc:auto:end open-gaps -->
