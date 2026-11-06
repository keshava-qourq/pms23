import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import ForgotPassword from "./ForgotPassword";

describe("ForgotPassword", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-008] calls the request endpoint and shows the same confirmation for a registered email", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: "ok" }), { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/work email/i), "known@pms23.internal");
    await user.click(screen.getByRole("button", { name: /email me a reset link/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/auth/password-reset/request"),
        expect.objectContaining({ method: "POST" }),
      ),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("Check your inbox.");
  });

  it("[AC-008] shows the same confirmation message for an unregistered email", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: "ok" }), { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/work email/i), "unknown@pms23.internal");
    await user.click(screen.getByRole("button", { name: /email me a reset link/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Check your inbox.");
  });

  it("[AC-008] rejects submission with an empty email, with no network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /email me a reset link/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Enter the work email address your PMS23 account uses.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
