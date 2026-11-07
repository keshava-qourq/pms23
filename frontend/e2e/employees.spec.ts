// HR admin journey on the Employees screen (US-004). The screen itself
// manages its records as local UI state seeded from a fixed in-memory list
// (see frontend/src/screens/Employees.tsx) rather than calling the backend
// yet, so this suite drives the rendered UI end to end the way an HR admin
// would, and checks the UI's own contract: creating, editing, assigning a
// manager, rejecting a cycle inline, and deactivating.
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

// AC-011: HR admin creates an employee record.
test("[AC-011] creates an employee record", async ({ page }) => {
  await page
    .getByRole("button", { name: /add employee/i })
    .first()
    .click();

  await page.locator("#new-name").fill("Jordan Patel");
  await page.locator("#new-email").fill("jordan.patel@northgate.co");
  await page.getByRole("button", { name: /save employee record/i }).click();

  await expect(page.getByRole("status")).toContainText("Jordan Patel");
  await expect(page.getByText("Jordan Patel").first()).toBeVisible();
});

// AC-011: duplicate work email is rejected inline.
test("[AC-011] duplicate email is rejected with an inline error", async ({ page }) => {
  await page
    .getByRole("button", { name: /add employee/i })
    .first()
    .click();

  await page.locator("#new-name").fill("Duplicate Person");
  // Seeded record Daniel Achebe already owns this email in the screen's fixture data.
  await page.locator("#new-email").fill("daniel.achebe@northgate.co");
  await page.getByRole("button", { name: /save employee record/i }).click();

  await expect(page.locator("#new-email-err")).toContainText("already belongs to");
});

// AC-012: editing a record is reflected back on the screen.
test("[AC-012] editing a record reflects the change", async ({ page }) => {
  await page.getByText("Rory Kavanagh").first().click();
  await page.locator("#edit-name").fill("Rory Kavanagh-Smith");
  await page.getByRole("button", { name: /save changes/i }).click();

  await expect(page.getByRole("status")).toContainText("saved");
  await expect(page.getByText("Rory Kavanagh-Smith").first()).toBeVisible();
});

// AC-016: assigning a manager that would create a cycle shows an inline error
// and nothing is saved.
test("[AC-016] a reporting-line cycle is rejected inline", async ({ page }) => {
  // Daniel Achebe is the top of the chain; Ines Marchetti already reports to him.
  // Setting Daniel's manager to Ines would close a cycle.
  //
  // Each row's own "Reports to" column can also contain these names as plain
  // text (e.g. Ines's row shows "Daniel Achebe" as her current manager), so a
  // plain text locator can match that column instead of the row's own clickable
  // name button. Scope to the name button itself to select the right record.
  await page.getByRole("button", { name: /Ines Marchetti/ }).click();
  await page.getByRole("button", { name: /Daniel Achebe/ }).click();
  await page.locator("#edit-manager").selectOption({ label: "Ines Marchetti · Manager" });
  await page.getByRole("button", { name: /save changes/i }).click();

  await expect(page.locator("#edit-manager-err")).toContainText(/loop|report to themselves/i);
});

// AC-013: deactivating marks the record inactive and blocks nothing else on screen.
test("[AC-013] deactivating an employee marks them inactive", async ({ page }) => {
  await page.getByText("Felix Brenner").first().click();
  await page.getByRole("button", { name: /deactivate account/i }).click();
  await page.getByRole("button", { name: /yes, deactivate/i }).click();

  await expect(page.getByRole("status")).toContainText("can no longer sign in");
  await expect(page.getByText("Deactivated").first()).toBeVisible();
});

// NFR-010: the Employees screen must be usable at a 360px mobile viewport.
test("[NFR-010] the Employees screen is usable at a 360px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/employees");

  await expect(page.getByRole("button", { name: /add employee/i }).first()).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});
