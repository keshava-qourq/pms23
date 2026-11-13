// Password reset journey (US-003-3): requesting a link from the login
// screen, setting a new password from a valid link and signing in with it,
// and the UI's response to a stale (expired or already-used) link.
//
// A plaintext reset token never appears in any API response (AC-008/NFR-003),
// so this suite cannot get one by reading a response body the way it reads a
// session token. backend/tests/e2e_reset_helper.py drives the real
// POST /auth/password-reset/request against the real sandbox Postgres and
// intercepts only the outbound email to recover the link -- see that file.
import { expect, test } from "@playwright/test";

import {
  expireLatestResetToken,
  markLatestResetTokenUsed,
  requestResetToken,
  seedE2EUsers,
} from "./fixtures";

const RESET_EMAIL = "e2e.resetflow@example.com";
const EXPIRED_EMAIL = "e2e.resetflow.expired@example.com";
const USED_EMAIL = "e2e.resetflow.used@example.com";
const NEW_PASSWORD = "NewStr0ngPass!1";

test.beforeAll(async () => {
  // Re-seeds every e2e user, including these three, with a known password --
  // undoing any password this suite's own "valid link" test changed on a
  // previous run, so the suite is safe to run more than once.
  await seedE2EUsers();
});

// AC-008: a reset request starts from the login page.
test("[AC-008] requests a reset link from the login page", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: /email me a reset link/i }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);

  await page.locator("#fp-email").fill(RESET_EMAIL);
  await page.getByRole("button", { name: /email me a reset link/i }).click();

  await expect(page.getByRole("status")).toContainText("Check your inbox.");
});

// AC-008: an unregistered email gets the identical confirmation -- no
// enumeration signal from the UI either.
test("[AC-008] an unregistered email shows the identical confirmation", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.locator("#fp-email").fill("no-such-account@example.com");
  await page.getByRole("button", { name: /email me a reset link/i }).click();

  await expect(page.getByRole("status")).toContainText("Check your inbox.");
});

// AC-009: a valid, unexpired link sets a new password and that password
// signs in immediately afterwards.
test("[AC-009] sets a new password from a valid link and signs in with it", async ({ page }) => {
  const token = await requestResetToken(RESET_EMAIL);

  await page.goto(`/reset-password?token=${token}`);
  await page.locator("#rp-password").fill(NEW_PASSWORD);
  await page.locator("#rp-confirm").fill(NEW_PASSWORD);
  await page.getByRole("button", { name: /set new password/i }).click();

  await expect(page).toHaveURL(/\/login$/);

  await page.locator("#vl-email").fill(RESET_EMAIL);
  await page.locator("#vl-password").fill(NEW_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
});

// AC-010/NFR-003: an expired link is rejected and prompts for a new one.
test("[AC-010] an expired link is rejected and prompts to request a new link", async ({ page }) => {
  const token = await requestResetToken(EXPIRED_EMAIL);
  await expireLatestResetToken(EXPIRED_EMAIL);

  await page.goto(`/reset-password?token=${token}`);
  await page.locator("#rp-password").fill(NEW_PASSWORD);
  await page.locator("#rp-confirm").fill(NEW_PASSWORD);
  await page.getByRole("button", { name: /set new password/i }).click();

  await expect(page.getByRole("alert")).toContainText(/invalid or has expired/i);
  const requestNewLink = page.getByRole("link", { name: /request a new link/i });
  await expect(requestNewLink).toBeVisible();
  await requestNewLink.click();
  await expect(page).toHaveURL(/\/forgot-password$/);
});

// AC-010/NFR-003: an already-used link is rejected the same way, and the
// password it would have set is never applied.
test("[AC-010] an already-used link is rejected and prompts to request a new link", async ({
  page,
}) => {
  const token = await requestResetToken(USED_EMAIL);
  await markLatestResetTokenUsed(USED_EMAIL);

  await page.goto(`/reset-password?token=${token}`);
  await page.locator("#rp-password").fill(NEW_PASSWORD);
  await page.locator("#rp-confirm").fill(NEW_PASSWORD);
  await page.getByRole("button", { name: /set new password/i }).click();

  await expect(page.getByRole("alert")).toContainText(/invalid or has expired/i);
  await expect(page.getByRole("link", { name: /request a new link/i })).toBeVisible();

  // The backend is a separate origin from the frontend baseURL this
  // context's relative requests resolve against (see playwright.config.ts
  // and frontend/src/lib/api.ts), so this needs the absolute API URL.
  const login = await page.request.post("http://127.0.0.1:8000/auth/login", {
    data: { email: USED_EMAIL, password: NEW_PASSWORD },
  });
  expect(login.status()).toBe(401);
});

// NFR-010: the forgot-password and reset-password screens are usable at a
// 360px mobile viewport, same contract the login suite checks for /login.
test("[NFR-010] the forgot-password screen is usable at a 360px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/forgot-password");

  await expect(page.locator("#fp-email")).toBeVisible();
  const submit = page.getByRole("button", { name: /email me a reset link/i });
  await expect(submit).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);

  const box = await submit.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x + box!.width).toBeLessThanOrEqual(360);
});

test("[NFR-010] the reset-password screen is usable at a 360px mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/reset-password?token=some-token");

  await expect(page.locator("#rp-password")).toBeVisible();
  await expect(page.locator("#rp-confirm")).toBeVisible();
  const submit = page.getByRole("button", { name: /set new password/i });
  await expect(submit).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);

  const box = await submit.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x + box!.width).toBeLessThanOrEqual(360);
});
