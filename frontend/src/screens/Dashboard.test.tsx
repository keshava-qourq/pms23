import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import Dashboard from "./Dashboard";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function notification(overrides: Record<string, unknown> = {}) {
  return {
    id: "notif-1",
    user_id: "u-self",
    type: "due_soon",
    message: "“Cut onboarding drop-off from 34% to 20%” is due in 9 days.",
    is_read: false,
    email_status: "sent",
    created_at: "2026-11-05T08:40:00",
    ...overrides,
  };
}

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Dashboard />
    </MemoryRouter>,
  );
}

describe("Dashboard reminders panel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-034] shows a loading state while GET /notifications is in flight", async () => {
    let resolveFetch: (value: Response) => void = () => {};
    const pending = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() => pending),
    );

    renderDashboard();

    expect(screen.getAllByText(/loading your reminders/i).length).toBeGreaterThan(0);

    resolveFetch(jsonResponse([]));
    await screen.findByText("No reminders right now");
  });

  it("[AC-034] lists an unread reminder and lets me dismiss it, calling PATCH /notifications/{id}/read", async () => {
    const unread = notification();
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "PATCH") {
        expect(url).toContain(`/notifications/${unread.id}/read`);
        return Promise.resolve(jsonResponse({ ...unread, is_read: true }));
      }
      return Promise.resolve(jsonResponse([unread]));
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDashboard();

    const message = await screen.findByText(unread.message as string);
    expect(message).toBeInTheDocument();
    expect(screen.getByText("Unread")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: `Dismiss reminder ${unread.id}` }));

    await waitFor(() => {
      const patchCall = fetchMock.mock.calls.find((c) => (c[1] as RequestInit)?.method === "PATCH");
      expect(patchCall).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.queryByText(unread.message as string)).not.toBeInTheDocument();
    });
  });

  it("[AC-034] shows the empty-reminders message when GET /notifications returns none", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));

    renderDashboard();

    expect(await screen.findByText("No reminders right now")).toBeInTheDocument();
    expect(
      screen.getByText(
        "When a due date comes close or a check-in slips past its cadence, the reminder appears here.",
      ),
    ).toBeInTheDocument();
  });

  it("[AC-034] shows an error state when GET /notifications fails and retries on request", async () => {
    const unread = notification();
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(null, { status: 500 }));
    fetchMock.mockResolvedValueOnce(jsonResponse([unread]));
    vi.stubGlobal("fetch", fetchMock);

    renderDashboard();

    const alert = await screen.findByText(/couldn.t load your reminders/i);
    expect(alert).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText(unread.message as string)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("[AC-034] surfaces an inline error and keeps the reminder when the dismiss call fails", async () => {
    const unread = notification();
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "PATCH") return Promise.resolve(new Response(null, { status: 500 }));
      return Promise.resolve(jsonResponse([unread]));
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDashboard();
    await screen.findByText(unread.message as string);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: `Dismiss reminder ${unread.id}` }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn.t dismiss that reminder/i);
    expect(screen.getByText(unread.message as string)).toBeInTheDocument();
  });
});
