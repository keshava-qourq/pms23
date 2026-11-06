import * as React from "react";
import { Link } from "react-router-dom";

import { brand } from "@/lib/brand";
import { apiFetch } from "@/lib/api";

const PRODUCT = "PMS23";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const RESET_WINDOW = "60 minutes";

type Phase = "idle" | "loading";

export default function Screen() {
  const [email, setEmail] = React.useState("");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);

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

  // AC-008: the same 202 and confirmation message is shown whether or not
  // the email is registered -- the request never reveals which.
  const submit = async (e: React.FormEvent) => {
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
      // Network or server errors still land on the same confirmation: no
      // enumeration signal either way.
    }
    setPhase("idle");
    setSent(true);
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
          {sent ? "Reset link sent" : "Reset password"}
        </p>

        {sent ? (
          <div className="mt-8 space-y-5">
            <p role="status" className="text-xl" style={{ fontFamily: brand.fontHeading }}>
              Check your inbox.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              If that address belongs to an active PMS23 account, a reset link is on its way. It
              expires in {RESET_WINDOW} and works once.
            </p>
            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
              style={accentBtn}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              Give us the email address on your PMS23 record and we will send a reset link that
              works for {RESET_WINDOW}.
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
              <label htmlFor="fp-email" className="block text-xs uppercase" style={label}>
                Work email
              </label>
              <input
                id="fp-email"
                name="email"
                type="email"
                autoComplete="username"
                aria-invalid={error ? true : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {busy ? "Sending link…" : "Email me a reset link"}
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
