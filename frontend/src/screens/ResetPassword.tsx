import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { brand } from "@/lib/brand";
import { apiFetch } from "@/lib/api";

const PRODUCT = "PMS23";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";

const INVALID_TOKEN_MESSAGE =
  "This reset link is invalid or has expired. Please request a new one.";

type Phase = "idle" | "loading" | "done";

// Password rules mirror the server's (backend/app/schemas.py
// PasswordResetConfirmRequest): checked client-side before submit so a
// violation is caught without a round trip, and the token is never
// displayed or logged either way.
function passwordRuleError(value: string): string {
  if (value.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
  if (!/\d/.test(value)) return "Password must contain at least one digit";
  return "";
}

export default function Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [error, setError] = React.useState("");
  const [tokenRejected, setTokenRejected] = React.useState(false);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTokenRejected(false);

    if (!token) {
      setTokenRejected(true);
      return;
    }

    const ruleError = passwordRuleError(password);
    if (ruleError) {
      setError(ruleError);
      return;
    }
    if (password !== confirm) {
      setError("Those two passwords do not match.");
      return;
    }

    setPhase("loading");
    try {
      // AC-009: token from the URL, never shown or logged.
      await apiFetch("/auth/password-reset/confirm", {
        method: "POST",
        body: JSON.stringify({ token, new_password: password }),
      });
      setPhase("done");
      navigate("/login", { replace: true });
    } catch {
      // AC-010/NFR-003: an expired, used or unknown token all land on the
      // same generic rejection -- never anything that discloses which.
      setTokenRejected(true);
      setPhase("idle");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
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
          Set a new password
        </p>

        {tokenRejected ? (
          <div className="mt-8 space-y-5">
            <p role="alert" className="text-sm leading-relaxed" style={{ color: brand.primaryColor }}>
              {INVALID_TOKEN_MESSAGE}
            </p>
            <Link
              to="/forgot-password"
              className="flex h-12 w-full items-center justify-center text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
              style={accentBtn}
            >
              Request a new link
            </Link>
            <Link
              to="/login"
              className="flex h-11 w-full items-center justify-center text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={quietBtn}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              Choose a new password for your PMS23 account.
            </p>
            {error ? (
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
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="rp-password" className="block text-xs uppercase" style={label}>
                New password
              </label>
              <input
                id="rp-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={error ? true : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 text-sm outline-none"
                style={field}
              />
              <p className="text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
                At least 8 characters, with an uppercase letter, a lowercase letter and a digit.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="rp-confirm" className="block text-xs uppercase" style={label}>
                Confirm new password
              </label>
              <input
                id="rp-confirm"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={error ? true : undefined}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3 text-sm outline-none"
                style={field}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={accentBtn}
            >
              {busy ? "Saving…" : "Set new password"}
            </button>
            <Link
              to="/login"
              className="flex h-11 w-full items-center justify-center text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={quietBtn}
            >
              Back to sign in
            </Link>
          </form>
        )}
      </main>
    </div>
  );
}
