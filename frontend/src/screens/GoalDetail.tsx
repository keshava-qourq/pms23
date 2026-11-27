// Hand-written: the generated design mockup rendered sample data only and
// never reached the API. This wires goal creation, editing, the parent
// objective and (for managers) owner pickers to the real endpoints per
// AC-020 through AC-026.
import * as React from "react";

import { apiFetch } from "@/lib/api";
import { getSessionUser } from "./session";

interface ObjectiveSummary {
  id: string;
  title: string;
}

interface EmployeeSummary {
  id: string;
  name: string;
}

interface Goal {
  id: string;
  owner_id: string;
  created_by: string;
  parent_objective_id: string | null;
  title: string;
  description?: string | null;
  target_metric?: string | null;
  progress_type: string;
  progress_percent?: number | null;
  status?: string;
  check_in_interval_days?: number | null;
  due_date: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface FormState {
  title: string;
  description: string;
  target_metric: string;
  due_date: string;
  owner_id: string;
  parent_objective_id: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  target_metric: "",
  due_date: "",
  owner_id: "",
  parent_objective_id: "",
};

interface Confirmation {
  title: string;
  ownerName: string;
  parentName: string;
}

// apiFetch throws `Error("${method} ${path} failed: ${status}")` on a
// non-2xx response; this pulls the status back out so a 403 can be told
// apart from a 422 without touching api.ts.
function statusFromError(err: unknown): string {
  const message = err instanceof Error ? err.message : "";
  const match = message.match(/(\d{3})\s*$/);
  return match ? match[1] : "";
}

export default function Screen() {
  const user = getSessionUser();
  const isManager = user?.role === "manager";

  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [goalsLoaded, setGoalsLoaded] = React.useState(false);
  const [objectives, setObjectives] = React.useState<ObjectiveSummary[]>([]);
  const [reports, setReports] = React.useState<EmployeeSummary[]>([]);
  // For an employee this never gates anything (the owner picker is manager-only);
  // for a manager it starts false so the picker never renders with half its
  // options missing — findByLabelText("owner") only resolves once this is true.
  const [reportsLoaded, setReportsLoaded] = React.useState(!isManager);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [fieldError, setFieldError] = React.useState("");
  const [permissionError, setPermissionError] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<Confirmation | null>(null);

  React.useEffect(() => {
    let alive = true;

    apiFetch<Goal[]>("/goals")
      .then((data) => {
        if (alive) setGoals(data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setGoalsLoaded(true);
      });

    apiFetch<ObjectiveSummary[]>("/objectives")
      .then((data) => {
        if (alive) setObjectives(data);
      })
      .catch(() => {});

    if (isManager && user) {
      apiFetch<EmployeeSummary[]>(`/employees/${user.id}/reports`)
        .then((data) => {
          if (alive) setReports(data);
        })
        .catch(() => {})
        .finally(() => {
          if (alive) setReportsLoaded(true);
        });
    }

    return () => {
      alive = false;
    };
    // Run once on mount: re-fetching on every render would race the user's
    // own edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ownerName = (ownerId: string): string => {
    if (user && ownerId === user.id) return user.name;
    const report = reports.find((r) => r.id === ownerId);
    return report ? report.name : "Unassigned";
  };

  const parentName = (parentId: string | null | undefined): string => {
    if (!parentId) return "No parent objective";
    const objective = objectives.find((o) => o.id === parentId);
    return objective ? objective.title : "No parent objective";
  };

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldError("");
    setPermissionError(false);
  };

  const startEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      description: goal.description ?? "",
      target_metric: goal.target_metric ?? "",
      due_date: goal.due_date,
      owner_id: goal.owner_id,
      parent_objective_id: goal.parent_objective_id ?? "",
    });
    setFieldError("");
    setPermissionError(false);
    setConfirmation(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFieldError("");
    setPermissionError(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPermissionError(false);
    setConfirmation(null);

    // AC-021: title and due date are required before anything is sent.
    if (!form.title.trim()) {
      setFieldError("Give this goal a title before it can be saved.");
      return;
    }
    if (!form.due_date) {
      setFieldError("Give this goal a due date before it can be saved.");
      return;
    }
    setFieldError("");
    setSaving(true);

    try {
      if (editingId) {
        const updated = await apiFetch<Goal>(`/goals/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim() || null,
            target_metric: form.target_metric.trim() || null,
            due_date: form.due_date,
            parent_objective_id: form.parent_objective_id || null,
          }),
        });
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        setConfirmation({
          title: updated.title,
          ownerName: ownerName(updated.owner_id),
          parentName: parentName(updated.parent_objective_id),
        });
        setEditingId(null);
        setForm(EMPTY_FORM);
      } else {
        const created = await apiFetch<Goal>("/goals", {
          method: "POST",
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim() || null,
            target_metric: form.target_metric.trim() || null,
            due_date: form.due_date,
            progress_type: "percent",
            owner_id: form.owner_id || undefined,
            parent_objective_id: form.parent_objective_id || null,
          }),
        });
        setGoals((prev) => [created, ...prev]);
        setConfirmation({
          title: created.title,
          ownerName: ownerName(created.owner_id),
          parentName: parentName(created.parent_objective_id),
        });
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      const statusCode = statusFromError(err);
      if (statusCode === "403") {
        // AC-024: a denied create keeps no optimistic row and names no field.
        setPermissionError(true);
      } else if (!form.target_metric.trim()) {
        // AC-021: a 422 the client could not have predicted from title/due
        // date alone — the one required field it did not check client-side.
        setFieldError("Give this goal a target metric before it can be saved.");
      } else {
        setFieldError("Something went wrong saving this goal. Try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "block text-xs font-medium uppercase tracking-wide text-neutral-400";
  const fieldClass =
    "mt-1 w-full rounded border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm text-neutral-100";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-neutral-100">
      <h1 className="text-2xl font-semibold">Goals</h1>

      <section className="mt-6" aria-label="Your goals">
        {goalsLoaded && goals.length === 0 ? (
          <p className="text-sm text-neutral-400">No goals yet. Create one below.</p>
        ) : null}
        {goals.length > 0 ? (
          <ul className="space-y-2">
            {goals.map((g) => (
              <li
                key={g.id}
                className="flex items-center justify-between gap-4 border-b border-neutral-700 pb-2"
              >
                <span>{g.title}</span>
                <button
                  type="button"
                  onClick={() => startEdit(g)}
                  className="rounded border border-neutral-600 px-3 py-1 text-sm"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
        {permissionError ? <p>Not permitted</p> : null}
        {fieldError ? (
          <p role="alert" className="text-sm text-red-400">
            {fieldError}
          </p>
        ) : null}

        <div>
          <label htmlFor="goal-title" className={labelClass}>
            Title
          </label>
          <input
            id="goal-title"
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="goal-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="goal-description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="goal-target-metric" className={labelClass}>
            Target metric
          </label>
          <input
            id="goal-target-metric"
            type="text"
            value={form.target_metric}
            onChange={(e) => update("target_metric", e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="goal-due-date" className={labelClass}>
            Due date
          </label>
          <input
            id="goal-due-date"
            type="text"
            placeholder="YYYY-MM-DD"
            value={form.due_date}
            onChange={(e) => update("due_date", e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="goal-parent-objective" className={labelClass}>
            Parent objective (optional)
          </label>
          <select
            id="goal-parent-objective"
            value={form.parent_objective_id}
            onChange={(e) => update("parent_objective_id", e.target.value)}
            className={fieldClass}
          >
            <option value="">No parent objective</option>
            {objectives.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </select>
        </div>

        {isManager && reportsLoaded ? (
          <div>
            <label htmlFor="goal-owner" className={labelClass}>
              Owner
            </label>
            <select
              id="goal-owner"
              value={form.owner_id}
              onChange={(e) => update("owner_id", e.target.value)}
              className={fieldClass}
            >
              <option value="">Myself</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {editingId ? "Save changes" : "Create goal"}
          </button>
          {editingId ? (
            <button type="button" onClick={cancelEdit} className="text-sm text-neutral-400">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {confirmation ? (
        <div className="mt-6 rounded border border-emerald-600 p-4">
          <p role="status">Saved {confirmation.title}</p>
          <p>Owner: {confirmation.ownerName}</p>
          <p>Parent objective: {confirmation.parentName}</p>
        </div>
      ) : null}
    </div>
  );
}
