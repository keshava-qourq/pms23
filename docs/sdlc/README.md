# PMS23 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
performance management system

**Documentation version:** v8
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v2 approved |
| [Architecture](architecture/README.md) | 16 entries |
| [Development](development/README.md) | 11 entries |
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
| [Changelog](CHANGELOG.md) | 8 versions |
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

- No delivery/ticket status reported for US-001, US-004, or US-005 despite the development run being marked 'completed'.
- No delivery/ticket status reported for US-006, US-007, US-008, or US-009 despite the development run being marked 'completed'.
- No delivery/ticket status reported for US-010, US-011, or US-013 despite the development run being marked 'completed'.
- No delivery/ticket status reported for US-012 or US-014 despite the development run being marked 'completed'.
- Input does not confirm per-sub-task completion (US-002-T1, US-002-T2, US-002-T3) separately from the parent story.
- Same commit hash is listed for US-015 and US-016; confirm whether this is intentional (combined commit) or a reporting duplication.
- Discrepancy: run-level status says 'completed' while 12 of 16 planned stories (and all sub-tasks) have no delivery evidence -- needs confirmation of whether they were completed outside reported tickets, descoped, or omitted from reporting.

### Testing

- No breakdown of what the 5 checks actually verify -- cannot confirm which functional areas were exercised.
- No mapping provided between these checks and specific requirement IDs (US-001 through US-016), so requirement-level test coverage cannot be confirmed.
- No ticket ID associated with this run, so it cannot be traced to a specific plan or development item.
- No information on test environment, test data, or whether these are unit, integration, or end-to-end checks.
- No record of any failed/retried runs prior to this success, or of manual/exploratory testing, if any was performed.
<!-- sdlc:auto:end open-gaps -->
