import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import App from "./App";
import { clearSessionToken, setSessionToken } from "@/lib/api";

describe("App", () => {
  afterEach(() => {
    clearSessionToken();
  });

  it("opens on Sign in, with no menu around it", () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(container.firstChild).not.toBeNull();
    // The menu belongs to the screens behind sign-in, so none of its links is here.
    expect(screen.queryByRole("link", { name: "My goals dashboard" })).toBeNull();
  });

  it("redirects unauthenticated access to /dashboard back to the login screen", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "PMS23" })).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
  });

  it("lets an authenticated session reach /dashboard and shows a Sign out control", () => {
    setSessionToken("tok-test");
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole("button", { name: "Sign out" }).length).toBeGreaterThan(0);
  });
});
