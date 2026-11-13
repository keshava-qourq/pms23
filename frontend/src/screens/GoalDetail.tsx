import * as React from "react";

import { brand } from "@/lib/brand";
import { apiFetch } from "@/lib/api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Label,
  Select,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Empty,
} from "@/lib/ui";
import { getSessionUser } from "./session";

const HAIRLINE = "1px solid rgba(255,255,255,0.10)";

type ProgressType = "percent" | "status";

interface GoalRead {
  id: string;
  owner_id: string;
  created_by: string;
  parent_objective_id: string | null;
  title: string;
  description: string | null;
  target_metric: string;
  progress_type: ProgressType;
  progress_percent: number | null;
  status: string;
  check_in_interval_days: number | null;
  due_date: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ObjectiveRead {
  id: string;
  title: string;
  description: string | null;
  level: string;
  owner_id: string | null;
  created_at: string;
}

interface ReportRead {
  id: string;
  name: string;
  email: string;
  role: string;
  manager_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FormState {
  title: string;
  description: string;
  target_metric: string;
  due_date: string;
  progress_type: ProgressType;
  owner_id: string;
  parent_objective_id: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  target_metric: "",
  due_date: "",
  progress_type: "percent",
  owner_id: "",
  parent_objective_id: "",
};

type LoadState = "idle" | "loading" | "error";
type SaveState = "idle" | "saving" | "saved";

function statusOf(err: unknown): number | null {
  const message = err instanceof Error ? err.message : String(err);
  const match = /failed: (\d+)/.exec(message);
  return match ? Number(match[1]) : null;
}

function goalToForm(g: GoalRead): FormState {
  return {
    title: g.title,
    description: g.description ?? "",
    target_metric: g.target_metric,
    due_date: g.due_date,
    progress_type: g.progress_type,
    owner_id: g.owner_id ?? "",
    parent_objective_id: g.parent_objective_id ?? "",
  };
}

function blankFieldErrors(form: FormState): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "A goal needs a title before it can be saved.";
  if (!form.due_date) errs.due_date = "Give this goal a due date.";
  if (!form.target_metric.trim()) errs.target_metric = "Describe the target metric for this goal.";
  return errs;
}

export default function Screen() {
  const currentUser = React.useMemo(() => getSessionUser(), []);
  const isManager = currentUser?.role === "manager";

  const field = {
    border: HAIRLINE,
    borderRadius: brand.radius,
    backgroundColor: "rgba(0,0,0,0.25)",
    color: brand.primaryColor,
  };
  const label = { color: brand.neutralColor, letterSpacing: "0.16em" };
  const panel = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: HAIRLINE,
    borderRadius: brand.radius,
  };

  const [goals, setGoals] = React.useState<GoalRead[] | null>(null);
  const [goalsState, setGoalsState] = React.useState<LoadState>("idle");
  const [goalsError, setGoalsError] = React.useState("");

  const [objectives, setObjectives] = React.useState<ObjectiveRead[]>([]);
  const [reports, setReports] = React.useState<ReportRead[]>([]);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [savedGoal, setSavedGoal] = React.useState<GoalRead | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState("");
  const [forbidden, setForbidden] = React.useState(false);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");

  const loadGoals = React.useCallback(async () => {
    setGoalsState("loading");
    setGoalsError("");
    try {
      const rows = await apiFetch<GoalRead[]>("/goals");
      setGoals(rows);
      setGoalsState("idle");
    } catch {
      setGoals(null);
      setGoalsState("error");
      setGoalsError("Goals could not be loaded. Try again.");
    }
  }, []);

