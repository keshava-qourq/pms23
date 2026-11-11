# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
171 tests · Passed 136 · Failed 0 · Skipped 0 · Not run 35

Acceptance criteria covered: 30/45 · passing: 8/45
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Email/password login

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | App > lets an authenticated session reach /dashboard and shows a Sign out control | Unit | Passed | `frontend/src/App.test.tsx` |
| — | App > opens on Sign in, with no menu around it | Unit | Passed | `frontend/src/App.test.tsx` |
| — | App > redirects unauthenticated access to /dashboard back to the login screen | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-001 | Login > [AC-001] rejects submission when a required field is empty, with no network call | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-001 | Login > [AC-001] shows a loading state while the request is in flight | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-001 | Login > [AC-001] submits credentials, stores the token, and routes an employee to dashboard | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-002 | Login > [AC-002] a 401 renders one generic error in the role=alert region | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| — | test_deactivated_user_cannot_log_in | Integration | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[employee-/dashboard] | Integration | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[executive-/dashboard] | Integration | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[hr_admin-/employees] | Integration | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[manager-/team] | Integration | Passed | `backend/tests/test_auth.py` |
| — | test_logout_makes_token_unusable_on_protected_endpoint | Integration | Passed | `backend/tests/test_auth.py` |
| — | test_no_password_hash_or_plaintext_in_login_and_logout_responses | Integration | Passed | `backend/tests/test_auth.py` |
| — | test_wrong_password_and_unknown_email_return_byte_identical_401_bodies | Integration | Passed | `backend/tests/test_auth.py` |
| AC-002 | [AC-002] a deactivated account's correct password shows the same generic error | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| AC-002 | [AC-002] an unknown email shows the same generic error message | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| AC-002 | [AC-002] wrong password shows the single generic error message | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| AC-003 | [AC-003] signing out then reloading requires signing in again | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| — | [NFR-010] the login screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/login.spec.ts` |

### US-004: HR creates and maintains employee records

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-011 | test_ac011_duplicate_email_returns_409 | Integration | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_hr_admin_creates_employee | Integration | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_non_hr_admin_cannot_create_employee[employee] | Integration | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_non_hr_admin_cannot_create_employee[executive] | Integration | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_non_hr_admin_cannot_create_employee[manager] | Integration | Passed | `backend/tests/test_employees.py` |
| AC-012 | test_ac012_edit_reflects_in_response_and_store | Integration | Passed | `backend/tests/test_employees.py` |
| AC-012 | test_ac012_non_hr_admin_cannot_edit_employee | Integration | Passed | `backend/tests/test_employees.py` |
| AC-013 | test_ac013_deactivate_blocks_login | Integration | Passed | `backend/tests/test_employees.py` |
| AC-013 | test_ac013_deactivation_preserves_goals_praise_and_history | Integration | Passed | `backend/tests/test_employees.py` |
| AC-013 | test_ac013_non_hr_admin_cannot_deactivate | Integration | Passed | `backend/tests/test_employees.py` |
| AC-014 | test_ac014_direct_report_appears_in_manager_reports | Integration | Passed | `backend/tests/test_employees.py` |
| AC-015 | test_ac015_reassignment_revokes_previous_manager_access | Integration | Passed | `backend/tests/test_employees.py` |
| AC-016 | test_ac016_rejects_self_assignment | Integration | Passed | `backend/tests/test_employees.py` |
| AC-016 | test_ac016_rejects_three_node_cycle | Integration | Passed | `backend/tests/test_employees.py` |
| AC-016 | test_ac016_rejects_two_node_cycle | Integration | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_audit_log_is_hr_admin_only[employee] | Integration | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_audit_log_is_hr_admin_only[executive] | Integration | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_audit_log_is_hr_admin_only[manager] | Integration | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_manager_change_produces_audit_row | Integration | Passed | `backend/tests/test_employees.py` |
| AC-011 | [AC-011] creates an employee record | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-011 | [AC-011] duplicate email is rejected with an inline error | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-012 | [AC-012] editing a record reflects the change | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-013 | [AC-013] deactivating an employee marks them inactive | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-016 | [AC-016] a reporting-line cycle is rejected inline | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| — | [NFR-010] the Employees screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |

