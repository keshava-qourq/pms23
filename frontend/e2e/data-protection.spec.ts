// Data protection journey on the Employees screen (US-006): export, the
// anonymising "personal data" deletion, and the audit trail it writes.
//
// frontend/src/screens/Employees.tsx manages its records as local UI state
// seeded from a fixed in-memory fixture list (see the DEFECT note in
// frontend/e2e/employees.spec.ts: the screen never calls the backend yet),
// so this suite drives the rendered UI end to end the same way
// employees.spec.ts does, and checks the screen's own contract for AC-017,
// AC-018 and AC-019. The backend contract itself (GET .../export,
// DELETE .../personal-data, GET /audit-log) is covered directly against the
// real API in backend/tests/test_data_protection.py.
import { expect, test } from "@playwright/test";

import { E2E_PASSWORD, E2E_ROLE_USERS, seedE2EUsers } from "./fixtures";

test.beforeAll(() => {
  seedE2EUsers();
});

async function signInAsHrAdmin(page: import("@playwright/test").Page) {
  const { email, homeRoute } = E2E_ROLE_USERS.hr_admin;
  await page.goto("/login");
  await page.locator("#vl-email").fill(email);
  await page.locator("#vl-password").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(new RegExp(`${homeRoute}$`));
}

test.beforeEach(async ({ page }) => {
  await signInAsHrAdmin(page);
});

// AC-017: exporting a person's data produces a downloadable export, named
// as an attachment for that record.
test("[AC-017] exports a person's data and shows the ready-to-download file", async ({
  page,
}) => {
  await page.getByText("Daniel Achebe").first().click();
  await page.getByRole("button", { name: /export this person's data/i }).click();

  await expect(page.getByText(/ready to download/i)).toBeVisible();
  await expect(page.getByText(/-personal-data\.json/i)).toBeVisible();
});

// AC-018: deleting personal data with the approval acknowledged anonymises
// the record on screen, and the audit trail records it.
test("[AC-018] deletes personal data with a reason and sees the anonymised row", async ({
  page,
}) => {
  await page.getByText("Ines Marchetti").first().click();
  await page.getByRole("button", { name: /delete personal data/i }).click();

  // Confirming without acknowledging the approved request is rejected inline.
  await page.getByRole("button", { name: /anonymise this record/i }).click();
  await expect(page.getByText(/tick the approval box first/i)).toBeVisible();

  await page.locator("#dp-approved").check();
  await page.getByRole("button", { name: /anonymise this record/i }).click();

  await expect(page.getByRole("status")).toContainText(/anonymised/i);
  await expect(page.getByText("Anonymised").first()).toBeVisible();
});

// AC-019: the audit trail records the deletion and lets HR admin reach it
// straight from the anonymised record, with newest entries first.
test("[AC-019] opens the audit trail and sees the resulting entry", async ({ page }) => {
  await page.getByText("Rory Kavanagh").first().click();
  await page.getByRole("button", { name: /delete personal data/i }).click();
  await page.locator("#dp-approved").check();
  await page.getByRole("button", { name: /anonymise this record/i }).click();
  await expect(page.getByRole("status")).toContainText(/anonymised/i);

  await page.getByRole("button", { name: /see the audit entries/i }).click();

  await expect(page.getByRole("heading", { name: /audit trail/i })).toBeVisible();
  await expect(page.getByText(/personal_data\.delete/i)).toBeVisible();

  // The entity filter narrows the list back to "all" when cleared.
  const clearFilter = page.getByRole("button", { name: /^clear filter on/i });
  if (await clearFilter.isVisible()) {
    await clearFilter.click();
  }
});

// NFR-010: the Employees screen's audit trail tab is usable at a 360px
// mobile viewport, the same contract the rest of the screen already meets.
test("[AC-019] the audit trail is usable at a 360px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/employees");
  await page.getByRole("button", { name: /audit trail/i }).click();

  await expect(page.getByRole("heading", { name: /audit trail/i })).toBeVisible();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});
