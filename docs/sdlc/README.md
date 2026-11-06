# PMS23 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
performance management system

**Documentation version:** v11
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v2 approved |
| [Architecture](architecture/README.md) | 16 entries |
| [Development](development/README.md) | 9 entries |
| [Testing](testing/README.md) | 2 entries |
| [Deployment](deployment/README.md) | 0 entries |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 5 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 27 routes |
| [Test report](testing/test-report.md) | no_tests |
| [Tests](testing/test-cases.md) | 117 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 17 requirements |
| [Changelog](CHANGELOG.md) | 11 versions |
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

- The input does not explicitly assign backlog items to sprints; the mapping above is inferred by matching sprint goal text to known requirement keys, not an explicit sprint-to-item assignment in the plan -- treat as approximate and confirm against the authoritative sprint board.
- Discrepancy: overall run status says 'completed' but only 1 of 17 stories (and none of the associated tasks) has a recorded delivery/commit -- cannot confirm whether the remaining stories and tasks were actually built, tested, or merged.
- No per-ticket status is available for US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012 (and its tasks), US-013, US-014, US-015, US-016.
- No date recorded for delivery; no reviewer/approval information provided beyond 'delivered' status.

### Testing

- No ticket is associated with this run, so it cannot be linked to a specific requirement (US-001..US-017).
- Nature/content of the 5 checks (unit, lint, static analysis, etc.) is not specified in the input.
- No timestamp beyond today's reporting date was provided for when the run actually occurred.
- No E2E test cases exist yet for sandbox target, so no functional/requirement-level validation (US-001..US-017) can be confirmed from this run.
- Unclear whether E2E tests are planned but not yet written, or whether the suite is misconfigured and failing to discover tests.
<!-- sdlc:auto:end open-gaps -->
