import { expect, test } from "@playwright/test";

import { E2E_DEACTIVATED_EMAIL, E2E_PASSWORD, E2E_ROLE_USERS, seedE2EUsers } from "./fixtures";

test.beforeAll(() => {
  seedE2EUsers();
});

async function signIn(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login");
  await page.locator("#vl-email").fill(email);
  await page.locator("#vl-password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

// AC-001: each of the four roles lands on its own home screen after sign-in.
for (const [role, { email, homeRoute }] of Object.entries(E2E_ROLE_USERS)) {
  test(`[AC-001] signing in as ${role} lands on ${homeRoute}`, async ({ page }) => {
    await signIn(page, email, E2E_PASSWORD);

    await expect(page).toHaveURL(new RegExp(`${homeRoute}$`));
  });
}

// AC-002: wrong password and an unknown email both show the one generic message.
test("[AC-002] wrong password shows the single generic error message", async ({ page }) => {
  await signIn(page, E2E_ROLE_USERS.employee.email, "definitely-not-the-password");

  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(
    "We could not sign you in with those details. Check the email address and password, then try again.",
  );
  await expect(page).toHaveURL(/\/login$/);
});

test("[AC-002] an unknown email shows the same generic error message", async ({ page }) => {
  await signIn(page, "no-such-account@example.com", E2E_PASSWORD);

  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(
    "We could not sign you in with those details. Check the email address and password, then try again.",
  );
  await expect(page).toHaveURL(/\/login$/);
});

test("[AC-002] a deactivated account's correct password shows the same generic error", async ({
  page,
}) => {
  await signIn(page, E2E_DEACTIVATED_EMAIL, E2E_PASSWORD);

  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(
    "We could not sign you in with those details. Check the email address and password, then try again.",
  );
});

// AC-003: signing out, then reloading, requires signing in again.
test("[AC-003] signing out then reloading requires signing in again", async ({ page }) => {
  const { email, homeRoute } = E2E_ROLE_USERS.employee;
  await signIn(page, email, E2E_PASSWORD);
  await expect(page).toHaveURL(new RegExp(`${homeRoute}$`));

  await page.getByRole("button", { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/login$/);

  // Reload at the login screen, then try to come back to the home route
  // directly: a cleared session must bounce back to /login, not restore it.
  await page.reload();
  await page.goto(homeRoute);
  await expect(page).toHaveURL(/\/login$/);
});

// AC-044/AC-045: the stale role-permissions description is gone, and the
// rest of the sign-in form (email, password, submit, reset link) still
// works end to end for a valid sign-in.
test("[AC-044][AC-045] the description text is gone and sign-in still completes", async ({
  page,
}) => {
  await page.goto("/login");

  await expect(page.getByText("PMS23 shows only what your role permits")).toHaveCount(0);

  const emailInput = page.locator("#vl-email");
  const passwordInput = page.locator("#vl-password");
  const submitButton = page.getByRole("button", { name: /sign in/i });
  const resetLink = page.getByRole("link", { name: /email me a reset link/i });

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(submitButton).toBeVisible();
  await expect(resetLink).toBeVisible();

  const { email, homeRoute } = E2E_ROLE_USERS.employee;
  await emailInput.fill(email);
  await passwordInput.fill(E2E_PASSWORD);
  await submitButton.click();

  await expect(page).toHaveURL(new RegExp(`${homeRoute}$`));
});

// NFR-010: the login screen must render usably at a 360px mobile viewport.
test("[NFR-010] the login screen is usable at a 360px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/login");

  await expect(page.locator("#vl-email")).toBeVisible();
  await expect(page.locator("#vl-password")).toBeVisible();
  const signInButton = page.getByRole("button", { name: /sign in/i });
  await expect(signInButton).toBeVisible();

  // No horizontal scroll: content fits the viewport rather than spilling past it.
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);

  const box = await signInButton.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(360);
});
