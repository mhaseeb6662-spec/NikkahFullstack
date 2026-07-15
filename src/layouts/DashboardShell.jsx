"use client";

import { useState } from "react";
import { Link, NavLink, useNavigate } from "@/lib/router-compat";
import { Heart, Menu, X, LogOut, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardShell({ title, badge, links, children }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2 px-6 h-20 border-b border-white/10 shrink-0">
        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-maroon-500 to-rose-500 flex items-center justify-center text-white">
          <Heart size={16} fill="white" />
        </span>
        <div>
          <p className="font-display text-white font-bold leading-none">{badge}</p>
        </div>
      </Link>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-maroon-500 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Home size={17} /> Back To Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:bg-rose-600/80 hover:text-white transition-colors"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blush-50 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-ink-900">
        <div className="sticky top-0 h-screen">{SidebarContent}</div>
      </aside>

      {/* Mobile sidebar drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-72 bg-ink-900 h-full">{SidebarContent}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-ink-900/5 h-16 flex items-center justify-between px-4">
          <button onClick={() => setOpen(true)} className="w-10 h-10 flex items-center justify-center text-ink-900" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-display font-semibold text-ink-900">{title}</span>
          <span className="w-10" />
        </div>

        <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
