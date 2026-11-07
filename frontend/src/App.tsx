import * as React from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import Login from "@/screens/Login";
import Dashboard from "@/screens/Dashboard";
import GoalDetail from "@/screens/GoalDetail";
import Team from "@/screens/Team";
import Praise from "@/screens/Praise";
import Employees from "@/screens/Employees";
import { apiFetch, clearSessionToken, getSessionToken } from "@/lib/api";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// Unauthenticated access to any screen behind sign-in sends the visitor back
// to /login; reloading there never restores a session nobody has a token for.
function RequireAuth({ children }: { children: React.ReactElement }) {
  const token = getSessionToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// The screens behind sign-in render inside the side menu. Login and the other
// screens shown before sign-in render on their own, with no menu around them.
function Shell() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Logout still proceeds locally even if the server call fails.
    }
    clearSessionToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className="w-56 shrink-0 border-r p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <p
          className="mb-4 px-3 text-sm font-semibold"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          {"PMS23"}
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" className={navLinkClass}>
            {"My goals dashboard"}
          </NavLink>
          <NavLink to="/goal-detail" className={navLinkClass}>
            {"Goal detail"}
          </NavLink>
          <NavLink to="/team" className={navLinkClass}>
            {"My team"}
          </NavLink>
          <NavLink to="/praise" className={navLinkClass}>
            {"Praise"}
          </NavLink>
          <NavLink to="/employees" className={navLinkClass}>
            {"People admin"}
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 block w-full rounded-[var(--brand-radius)] px-3 py-2 text-left text-sm font-medium text-[var(--brand-fg-muted)] transition-colors hover:bg-[var(--brand-hover)] hover:text-[var(--brand-fg)]"
        >
          {"Sign out"}
        </button>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Shell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goal-detail" element={<GoalDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/praise" element={<Praise />} />
        <Route path="/employees" element={<Employees />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
