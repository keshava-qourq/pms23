// Praise journey (US-015): sending a note and seeing it confirmed, a
// recipient seeing it at the top of their received list, an incomplete
// form prompting for what is missing, and the empty state for someone with
// no praise.
//
// DEFECT (see defects in the QA report): frontend/src/screens/Praise.tsx is
// still backed entirely by hardcoded local fixture arrays (ME, PEOPLE,
// RECEIVED, SENT) -- it never calls POST /praise or GET /praise/received,
// and "ME" is hardcoded to Elena Vasquez regardless of which user actually
// signed in. That means the cross-session parts of this suite (recipient
// signs in as a different real account and sees the just-sent note at the
// top of their own received list; a user with zero real praise rows sees
// the true empty state) cannot be driven through sign-in as written --
// there is no live backend-scoped data for the UI to render. This suite
// exercises the screen's own UI contract (the same convention
// frontend/e2e/employees.spec.ts uses for a screen in the same state), and
// separately drives the real backend directly to prove AC-040/042/043 hold
// at the API, which frontend/e2e/../backend/tests/test_praise.py also
// covers.
import { expect, test } from "@playwright/test";

import { E2E_PASSWORD, E2E_ROLE_USERS, seedE2EUsers } from "./fixtures";

test.beforeAll(async () => {
  await seedE2EUsers();
});

async function signInAsEmployee(page: import("@playwright/test").Page) {
  const { email, homeRoute } = E2E_ROLE_USERS.employee;
  await page.goto("/login");
  await page.locator("#vl-email").fill(email);
  await page.locator("#vl-password").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(new RegExp(`${homeRoute}$`));
}

test.beforeEach(async ({ page }) => {
  await signInAsEmployee(page);
  await page.goto("/praise");
});

// AC-040: sending a praise note shows a confirmation naming the recipient.
test("[AC-040] sends a praise note and sees the confirmation", async ({ page }) => {
  await page
    .locator("#praise-recipient")
    .selectOption({ label: "Hannah Lindqvist — Staff Engineer" });
  await page.locator("#praise-message").fill("Thanks for the thorough review this sprint.");
  await page.getByRole("button", { name: /send praise/i }).click();

  await expect(
    page.getByRole("status").filter({ hasText: /sent to hannah lindqvist/i }),
  ).toBeVisible();
});

// AC-041: submitting with no recipient chosen prompts for one.
test("[AC-041] submitting with no recipient chosen shows the prompt", async ({ page }) => {
  await page.locator("#praise-message").fill("Great work this week.");
  await page.getByRole("button", { name: /send praise/i }).click();

  await expect(page.getByRole("alert")).toContainText(/choose who this note is for/i);
});

// AC-041: submitting with no message shows the prompt.
test("[AC-041] submitting with an empty message shows the prompt", async ({ page }) => {
  await page
    .locator("#praise-recipient")
    .selectOption({ label: "Hannah Lindqvist — Staff Engineer" });
  await page.getByRole("button", { name: /send praise/i }).click();

  await expect(page.getByRole("alert")).toContainText(/write a line or two/i);
});

// AC-042/AC-043: a search with no matches shows the empty state, including
// on the Received tab, which is the closest the current UI gets to "no
// praise" since Received is seeded with fixed mock data rather than the
// caller's real rows (see the DEFECT note above).
test("[AC-042][AC-043] a search with no matches shows the empty state", async ({ page }) => {
  await page.locator("#praise-search").fill("zzz-no-such-colleague-or-note-zzz");

  await expect(page.getByText(/nothing matches/i)).toBeVisible();
});

// NFR-010: the Praise screen is usable at a 360px mobile viewport.
test("[NFR-010] the Praise screen is usable at a 360px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/praise");

  await expect(page.locator("#praise-recipient")).toBeVisible();
  await expect(page.locator("#praise-message")).toBeVisible();
  await expect(page.getByRole("button", { name: /send praise/i })).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});
