// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check } = Icons;

const PRODUCT = "PMS23";
const SCREEN = "Sign in";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";

const ACCOUNTS = [
  {
    email: "nadia.okonkwo@pms23.internal",
    password: "Quarterly!2026",
    name: "Nadia Okonkwo",
    role: "Employee",
    team: "Customer Operations",
    route: "dashboard",
    home: "Open my goals dashboard",
  },
  {
    email: "tomas.halvorsen@pms23.internal",
    password: "Quarterly!2026",
    name: "Tomas Halvorsen",
    role: "Manager",
    team: "Customer Operations — 6 direct reports",
    route: "team",
    home: "Open my team",
  },
  {
    email: "priya.raman@pms23.internal",
    password: "Quarterly!2026",
    name: "Priya Raman",
    role: "HR admin",
    team: "People & Culture",
    route: "employees",
    home: "Open people admin",
  },
  {
    email: "eleanor.whitlock@pms23.internal",
    password: "Quarterly!2026",
    name: "Eleanor Whitlock",
    role: "Executive — read only",
    team: "Leadership",
    route: "dashboard",
    home: "Open the read-only overview",
  },
];

const RESET_WINDOW = "60 minutes";
const MIN_PASSWORD = 12;

export default function Screen() {
  const navigate = useNavigate();
  const [view, setView] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [phase, setPhase] = React.useState("idle");
  const [error, setError] = React.useState("");
  const [session, setSession] = React.useState(null);
  const [resetEmail, setResetEmail] = React.useState("");
  const [linkUsed, setLinkUsed] = React.useState(false);

  const field = { border: HAIRLINE, borderRadius: brand.radius, height: 46, backgroundColor: "rgba(0,0,0,0.25)", color: brand.primaryColor };
  const label = { color: brand.neutralColor, letterSpacing: "0.18em" };
  const accentBtn = { backgroundColor: brand.accentColor, color: brand.backgroundColor, borderRadius: brand.radius };
  const quietBtn = { border: HAIRLINE, borderRadius: brand.radius, color: brand.primaryColor, backgroundColor: "transparent" };
  const busy = phase === "checking" || phase === "sending";

  React.useEffect(() => {
    if (phase !== "checking") return undefined;
    const t = setTimeout(() => {
      const match = ACCOUNTS.find(
        (a) => a.email === email.trim().toLowerCase() && a.password === password
      );
      if (match) {
        setSession(match);
        setPhase("signed-in");
      } else {
        setError("We could not sign you in with those details. Check the email address and password, then try again.");
        setPhase("idle");
      }
    }, 650);
    return () => clearTimeout(t);
  }, [phase, email, password]);

  React.useEffect(() => {
    if (phase !== "sending") return undefined;
    const t = setTimeout(() => {
      setResetEmail(email.trim());
      setLinkUsed(false);
      setPhase("idle");
      setView("reset-sent");
    }, 650);
    return () => clearTimeout(t);
  }, [phase, email]);

  const goReset = () => {
    setError("");
    setPhase("idle");
    setView("reset");
  };

  const backToSignIn = () => {
    setError("");
    setPhase("idle");
    setPassword("");
    setView("signin");
  };

  const submitSignIn = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter both your work email address and your password.");
      return;
    }
    setPhase("checking");
  };

  const submitReset = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter the work email address your PMS23 account uses.");
      return;
    }
    setPhase("sending");
  };

  const submitNewPassword = (e) => {
    e.preventDefault();
    setError("");
    if (linkUsed) {
      setError("This reset link has already been used. Request a new one to continue.");
      return;
    }
    if (newPassword.length < MIN_PASSWORD) {
      setError("Use at least " + MIN_PASSWORD + " characters, including one number.");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError("Use at least " + MIN_PASSWORD + " characters, including one number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The two passwords do not match. Retype them to confirm.");
      return;
    }
    setLinkUsed(true);
    setNewPassword("");
    setConfirmPassword("");
    setPassword("");
    setView("reset-done");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}>
      <style>{`
        .vl-focus:focus-visible { outline: none; box-shadow: 0 0 0 2px ${brand.backgroundColor}, 0 0 0 4px ${brand.accentColor}; }
        .vl-enter { animation: vlEnter 220ms ease-out both; }
        @keyframes vlEnter { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .vl-enter { animation: none; } }
      `}</style>
      <main className="w-full max-w-md p-10" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: HAIRLINE, borderRadius: brand.radius }}>
        <h1 className="text-3xl" style={{ fontFamily: brand.fontHeading }}>{PRODUCT}</h1>
        <div aria-hidden className="mt-3 h-px w-12" style={{ backgroundColor: brand.accentColor }} />
        <p className="mt-3 text-xs uppercase" style={label}>
          {view === "signin" ? SCREEN : view === "reset" ? "Reset password" : view === "reset-sent" ? "Reset link sent" : view === "reset-new" ? "Choose a new password" : "Password updated"}
        </p>

        {phase === "signed-in" && session ? (
          <div className="vl-enter">
            <p role="status" className="mt-8 text-xl" style={{ fontFamily: brand.fontHeading }}>Welcome back, {session.name.split(" ")[0]}.</p>
            <p className="mt-2 text-sm" style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}>
              Signed in as {session.role} · {session.team}
            </p>
            <button
              type="button"
              onClick={() => navigate(session.route)}
              className="vl-focus mt-8 h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
              style={accentBtn}
            >
              {session.home}
            </button>
            <button
              type="button"
              onClick={() => { setSession(null); setPassword(""); setPhase("idle"); setView("signin"); }}
              className="vl-focus mt-3 h-11 w-full text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={quietBtn}
            >
              Sign out
            </button>
          </div>
        ) : view === "signin" ? (
          <form className="vl-enter mt-8 space-y-5" onSubmit={submitSignIn} noValidate>
            {error ? (
              <p role="alert" className="px-3 py-3 text-sm leading-relaxed" style={{ border: HAIRLINE, borderRadius: brand.radius, backgroundColor: "rgba(0,0,0,0.25)", color: brand.primaryColor }}>
                <span className="mr-2 text-xs uppercase tracking-[0.18em]" style={{ color: brand.accentColor }}>Denied</span>
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="vl-email" className="block text-xs uppercase" style={label}>Work email</label>
              <input id="vl-email" name="email" type="email" autoComplete="username" aria-invalid={error ? true : undefined} value={email} onChange={(e) => setEmail(e.target.value)} className="vl-focus w-full px-3 text-sm outline-none" style={field} />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-password" className="block text-xs uppercase" style={label}>Password</label>
              <input id="vl-password" name="password" type="password" autoComplete="current-password" aria-invalid={error ? true : undefined} value={password} onChange={(e) => setPassword(e.target.value)} className="vl-focus w-full px-3 text-sm outline-none" style={field} />
            </div>
            <button type="submit" disabled={busy} className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-60" style={accentBtn}>
              {phase === "checking" ? "Checking credentials…" : "Sign in"}
            </button>
            <p className="text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
              PMS23 shows only what your role permits: your own goals as an employee, your reporting line as a manager, the whole organisation as HR admin, read-only analytics as an executive.
            </p>
          </form>
        ) : view === "reset" ? (
          <form className="vl-enter mt-8 space-y-5" onSubmit={submitReset} noValidate>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              Give us the email address on your PMS23 record and we will send a reset link that works for {RESET_WINDOW}.
            </p>
            {error ? (
              <p role="alert" className="px-3 py-3 text-sm leading-relaxed" style={{ border: HAIRLINE, borderRadius: brand.radius, backgroundColor: "rgba(0,0,0,0.25)", color: brand.primaryColor }}>
                <span className="mr-2 text-xs uppercase tracking-[0.18em]" style={{ color: brand.accentColor }}>Check this</span>
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="vl-reset-email" className="block text-xs uppercase" style={label}>Work email</label>
              <input id="vl-reset-email" name="reset-email" type="email" autoComplete="username" aria-invalid={error ? true : undefined} value={email} onChange={(e) => setEmail(e.target.value)} className="vl-focus w-full px-3 text-sm outline-none" style={field} />
            </div>
            <button type="submit" disabled={busy} className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90 disabled:opacity-60" style={accentBtn}>
              {phase === "sending" ? "Sending link…" : "Email me a reset link"}
            </button>
            <button type="button" onClick={backToSignIn} className="vl-focus h-11 w-full text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80" style={quietBtn}>
              Back to sign in
            </button>
          </form>
        ) : view === "reset-sent" ? (
          <div className="vl-enter mt-8 space-y-5">
            <p role="status" className="text-xl" style={{ fontFamily: brand.fontHeading }}>Check your inbox.</p>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}>
              If {resetEmail || "that address"} belongs to an active PMS23 account, a reset link is on its way. It expires in {RESET_WINDOW} and works once.
            </p>
            <button type="button" onClick={() => { setError(""); setView("reset-new"); }} className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90" style={accentBtn}>
              I have the link — set my password
            </button>
            <button type="button" onClick={goReset} className="vl-focus h-11 w-full text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80" style={quietBtn}>
              Send another link
            </button>
          </div>
        ) : view === "reset-new" ? (
          <form className="vl-enter mt-8 space-y-5" onSubmit={submitNewPassword} noValidate>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}>
              Resetting the password for {resetEmail || "your account"}. Use at least {MIN_PASSWORD} characters with one number.
            </p>
            {error ? (
              <p role="alert" className="px-3 py-3 text-sm leading-relaxed" style={{ border: HAIRLINE, borderRadius: brand.radius, backgroundColor: "rgba(0,0,0,0.25)", color: brand.primaryColor }}>
                <span className="mr-2 text-xs uppercase tracking-[0.18em]" style={{ color: brand.accentColor }}>Check this</span>
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="vl-new-password" className="block text-xs uppercase" style={label}>New password</label>
              <input id="vl-new-password" name="new-password" type="password" autoComplete="new-password" aria-invalid={error ? true : undefined} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="vl-focus w-full px-3 text-sm outline-none" style={field} />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-confirm-password" className="block text-xs uppercase" style={label}>Confirm new password</label>
              <input id="vl-confirm-password" name="confirm-password" type="password" autoComplete="new-password" aria-invalid={error ? true : undefined} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="vl-focus w-full px-3 text-sm outline-none" style={field} />
            </div>
            <button type="submit" className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90" style={accentBtn}>
              Save password
            </button>
            <button type="button" onClick={backToSignIn} className="vl-focus h-11 w-full text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-80" style={quietBtn}>
              Back to sign in
            </button>
          </form>
        ) : (
          <div className="vl-enter mt-8 space-y-5">
            <p role="status" className="text-xl" style={{ fontFamily: brand.fontHeading }}>Password updated.</p>
            <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              The reset link has now been used. Sign in with your new password to pick up your goals and check-ins.
            </p>
            <button type="button" onClick={backToSignIn} className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90" style={accentBtn}>
              Sign in
            </button>
          </div>
        )}

        <p className="mt-8 text-xs uppercase" style={label}>
          {view === "signin" ? (
            <React.Fragment>
              Forgotten your password? <button type="button" onClick={goReset} className="vl-focus underline underline-offset-4" style={{ color: brand.accentColor }}>Email me a reset link</button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              No account? Records are created by HR admin Priya Raman.
            </React.Fragment>
          )}
        </p>
      </main>
    </div>
  );
}
