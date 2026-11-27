import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import Team from "./Team";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function goal(overrides: Record<string, unknown> = {}) {
  return {
    id: "goal-1",
    title: "Cut p95 checkout API latency to 180 ms",
    progress_type: "percent",
    progress_percent: 72,
    status: "In progress",
    due_date: "2026-12-19",
    ...overrides,
  };
}

function report(overrides: Record<string, unknown> = {}) {
  return {
    id: "report-1",
    name: "Marcus Ilyin",
    email: "marcus.ilyin@northgate.io",
    goals: [goal()],
    ...overrides,
  };
}

describe("Team screen", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-038] shows a loading state while GET /dashboard/team is in flight", async () => {
    let resolveFetch: (value: Response) => void = () => {};
    const pending = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() => pending),
    );

    render(<Team />);

    expect(screen.getByText(/loading your team/i)).toBeInTheDocument();

    resolveFetch(jsonResponse({ reports: [] }));
    await screen.findByText("No direct reports yet");
  });

  it("[AC-038] lists each direct report's goals and progress on success", async () => {
    const r = report();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ reports: [r] })));

    render(<Team />);

    expect(await screen.findByText(r.name)).toBeInTheDocument();
    expect(screen.getByText(r.email)).toBeInTheDocument();
    expect(screen.getByText(r.goals[0].title)).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("Due 19 Dec 2026")).toBeInTheDocument();
  });

  it("[AC-038] shows an empty-goals message for a report with none", async () => {
    const r = report({ goals: [] });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ reports: [r] })));

    render(<Team />);

    expect(await screen.findByText(r.name)).toBeInTheDocument();
    expect(screen.getByText("No goals yet")).toBeInTheDocument();
    expect(screen.getByText(`${r.name} has no goals assigned yet.`)).toBeInTheDocument();
  });

  it("[AC-038] shows the no-direct-reports message when the team is empty", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ reports: [] })));

    render(<Team />);

    expect(await screen.findByText("No direct reports yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Employees HR assigns to you will appear here with their goals and progress.",
      ),
    ).toBeInTheDocument();
  });

  it("[AC-038] shows an error state when GET /dashboard/team fails and retries on request", async () => {
    const r = report();
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(null, { status: 500 }));
    fetchMock.mockResolvedValueOnce(jsonResponse({ reports: [r] }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Team />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/couldn.t load your team/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText(r.name)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("[AC-039] shows an access-denied message when GET /dashboard/team returns 403", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 403 })));

    render(<Team />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "You cannot view the goals of an employee outside your reporting line.",
    );
  });
});
