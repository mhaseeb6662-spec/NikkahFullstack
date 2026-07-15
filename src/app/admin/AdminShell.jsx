"use client";

import { LayoutDashboard, Users, CreditCard, KeyRound, Heart, Settings, Images } from "lucide-react";
import DashboardShell from "@/layouts/DashboardShell";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/profiles", label: "Profiles & Photos", icon: Images },
  { to: "/admin/payments", label: "Payment Management", icon: CreditCard },
  { to: "/admin/access", label: "Contact & Photo Access", icon: KeyRound },
  { to: "/admin/success-stories", label: "Success Stories", icon: Heart },
  { to: "/admin/settings", label: "Website Settings", icon: Settings },
];

export default function AdminShell({ children }) {
  return (
    <DashboardShell title="Admin Panel" badge="Nikah Manzil Admin" links={links}>
      {children}
    </DashboardShell>
  );
}