## Sprint 2

### US-002: Role-based access to sensitive HR data

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-004 | test_ac004_employee_cannot_read_another_employees_check_ins | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-004 | test_ac004_employee_cannot_read_or_write_another_employees_goal | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-004 | test_ac004_employee_cannot_see_another_employees_praise_in_their_own_received_list | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-005 | test_ac005_manager_denied_goal_outside_reporting_line | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-005 | test_ac005_manager_sees_own_direct_and_skip_level_report_goals | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_cannot_create_goal | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_cannot_update_goal | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_cannot_update_goal_progress | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_reads_analytics | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-007 | test_ac007_hr_admin_reads_any_employees_goals | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-007 | test_ac007_hr_admin_reads_any_employees_team_dashboard | Integration | Passed | `backend/tests/test_rbac.py` |
| AC-007 | test_ac007_hr_admin_updates_any_employees_goal | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/analytics-None] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/dashboard/me-None] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/dashboard/team-None] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/employees/632571e0-c40a-4a50-b4ff-34e7a12adee3/reports-None] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/goals-None] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/goals/3f5e4c08-429f-472b-aaa5-b0b9833303f8/check-ins-None] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/praise/received-None] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[patch-/goals/4160ff05-7480-4d47-82fe-a0ac0cac9035/progress-json_body3] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[post-/goals-json_body1] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[post-/goals/a015c8b8-e1b2-470c-b609-20f768be2cdc/check-ins-json_body4] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[post-/praise-json_body11] | Integration | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[put-/goals/8d8bfc07-0004-478c-a4eb-3d2f27dea98b-json_body2] | Integration | Passed | `backend/tests/test_rbac.py` |

### US-003: Password reset

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_password_rule_accepts_compliant_password | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_missing_digit | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_missing_lowercase | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_missing_uppercase | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_too_short_password | Unit | Passed | `backend/tests/test_password_rules.py` |
| AC-008 | ForgotPassword > [AC-008] calls the request endpoint and shows the same confirmation for a registered email | Unit | Passed | `frontend/src/screens/ForgotPassword.test.tsx` |
| AC-008 | ForgotPassword > [AC-008] rejects submission with an empty email, with no network call | Unit | Passed | `frontend/src/screens/ForgotPassword.test.tsx` |
| AC-008 | ForgotPassword > [AC-008] shows the same confirmation message for an unregistered email | Unit | Passed | `frontend/src/screens/ForgotPassword.test.tsx` |
| AC-009 | ResetPassword > [AC-009] reads the token from the URL, calls confirm, and routes to login on success | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| AC-010 | ResetPassword > [AC-010] an expired or rejected token shows an inline error with a control to request a new link | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| — | ResetPassword > rejects submission when the two passwords do not match, with no network call | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| — | ResetPassword > shows an inline error, with no network call, when the URL carries no token | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| — | ResetPassword > validates password rules inline before submit, with no network call | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| AC-008 | test_ac008_registered_email_creates_token_row_and_sends_email | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-009 | test_ac009_valid_token_updates_password_and_allows_immediate_login | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-010 | test_ac010_already_used_token_rejected_and_password_unchanged | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-010 | test_ac010_expired_token_rejected_and_password_unchanged | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-010 | test_ac010_unknown_token_rejected_with_retry_message | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_nfr003_replay_of_already_confirmed_token_is_rejected | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_no_account_enumeration_identical_response_known_and_unknown_email | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_password_rule_violation_names_the_rule_without_leaking_token | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_response_never_contains_the_plaintext_token | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-008 | [AC-008] an unregistered email shows the identical confirmation | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-008 | [AC-008] requests a reset link from the login page | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-009 | [AC-009] sets a new password from a valid link and signs in with it | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-010 | [AC-010] an already-used link is rejected and prompts to request a new link | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-010 | [AC-010] an expired link is rejected and prompts to request a new link | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| — | [NFR-010] the forgot-password screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| — | [NFR-010] the reset-password screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |

