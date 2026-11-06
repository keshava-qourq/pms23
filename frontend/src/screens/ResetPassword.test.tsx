import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import ResetPassword from "./ResetPassword";
import Login from "./Login";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ResetPassword", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-009] reads the token from the URL, calls confirm, and routes to login on success", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ detail: "Your password has been updated." }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    renderAt("/reset-password?token=abc123");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^new password$/i), "Quarterly!2026");
    await user.type(screen.getByLabelText(/confirm new password/i), "Quarterly!2026");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/auth/password-reset/confirm"),
        expect.objectContaining({ method: "POST" }),
      ),
    );
    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sentBody).toEqual({ token: "abc123", new_password: "Quarterly!2026" });

    await waitFor(() => expect(screen.getByRole("heading", { name: "PMS23" })).toBeInTheDocument());
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
  });

  it("[AC-010] an expired or rejected token shows an inline error with a control to request a new link", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);

    renderAt("/reset-password?token=expired-token");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^new password$/i), "Quarterly!2026");
    await user.type(screen.getByLabelText(/confirm new password/i), "Quarterly!2026");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "This reset link is invalid or has expired. Please request a new one.",
    );
    expect(screen.getByRole("link", { name: /request a new link/i })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
  });

  it("shows an inline error, with no network call, when the URL carries no token", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderAt("/reset-password");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^new password$/i), "Quarterly!2026");
    await user.type(screen.getByLabelText(/confirm new password/i), "Quarterly!2026");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This reset link is invalid or has expired. Please request a new one.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates password rules inline before submit, with no network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderAt("/reset-password?token=abc123");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^new password$/i), "weak");
    await user.type(screen.getByLabelText(/confirm new password/i), "weak");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Password must be at least 8 characters long",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects submission when the two passwords do not match, with no network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderAt("/reset-password?token=abc123");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^new password$/i), "Quarterly!2026");
    await user.type(screen.getByLabelText(/confirm new password/i), "Different!2026");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Those two passwords do not match.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
