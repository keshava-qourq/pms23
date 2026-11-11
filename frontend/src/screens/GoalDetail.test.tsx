import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import GoalDetail from "./GoalDetail";

const SESSION_USER_KEY = "session_user";

function setSessionUser(user: { id: string; name: string; email: string; role: string }) {
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
}

function goal(overrides: Record<string, unknown> = {}) {
  return {
    id: "goal-1",
    owner_id: "u-self",
    created_by: "u-self",
    parent_objective_id: null,
    title: "Cut response time",
    description: "Reduce time to first response.",
    target_metric: "Median under 2h",
    progress_type: "percent",
    progress_percent: 0,
    status: "Not started",
    check_in_interval_days: null,
    due_date: "2026-12-31",
    completed_at: null,
    created_at: "2026-11-01T00:00:00",
    updated_at: "2026-11-01T00:00:00",
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("GoalDetail screen", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("[AC-020] submits title, description, target_metric, due_date and progress_type to POST /goals and shows the saved goal on 201", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    const created = goal();
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(jsonResponse(created, 201));
      if (url.includes("/goals")) return Promise.resolve(jsonResponse([]));
      return Promise.resolve(jsonResponse([]));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^title$/i), "Cut response time");
    await user.type(screen.getByLabelText(/target metric/i), "Median under 2h");
    await user.type(screen.getByLabelText(/due date/i), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /create goal/i }));

    await waitFor(() => {
      const call = fetchMock.mock.calls.find((c) => (c[1] as RequestInit)?.method === "POST");
      expect(call).toBeTruthy();
      const body = JSON.parse((call![1] as RequestInit).body as string);
      expect(body).toMatchObject({
        title: "Cut response time",
        target_metric: "Median under 2h",
        due_date: "2026-12-31",
        progress_type: "percent",
      });
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Cut response time");
  });

  it("[AC-021] blocks submission with title or due date empty and names the missing field", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/target metric/i), "Something measurable");
    await user.type(screen.getByLabelText(/due date/i), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /create goal/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/title/i);
    const postCalls = fetchMock.mock.calls.filter((c) => (c[1] as RequestInit)?.method === "POST");
    expect(postCalls.length).toBe(0);
  });

  it("[AC-021] surfaces a 422 from the API against the matching field", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(new Response(null, { status: 422 }));
      return Promise.resolve(jsonResponse([]));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^title$/i), "Cut response time");
    await user.type(screen.getByLabelText(/due date/i), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /create goal/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/target metric/i);
  });

  it("[AC-022] opening an existing goal loads it from GET /goals and saving edits calls PUT /goals/{id}", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    const existing = goal({ title: "Original title" });
    const updated = { ...existing, title: "Updated title" };
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "PUT") return Promise.resolve(jsonResponse(updated, 200));
      if (url.endsWith("/goals")) return Promise.resolve(jsonResponse([existing]));
      return Promise.resolve(jsonResponse([]));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    await screen.findByText("Original title");

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^edit$/i }));

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    await waitFor(() => expect(titleInput).toHaveValue("Original title"));
    await user.clear(titleInput);
    await user.type(titleInput, "Updated title");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      const call = fetchMock.mock.calls.find((c) => (c[1] as RequestInit)?.method === "PUT");
      expect(call).toBeTruthy();
      expect(call![0]).toContain(`/goals/${existing.id}`);
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Updated title");
  });

  it("[AC-023] a manager can pick an owner from GET /employees/{id}/reports and the goal shows that person as owner", async () => {
    setSessionUser({ id: "u-mgr", name: "Dilan Okonkwo", email: "d@x.com", role: "manager" });
    const report = { id: "u-rep", name: "Ade Balogun", email: "a@x.com", role: "employee", manager_id: "u-mgr", is_active: true, created_at: "x", updated_at: "x" };
    const created = goal({ owner_id: "u-rep" });
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(jsonResponse(created, 201));
      if (url.includes("/reports")) return Promise.resolve(jsonResponse([report]));
      return Promise.resolve(jsonResponse([]));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    const user = userEvent.setup();

    await screen.findByLabelText(/^owner$/i);
    await user.selectOptions(screen.getByLabelText(/^owner$/i), "u-rep");
    await user.type(screen.getByLabelText(/^title$/i), "Cut response time");
    await user.type(screen.getByLabelText(/target metric/i), "Median under 2h");
    await user.type(screen.getByLabelText(/due date/i), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /create goal/i }));

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Cut response time");
    expect(status.closest("div")).toHaveTextContent("Ade Balogun");
  });

  it("[AC-023] employees see no owner picker", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));

    render(<GoalDetail />);
    await screen.findByText(/no goals yet/i);

    expect(screen.queryByLabelText(/^owner$/i)).not.toBeInTheDocument();
  });

  it("[AC-024] a 403 from POST /goals renders a not-permitted message and keeps no optimistic goal row", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(new Response(null, { status: 403 }));
      return Promise.resolve(jsonResponse([]));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^title$/i), "Cut response time");
    await user.type(screen.getByLabelText(/target metric/i), "Median under 2h");
    await user.type(screen.getByLabelText(/due date/i), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /create goal/i }));

    expect(await screen.findByText("Not permitted")).toBeInTheDocument();
    expect(screen.queryByText(/^Saved/)).not.toBeInTheDocument();
    await screen.findByText(/no goals yet/i);
  });

  it("[AC-025/AC-026] the parent objective select is populated from GET /objectives and the linked parent is displayed on save", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    const objective = { id: "obj-1", title: "Grow retention", description: null, level: "Company", owner_id: null, created_at: "x" };
    const created = goal({ parent_objective_id: "obj-1" });
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(jsonResponse(created, 201));
      if (url.includes("/objectives")) return Promise.resolve(jsonResponse([objective]));
      return Promise.resolve(jsonResponse([]));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    const user = userEvent.setup();

    await screen.findByText("Grow retention");
    await user.selectOptions(screen.getByLabelText(/parent objective/i), "obj-1");
    await user.type(screen.getByLabelText(/^title$/i), "Cut response time");
    await user.type(screen.getByLabelText(/target metric/i), "Median under 2h");
    await user.type(screen.getByLabelText(/due date/i), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /create goal/i }));

    const status = await screen.findByRole("status");
    expect(status.closest("div")).toHaveTextContent("Parent objective: Grow retention");
  });

  it("[AC-025/AC-026] leaving the parent objective as 'No parent objective' saves a valid standalone goal", async () => {
    setSessionUser({ id: "u-self", name: "Priya Raghunathan", email: "p@x.com", role: "employee" });
    const created = goal({ parent_objective_id: null });
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(jsonResponse(created, 201));
      return Promise.resolve(jsonResponse([]));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<GoalDetail />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^title$/i), "Cut response time");
    await user.type(screen.getByLabelText(/target metric/i), "Median under 2h");
    await user.type(screen.getByLabelText(/due date/i), "2026-12-31");
    await user.click(screen.getByRole("button", { name: /create goal/i }));

    await waitFor(() => {
      const call = fetchMock.mock.calls.find((c) => (c[1] as RequestInit)?.method === "POST");
      const body = JSON.parse((call![1] as RequestInit).body as string);
      expect(body.parent_objective_id).toBeNull();
    });
    const status = await screen.findByRole("status");
    expect(status.closest("div")).toHaveTextContent("Parent objective: No parent objective");
  });
});