### US-015: Give a praise/recognition note

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-040 | test_ac040_post_praise_persists_note_and_creates_notification | Integration | Passed | `backend/tests/test_praise.py` |
| AC-041 | test_ac041_empty_message_is_rejected_and_writes_no_row | Integration | Passed | `backend/tests/test_praise.py` |
| AC-041 | test_ac041_missing_message_field_is_rejected_and_writes_no_row | Integration | Passed | `backend/tests/test_praise.py` |
| AC-041 | test_ac041_missing_recipient_is_rejected_and_writes_no_row | Integration | Passed | `backend/tests/test_praise.py` |
| AC-042 | test_ac042_received_praise_ordered_newest_first | Integration | Passed | `backend/tests/test_praise.py` |
| AC-043 | test_ac043_received_praise_is_empty_list_for_user_with_none | Integration | Passed | `backend/tests/test_praise.py` |
| — | test_nfr001_one_user_cannot_read_anothers_received_praise | Integration | Passed | `backend/tests/test_praise.py` |
| AC-040 | [AC-040] sends a praise note and sees the confirmation | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| AC-041 | [AC-041] submitting with an empty message shows the prompt | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| AC-041 | [AC-041] submitting with no recipient chosen shows the prompt | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| AC-042, AC-043 | [AC-042][AC-043] a search with no matches shows the empty state | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| — | [NFR-010] the Praise screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |

## Sprint 3

