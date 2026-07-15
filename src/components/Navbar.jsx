"use client";

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "@/lib/router-compat";
import {
  Heart,
  Menu,
  X,
  User,
  Bell,
  ChevronDown,
  UserCog,
  Settings,
  ShieldCheck,
  FileText,
  LogOut,
} from "lucide-react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { useSiteSettings } from "@/lib/siteSettings";

// Navbar shown when the user is logged in
const loggedInLinks = [
  { to: "/", label: "Home" },
  { to: "/active-profiles", label: "Active Profiles" },
  { to: "/search", label: "Search Profiles" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

const myAccountLinks = [
  { to: "/dashboard", label: "My Profile", icon: User },
  { to: "/dashboard/edit-profile", label: "Edit Profile", icon: UserCog },
  { to: "/dashboard/security", label: "Account Settings", icon: Settings },
];

const importantPagesLinks = [
  { to: "/privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
  { to: "/terms", label: "Terms & Conditions", icon: FileText },
];

// Navbar shown when the user is NOT logged in
const loggedOutLinks = [
  { to: "/", label: "Home" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const accountRef = useRef(null);
  const pagesRef = useRef(null);

  const links = user ? loggedInLinks : loggedOutLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
    setPagesOpen(false);
    setMobileAccountOpen(false);
    setMobilePagesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
      if (pagesRef.current && !pagesRef.current.contains(e.target)) {
        setPagesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-white"
      }`}
    >
      <nav className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-maroon-500 to-rose-500 flex items-center justify-center text-white shrink-0">
              <Heart size={16} fill="white" />
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-ink-900 whitespace-nowrap">
              {settings.siteName}
            </span>
          </Link>
          <button
            type="button"
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-ink-600 hover:text-maroon-500 hover:bg-blush-100 transition-colors shrink-0"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Center links — hug their own content and stay centered, don't stretch across the bar */}
        <div className="hidden xl:flex flex-1 items-center justify-center min-w-0">
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-2.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-maroon-500 bg-maroon-500/10"
                      : "text-ink-600 hover:text-maroon-500 hover:bg-blush-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {user && (
              <>
                <div className="relative" ref={accountRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((s) => !s)}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      accountOpen
                        ? "text-maroon-500 bg-maroon-500/10"
                        : "text-ink-600 hover:text-maroon-500 hover:bg-blush-100"
                    }`}
                  >
                    My Account
                    <ChevronDown size={15} className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-lg ring-1 ring-ink-900/5 py-2 z-50">
                      {myAccountLinks.map((l, i) => (
                        <Link
                          key={`${l.to}-${i}`}
                          to={l.to}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:text-maroon-500 hover:bg-blush-100"
                        >
                          <l.icon size={16} />
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={pagesRef}>
                  <button
                    type="button"
                    onClick={() => setPagesOpen((s) => !s)}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      pagesOpen
                        ? "text-maroon-500 bg-maroon-500/10"
                        : "text-ink-600 hover:text-maroon-500 hover:bg-blush-100"
                    }`}
                  >
                    Important Pages
                    <ChevronDown size={15} className={`transition-transform ${pagesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {pagesOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-lg ring-1 ring-ink-900/5 py-2 z-50">
                      {importantPagesLinks.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:text-maroon-500 hover:bg-blush-100"
                        >
                          <l.icon size={16} />
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </Button>
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">Login</Button>
              <Button to="/register" size="sm">Register Now</Button>
            </>
          )}
        </div>

        {/* Mobile / tablet toggle (now shows below xl instead of lg, since links are more numerous) */}
        <button
          className="xl:hidden w-10 h-10 flex items-center justify-center text-ink-900 shrink-0"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="xl:hidden border-t border-ink-900/5 bg-white px-4 py-4">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive ? "text-maroon-500 bg-maroon-500/10" : "text-ink-700"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {user && (
              <>
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileAccountOpen((s) => !s)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-ink-700"
                  >
                    My Account
                    <ChevronDown size={16} className={`transition-transform ${mobileAccountOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAccountOpen && (
                    <div className="flex flex-col gap-0.5 pl-4">
                      {myAccountLinks.map((l, i) => (
                        <Link
                          key={`${l.to}-${i}`}
                          to={l.to}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-600"
                        >
                          <l.icon size={16} />
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setMobilePagesOpen((s) => !s)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-ink-700"
                  >
                    Important Pages
                    <ChevronDown size={16} className={`transition-transform ${mobilePagesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobilePagesOpen && (
                    <div className="flex flex-col gap-0.5 pl-4">
                      {importantPagesLinks.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-600"
                        >
                          <l.icon size={16} />
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-ink-900/5">
            {user ? (
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </Button>
            ) : (
              <>
                <Button to="/login" variant="outline" className="w-full">Login</Button>
                <Button to="/register" className="w-full">Register Now</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}