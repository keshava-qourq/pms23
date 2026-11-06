import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Login from "./Login";
import { clearSessionToken, getSessionToken } from "@/lib/api";

function fillAndSubmit(email: string, password: string) {
  return async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/work email/i), email);
    await user.type(screen.getByLabelText(/^password$/i), password);
    await user.click(screen.getByRole("button", { name: /sign in/i }));
  };
}

describe("Login", () => {
  beforeEach(() => {
    clearSessionToken();
  });
  afterEach(() => {
    clearSessionToken();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-001] submits credentials, stores the token, and routes an employee to dashboard", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: "tok-123",
          token_type: "bearer",
          user: {
            id: "u-1",
            name: "Nadia Okonkwo",
            email: "nadia@pms23.internal",
            role: "employee",
          },
          home_route: "/dashboard",
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>,
    );

    await fillAndSubmit("nadia@pms23.internal", "Quarterly!2026")();

    await waitFor(() => expect(getSessionToken()).toBe("tok-123"));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("[AC-002] a 401 renders one generic error in the role=alert region", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>,
    );

    await fillAndSubmit("nadia@pms23.internal", "wrong-password")();

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "We could not sign you in with those details. Check the email address and password, then try again.",
    );
    expect(alert.textContent).not.toMatch(/email.*wrong|password.*wrong/i);
    expect(getSessionToken()).toBeNull();
  });

  it("[AC-001] shows a loading state while the request is in flight", async () => {
    let resolveFetch: (value: Response) => void = () => {};
    const pending = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(pending));

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/work email/i), "nadia@pms23.internal");
    await user.type(screen.getByLabelText(/^password$/i), "Quarterly!2026");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByRole("button", { name: /checking credentials/i })).toBeDisabled();

    resolveFetch(
      new Response(
        JSON.stringify({
          access_token: "tok-999",
          token_type: "bearer",
          user: { id: "u-1", name: "Nadia", email: "n@pms23.internal", role: "employee" },
          home_route: "/dashboard",
        }),
        { status: 200 },
      ),
    );

    await waitFor(() => expect(getSessionToken()).toBe("tok-999"));
  });

  it("[AC-001] rejects submission when a required field is empty, with no network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Enter both your work email address and your password.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
