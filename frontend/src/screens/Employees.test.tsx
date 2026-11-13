import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import Employees from "./Employees";

function exportPayload(overrides: Record<string, unknown> = {}) {
  return {
    employee: {
      id: "emp-1",
      name: "Rory Kavanagh",
      email: "rory.kavanagh@northgate.co",
      role: "employee",
      manager_id: "emp-9",
      is_active: true,
      anonymised_at: null,
      created_at: "2024-01-12",
      ...overrides,
    },
    goals: [],
    check_ins: [],
    praise_received: [],
    audit: [],
  };
}

describe("Employees screen", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-017] an Export action calls GET /employees/{id}/export and downloads the returned file", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(exportPayload()), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(<Employees />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/employee id/i), "emp-1");
    await user.click(screen.getByRole("button", { name: /^export$/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/employees/emp-1/export"),
        expect.anything(),
      ),
    );
    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    expect(await screen.findByRole("status")).toHaveTextContent("employee-emp-1.json");
  });

  it("[AC-017] a 404 export shows an error instead of downloading", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/employee id/i), "unknown-id");
    await user.click(screen.getByRole("button", { name: /^export$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/no employee found/i);
  });

  it("[AC-018] delete personal data requires a typed reason before it will submit", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(exportPayload()), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/employee id/i), "emp-1");
    await user.click(screen.getByRole("button", { name: /^load$/i }));
    await screen.findByText("Rory Kavanagh");

    await user.click(screen.getByRole("checkbox", { name: /i confirm this deletion/i }));
    await user.click(screen.getByRole("button", { name: /delete personal data/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/type a reason/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("[AC-018] on 204 refreshes the row to show the anonymised state", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(exportPayload()), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            exportPayload({
              name: "Anonymised employee",
              email: null,
              anonymised_at: "2026-11-05",
              is_active: false,
            }),
          ),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/employee id/i), "emp-1");
    await user.click(screen.getByRole("button", { name: /^load$/i }));
    await screen.findByText("Rory Kavanagh");

    await user.type(screen.getByLabelText(/reason/i), "Approved subject access request");
    await user.click(screen.getByRole("checkbox", { name: /i confirm this deletion/i }));
    await user.click(screen.getByRole("button", { name: /delete personal data/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/employees/emp-1/personal-data"),
        expect.objectContaining({ method: "DELETE" }),
      ),
    );
    expect(await screen.findByText("Anonymised employee")).toBeInTheDocument();
    expect(await screen.findByText("Anonymised")).toBeInTheDocument();
  });

  it("[AC-019] applying filters calls GET /audit-log with entity and date-range query params, newest first", async () => {
    const rows = [
      {
        id: "a-2",
        actor_id: "u-1",
        actor_name: "Priya Raghunathan",
        entity_type: "employee",
        entity_id: "emp-1",
        action: "employee.update",
        changes: { email: ["old@x.com", "new@x.com"] },
        created_at: "2026-11-05T09:12:00",
      },
      {
        id: "a-1",
        actor_id: "u-1",
        actor_name: "Priya Raghunathan",
        entity_type: "employee",
        entity_id: "emp-1",
        action: "employee.create",
        changes: null,
        created_at: "2026-11-01T09:12:00",
      },
    ];
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(rows), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^entity$/i), "employee");
    await user.type(screen.getByLabelText(/^from$/i), "2026-11-01");
    await user.type(screen.getByLabelText(/^to$/i), "2026-11-05");
    await user.click(screen.getByRole("button", { name: /apply filters/i }));

    await waitFor(() => {
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain("/audit-log");
      expect(url).toContain("entity=employee");
      expect(url).toContain("from=2026-11-01");
      expect(url).toContain("to=2026-11-05");
    });

    const tableRows = await screen.findAllByRole("row");
    expect(tableRows[1]).toHaveTextContent("employee.update");
    expect(tableRows[2]).toHaveTextContent("employee.create");
    expect(screen.getAllByText("Priya Raghunathan").length).toBeGreaterThan(0);
  });

  it("[AC-019] an empty result renders an empty state", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /apply filters/i }));

    expect(await screen.findByText(/no audit entries/i)).toBeInTheDocument();
  });

  it("[AC-019] an error loading the audit trail renders an error state", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /apply filters/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be loaded/i);
  });

  it("a 403 from any action shows an access-denied message instead of the actions", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/employee id/i), "emp-1");
    await user.click(screen.getByRole("button", { name: /^load$/i }));

    expect(await screen.findByText(/access denied/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^export$/i })).not.toBeInTheDocument();
  });

  it("the screen starts with no employee loaded and an empty audit trail, not seeded data", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<Employees />);

    expect(screen.getByText(/no employee loaded/i)).toBeInTheDocument();
    expect(screen.getByText(/no audit entries loaded/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
