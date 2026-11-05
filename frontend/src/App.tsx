import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

import Login from "@/screens/Login";
import Dashboard from "@/screens/Dashboard";
import GoalDetail from "@/screens/GoalDetail";
import Team from "@/screens/Team";
import Praise from "@/screens/Praise";
import Employees from "@/screens/Employees";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The screens behind sign-in render inside the side menu. Login and the other
// screens shown before sign-in render on their own, with no menu around them.
function Shell() {
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
      <Route element={<Shell />}>
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