### US-006: Data protection: export, delete and audit trail

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-017 | Employees screen > [AC-017] a 404 export shows an error instead of downloading | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| AC-017 | Employees screen > [AC-017] an Export action calls GET /employees/{id}/export and downloads the returned file | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| AC-018 | Employees screen > [AC-018] delete personal data requires a typed reason before it will submit | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| AC-018 | Employees screen > [AC-018] on 204 refreshes the row to show the anonymised state | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| AC-019 | Employees screen > [AC-019] an empty result renders an empty state | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| AC-019 | Employees screen > [AC-019] an error loading the audit trail renders an error state | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| AC-019 | Employees screen > [AC-019] applying filters calls GET /audit-log with entity and date-range query params, newest first | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| — | Employees screen > a 403 from any action shows an access-denied message instead of the actions | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| — | Employees screen > the screen starts with no employee loaded and an empty audit trail, not seeded data | Unit | Passed | `frontend/src/screens/Employees.test.tsx` |
| AC-017 | test_ac017_export_returns_attachment_with_personal_goal_and_checkin_data | Integration | Passed | `backend/tests/test_data_protection.py` |
| AC-018 | test_ac018_missing_reason_returns_422 | Integration | Passed | `backend/tests/test_data_protection.py` |
| AC-018 | test_ac018_personal_data_deletion_anonymises_and_writes_audit_row | Integration | Passed | `backend/tests/test_data_protection.py` |
| AC-018 | test_ac018_unknown_employee_id_returns_404 | Integration | Passed | `backend/tests/test_data_protection.py` |
| AC-019 | test_ac019_audit_entries_exist_for_employee_update_and_manager_change | Integration | Passed | `backend/tests/test_data_protection.py` |
| AC-019 | test_ac019_date_filter_narrows_result | Integration | Passed | `backend/tests/test_data_protection.py` |
| AC-019 | test_ac019_entity_filter_narrows_result | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_audit_log_is_hr_admin_only[employee] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_audit_log_is_hr_admin_only[executive] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_audit_log_is_hr_admin_only[manager] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_delete_personal_data_is_hr_admin_only[employee] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_delete_personal_data_is_hr_admin_only[executive] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_delete_personal_data_is_hr_admin_only[manager] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_export_is_hr_admin_only[employee] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_export_is_hr_admin_only[executive] | Integration | Passed | `backend/tests/test_data_protection.py` |
| — | test_rbac_export_is_hr_admin_only[manager] | Integration | Passed | `backend/tests/test_data_protection.py` |
| AC-017 | [AC-017] exports a person's data and shows the ready-to-download file | E2E | Not run yet | `frontend/e2e/data-protection.spec.ts` |
| AC-018 | [AC-018] deletes personal data with a reason and sees the anonymised row | E2E | Not run yet | `frontend/e2e/data-protection.spec.ts` |
| AC-019 | [AC-019] opens the audit trail and sees the resulting entry | E2E | Not run yet | `frontend/e2e/data-protection.spec.ts` |
| AC-019 | [AC-019] the audit trail is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/data-protection.spec.ts` |

### US-007: Create a goal with SMART/OKR structure

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-020 | GoalDetail screen > [AC-020] submits title, description, target_metric, due_date and progress_type to POST /goals and shows the saved goal on 201 | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-021 | GoalDetail screen > [AC-021] blocks submission with title or due date empty and names the missing field | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-021 | GoalDetail screen > [AC-021] surfaces a 422 from the API against the matching field | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-022 | GoalDetail screen > [AC-022] opening an existing goal loads it from GET /goals and saving edits calls PUT /goals/{id} | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-023 | GoalDetail screen > [AC-023] a manager can pick an owner from GET /employees/{id}/reports and the goal shows that person as owner | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-023 | GoalDetail screen > [AC-023] employees see no owner picker | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-024 | GoalDetail screen > [AC-024] a 403 from POST /goals renders a not-permitted message and keeps no optimistic goal row | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-025, AC-026 | GoalDetail screen > [AC-025/AC-026] leaving the parent objective as 'No parent objective' saves a valid standalone goal | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-025, AC-026 | GoalDetail screen > [AC-025/AC-026] the parent objective select is populated from GET /objectives and the linked parent is displayed on save | Unit | Passed | `frontend/src/screens/GoalDetail.test.tsx` |
| AC-020 | test_ac020_employee_creates_a_goal_linked_to_themselves | Integration | Passed | `backend/tests/test_goals.py` |
| AC-021 | test_ac021_missing_due_date_returns_422_naming_the_field_and_persists_no_row | Integration | Passed | `backend/tests/test_goals.py` |
| AC-021 | test_ac021_missing_title_returns_422_naming_the_field_and_persists_no_row | Integration | Passed | `backend/tests/test_goals.py` |
| AC-022 | test_ac022_edit_of_title_description_target_and_due_date_persists | Integration | Passed | `backend/tests/test_goals.py` |
| AC-023 | test_ac023_manager_created_goal_appears_in_reports_goals_with_owner_id | Integration | Passed | `backend/tests/test_goals.py` |
| AC-024 | test_ac024_assignment_outside_reporting_line_returns_403_and_writes_no_row | Integration | Passed | `backend/tests/test_goals.py` |
| AC-025 | test_ac025_goal_links_to_existing_objective_and_parent_is_returned | Integration | Passed | `backend/tests/test_goals.py` |
| AC-025 | test_ac025_unknown_objective_id_on_update_returns_404 | Integration | Passed | `backend/tests/test_goals.py` |
| AC-025 | test_ac025_unknown_objective_id_returns_404 | Integration | Passed | `backend/tests/test_goals.py` |
| AC-026 | test_ac026_goal_with_no_parent_saves_and_lists_as_standalone | Integration | Passed | `backend/tests/test_goals.py` |
| AC-020 | [AC-020] an employee creates a goal and sees it saved | E2E | Not run yet | `frontend/e2e/goals.spec.ts` |
| AC-021 | [AC-021] submitting without a due date shows the inline prompt | E2E | Not run yet | `frontend/e2e/goals.spec.ts` |
| AC-021 | [AC-021] submitting without a title shows the inline prompt | E2E | Not run yet | `frontend/e2e/goals.spec.ts` |
| AC-022 | [AC-022] editing a saved goal persists the change | E2E | Not run yet | `frontend/e2e/goals.spec.ts` |
| AC-023 | [AC-023] a manager creates a goal for a direct report and sees them as owner | E2E | Not run yet | `frontend/e2e/goals.spec.ts` |
| AC-025 | [AC-025] a goal is saved with a parent objective and the parent is shown | E2E | Not run yet | `frontend/e2e/goals.spec.ts` |
| AC-026 | [AC-026] a goal with no parent objective saves and lists as standalone | E2E | Not run yet | `frontend/e2e/goals.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_access_token_round_trips_subject_and_role | Unit | Passed | `backend/tests/test_security.py` |
| — | test_password_hash_round_trips | Unit | Passed | `backend/tests/test_security.py` |
| — | test_health_reports_ok | Integration | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Integration | Passed | `backend/tests/test_health.py` |
| — | test_every_spec_path_is_mounted | Integration | Passed | `backend/tests/test_routes.py` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
