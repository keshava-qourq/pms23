import * as React from "react";
import { useNavigate } from "react-router-dom";

import { brand } from "@/lib/brand";
import { apiFetch, setSessionToken } from "@/lib/api";
import { setSessionUser } from "./session";

const PRODUCT = "PMS23";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const RESET_WINDOW = "60 minutes";

type Role = "employee" | "manager" | "hr_admin" | "executive";

interface LoginUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: LoginUser;
  home_route: string;
}

// AC-001: where each role lands after sign-in.
const ROLE_HOME: Record<Role, string> = {
  employee: "/dashboard",
  manager: "/team",
  hr_admin: "/employees",
  executive: "/dashboard",
};

const GENERIC_LOGIN_ERROR =
  "We could not sign you in with those details. Check the email address and password, then try again.";

type View = "signin" | "reset" | "reset-sent";
type Phase = "idle" | "loading";

function ErrorAlert({ label, message }: { label: string; message: string }) {
  return (
    <p
      role="alert"
      className="px-3 py-3 text-sm leading-relaxed"
      style={{
        border: HAIRLINE,
        borderRadius: brand.radius,
        backgroundColor: "rgba(0,0,0,0.25)",
        color: brand.primaryColor,
      }}
    >
      <span
        className="mr-2 text-xs uppercase tracking-[0.18em]"
        style={{ color: brand.accentColor }}
      >
        {label}
      </span>
      {message}
    </p>
  );
}

export default function Screen() {
  const navigate = useNavigate();
  const [view, setView] = React.useState<View>("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [error, setError] = React.useState("");
  const [resetEmail, setResetEmail] = React.useState("");

  const field = {
    border: HAIRLINE,
    borderRadius: brand.radius,
    height: 46,
    backgroundColor: "rgba(0,0,0,0.25)",
    color: brand.primaryColor,
  };
  const label = { color: brand.neutralColor, letterSpacing: "0.18em" };
  const accentBtn = {
    backgroundColor: brand.accentColor,
    color: brand.backgroundColor,
    borderRadius: brand.radius,
  };
  const quietBtn = {
    border: HAIRLINE,
    borderRadius: brand.radius,
    color: brand.primaryColor,
    backgroundColor: "transparent",
  };
  const busy = phase === "loading";

  const goReset = () => {
    setError("");
    setView("reset");
  };

  const backToSignIn = () => {
    setError("");
    setPhase("idle");
    setPassword("");
    setView("signin");
  };

  // AC-001 / AC-002: real request lifecycle, no timers. A 401 renders one
  // generic message; the UI never says which field was wrong.
  const submitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter both your work email address and your password.");
      return;
    }
    setPhase("loading");
    try {
      const result = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setSessionToken(result.access_token);
      setSessionUser(result.user);
      const destination = ROLE_HOME[result.user.role] ?? result.home_route ?? "/dashboard";
      navigate(destination, { replace: true });
    } catch {
      setError(GENERIC_LOGIN_ERROR);
      setPhase("idle");
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter the work email address your PMS23 account uses.");
      return;
    }
    setPhase("loading");
    try {
      await apiFetch("/auth/password-reset/request", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
    } catch {
      // The request endpoint never reveals whether the address exists; show
      // the same confirmation either way.
    }
    setResetEmail(email.trim());
    setPhase("idle");
    setView("reset-sent");
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <style>{`
        .vl-focus:focus-visible { outline: none; box-shadow: 0 0 0 2px ${brand.backgroundColor}, 0 0 0 4px ${brand.accentColor}; }
        .vl-enter { animation: vlEnter 220ms ease-out both; }
        @keyframes vlEnter { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .vl-enter { animation: none; } }
      `}</style>
      <main
        className="w-full max-w-md p-10"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: HAIRLINE,
          borderRadius: brand.radius,
        }}
      >
        <h1 className="text-3xl" style={{ fontFamily: brand.fontHeading }}>
          {PRODUCT}
        </h1>
        <div
          aria-hidden
          className="mt-3 h-px w-12"
          style={{ backgroundColor: brand.accentColor }}
        />
        <p className="mt-3 text-xs uppercase" style={label}>
          {view === "signin" ? "Sign in" : view === "reset" ? "Reset password" : "Reset link sent"}
        </p>

        {view === "signin" ? (
          <form className="vl-enter mt-8 space-y-5" onSubmit={submitSignIn} noValidate>
            {error ? <ErrorAlert label="Denied" message={error} /> : null}
            <div className="space-y-2">
              <label htmlFor="vl-email" className="block text-xs uppercase" style={label}>
                Work email
              </label>
              <input
                id="vl-email"
                name="email"
                type="email"
                autoComplete="username"
                aria-invalid={error ? true : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-password" className="block text-xs uppercase" style={label}>
                Password
              </label>
              <input
                id="vl-password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={error ? true : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={accentBtn}
            >
              {phase === "loading" ? "Checking credentials…" : "Sign in"}
            </button>
            <p className="text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
              PMS23 shows only what your role permits: your own goals as an employee, your reporting
              line as a manager, the whole organisation as HR admin, read-only analytics as an
              executive.
            </p>
          </form>
        ) : view === "reset" ? (
          <form className="vl-enter mt-8 space-y-5" onSubmit={submitReset} noValidate>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              Give us the email address on your PMS23 record and we will send a reset link that
              works for {RESET_WINDOW}.
            </p>
            {error ? <ErrorAlert label="Check this" message={error} /> : null}
            <div className="space-y-2">
              <label htmlFor="vl-reset-email" className="block text-xs uppercase" style={label}>
                Work email
              </label>
              <input
                id="vl-reset-email"
                name="reset-email"
                type="email"
                autoComplete="username"
                aria-invalid={error ? true : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={accentBtn}
            >
              {phase === "loading" ? "Sending link…" : "Email me a reset link"}
            </button>
            <button
              type="button"
              onClick={backToSignIn}
              className="vl-focus h-11 w-full text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={quietBtn}
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <div className="vl-enter mt-8 space-y-5">
            <p role="status" className="text-xl" style={{ fontFamily: brand.fontHeading }}>
              Check your inbox.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
            >
              If {resetEmail || "that address"} belongs to an active PMS23 account, a reset link is
              on its way. It expires in {RESET_WINDOW} and works once.
            </p>
            <button
              type="button"
              onClick={backToSignIn}
              className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
              style={accentBtn}
            >
              Back to sign in
            </button>
          </div>
        )}

        <p className="mt-8 text-xs uppercase" style={label}>
          {view === "signin" ? (
            <React.Fragment>
              Forgotten your password?{" "}
              <button
                type="button"
                onClick={goReset}
                className="vl-focus underline underline-offset-4"
                style={{ color: brand.accentColor }}
              >
                Email me a reset link
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>No account? Records are created by your HR admin.</React.Fragment>
          )}
        </p>
      </main>
    </div>
  );
}