  React.useEffect(() => {
    loadGoals();
    apiFetch<ObjectiveRead[]>("/objectives")
      .then(setObjectives)
      .catch(() => setObjectives([]));
    if (isManager && currentUser) {
      apiFetch<ReportRead[]>(`/employees/${currentUser.id}/reports`)
        .then(setReports)
        .catch(() => setReports([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
    setSaveState("idle");
  };

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSavedGoal(null);
    setErrors({});
    setFormError("");
    setForbidden(false);
    setSaveState("idle");
  };

  const selectGoal = (g: GoalRead) => {
    setEditingId(g.id);
    setForm(goalToForm(g));
    setSavedGoal(g);
    setErrors({});
    setFormError("");
    setForbidden(false);
    setSaveState("idle");
  };

  const ownerName = (id: string): string => {
    if (currentUser && id === currentUser.id) return currentUser.name;
    const report = reports.find((r) => r.id === id);
    return report ? report.name : id;
  };

  const parentObjectiveTitle = (id: string | null): string => {
    if (!id) return "No parent objective";
    const objective = objectives.find((o) => o.id === id);
    return objective ? objective.title : "No parent objective";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "A goal needs a title before it can be saved.";
    if (!form.due_date) next.due_date = "Give this goal a due date.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSaveState("saving");

    if (editingId) {
      try {
        const updated = await apiFetch<GoalRead>(`/goals/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim() || null,
            target_metric: form.target_metric.trim(),
            due_date: form.due_date,
            parent_objective_id: form.parent_objective_id || null,
          }),
        });
        setGoals((prev) => (prev ? prev.map((g) => (g.id === updated.id ? updated : g)) : prev));
        setSavedGoal(updated);
        setForm(goalToForm(updated));
        setSaveState("saved");
      } catch (err) {
        const status = statusOf(err);
        if (status === 403) {
          setForbidden(true);
        } else if (status === 422) {
          setErrors(blankFieldErrors(form));
        } else {
          setFormError("This goal could not be saved. Try again.");
        }
        setSaveState("idle");
      }
      return;
    }

    try {
      const created = await apiFetch<GoalRead>("/goals", {
        method: "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          target_metric: form.target_metric.trim(),
          due_date: form.due_date,
          progress_type: form.progress_type,
          owner_id: form.owner_id || null,
          parent_objective_id: form.parent_objective_id || null,
        }),
      });
      setGoals((prev) => [created, ...(prev ?? [])]);
      setEditingId(created.id);
      setSavedGoal(created);
      setForm(goalToForm(created));
      setSaveState("saved");
    } catch (err) {
      const status = statusOf(err);
      if (status === 403) {
        // AC-024: no optimistic goal row was ever added, since `goals` is
        // only updated after a successful response.
        setForbidden(true);
      } else if (status === 422) {
        setErrors(blankFieldErrors(form));
      } else {
        setFormError("This goal could not be saved. Try again.");
      }
      setSaveState("idle");
    }
  };

  return (
    <div
      className="min-h-full px-6 py-10 lg:px-10"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
      }}
    >
      <div className="mx-auto w-full max-w-[1100px] space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase" style={label}>
              Goals
            </p>
            <h1 className="mt-2 text-3xl" style={{ fontFamily: brand.fontHeading }}>
              {editingId ? "Edit goal" : "New goal"}
            </h1>
          </div>
          <Button type="button" variant="secondary" onClick={startNew}>
            New goal
          </Button>
        </header>

        {forbidden ? (
          <Card style={panel}>
            <CardContent>
              <Empty
                title="Not permitted"
                description="You are not permitted to create or update this goal. Choose an owner within your reporting line."
              />
            </CardContent>
          </Card>
        ) : null}

        <Card style={panel}>
          <CardHeader>
            <CardTitle style={{ color: brand.primaryColor, fontFamily: brand.fontHeading }}>
              {editingId ? "Goal details" : "Create a SMART goal"}
            </CardTitle>
            <CardDescription style={{ color: brand.neutralColor }}>
              Title, target metric and due date are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={submit} noValidate>
              <div>
                <Label htmlFor="goal-title" style={label} className="block text-xs uppercase">
                  Title
                </Label>
                <Input
                  id="goal-title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                />
                {errors.title ? (
                  <p role="alert" className="mt-2 text-sm" style={{ color: "#cf8171" }}>
                    {errors.title}
                  </p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="goal-description" style={label} className="block text-xs uppercase">
                  Description
                </Label>
                <Textarea
                  id="goal-description"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                />
              </div>

              <div>
                <Label
                  htmlFor="goal-target-metric"
                  style={label}
                  className="block text-xs uppercase"
                >
                  Target metric
                </Label>
                <Input
                  id="goal-target-metric"
                  value={form.target_metric}
                  onChange={(e) => update("target_metric", e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                />
                {errors.target_metric ? (
                  <p role="alert" className="mt-2 text-sm" style={{ color: "#cf8171" }}>
                    {errors.target_metric}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="goal-due-date" style={label} className="block text-xs uppercase">
                    Due date
                  </Label>
                  <Input
                    id="goal-due-date"
                    type="date"
                    value={form.due_date}
                    onChange={(e) => update("due_date", e.target.value)}
                    className="mt-2 w-full px-3 py-2"
                    style={field}
                  />
                  {errors.due_date ? (
                    <p role="alert" className="mt-2 text-sm" style={{ color: "#cf8171" }}>
                      {errors.due_date}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label
                    htmlFor="goal-progress-type"
                    style={label}
                    className="block text-xs uppercase"
                  >
                    Progress type
                  </Label>
                  <Select
                    id="goal-progress-type"
                    value={form.progress_type}
                    disabled={!!editingId}
                    onChange={(e) => update("progress_type", e.target.value)}
                    className="mt-2 w-full px-3 py-2"
                    style={field}
                    options={[
                      { value: "percent", label: "Percent" },
                      { value: "status", label: "Status" },
                    ]}
                  />
                </div>
              </div>

              {isManager ? (
                <div>
                  <Label htmlFor="goal-owner" style={label} className="block text-xs uppercase">
                    Owner
                  </Label>
                  <Select
                    id="goal-owner"
                    value={form.owner_id}
                    onChange={(e) => update("owner_id", e.target.value)}
                    className="mt-2 w-full px-3 py-2"
                    style={field}
                    options={[
                      { value: "", label: "Select a direct report" },
                      ...reports.map((r) => ({ value: r.id, label: r.name })),
                    ]}
                  />
                </div>
              ) : null}

              <div>
                <Label
                  htmlFor="goal-parent-objective"
                  style={label}
                  className="block text-xs uppercase"
                >
                  Parent objective
                </Label>
                <Select
                  id="goal-parent-objective"
                  value={form.parent_objective_id}
                  onChange={(e) => update("parent_objective_id", e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                  options={[
                    { value: "", label: "No parent objective" },
                    ...objectives.map((o) => ({ value: o.id, label: o.title })),
                  ]}
                />
              </div>

              {formError ? (
                <p role="alert" className="text-sm" style={{ color: "#cf8171" }}>
                  {formError}
                </p>
              ) : null}

              <Button type="submit" disabled={saveState === "saving"}>
                {saveState === "saving" ? "Saving…" : editingId ? "Save changes" : "Create goal"}
              </Button>
            </form>

            {savedGoal ? (
              <div className="mt-8" style={{ borderTop: HAIRLINE, paddingTop: 16 }}>
                <p role="status" className="text-sm" style={{ color: brand.accentColor }}>
                  Saved — {savedGoal.title}
                </p>
                <dl className="mt-3 grid gap-2 text-sm" style={{ color: brand.neutralColor }}>
                  <div>
                    <dt className="inline font-medium" style={{ color: brand.primaryColor }}>
                      Owner:{" "}
                    </dt>
                    <dd className="inline">{ownerName(savedGoal.owner_id)}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium" style={{ color: brand.primaryColor }}>
                      Due:{" "}
                    </dt>
                    <dd className="inline">{savedGoal.due_date}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium" style={{ color: brand.primaryColor }}>
                      Parent objective:{" "}
                    </dt>
                    <dd className="inline">
                      {parentObjectiveTitle(savedGoal.parent_objective_id)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card style={panel}>
          <CardHeader>
            <CardTitle style={{ color: brand.primaryColor, fontFamily: brand.fontHeading }}>
              Your goals
            </CardTitle>
            <CardDescription style={{ color: brand.neutralColor }}>
              Select a goal below to edit it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {goalsState === "error" && goalsError ? (
              <p role="alert" className="mb-4 text-sm" style={{ color: "#cf8171" }}>
                {goalsError}
              </p>
            ) : null}

            {goalsState === "loading" && !goals ? (
              <p className="text-sm" style={{ color: brand.neutralColor }}>
                Loading goals…
              </p>
            ) : goals && goals.length > 0 ? (
              <Table>
                <THead>
                  <TR>
                    <TH>Title</TH>
                    <TH>Due date</TH>
                    <TH>Status</TH>
                    <TH>Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {goals.map((g) => (
                    <TR key={g.id}>
                      <TD>{g.title}</TD>
                      <TD>{g.due_date}</TD>
                      <TD>{g.status}</TD>
                      <TD>
                        <Button type="button" variant="secondary" onClick={() => selectGoal(g)}>
                          Edit
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            ) : goals && goals.length === 0 ? (
              <Empty title="No goals yet" description="Create your first goal above." />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
