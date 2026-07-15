import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminShell from "./AdminShell";

// Server-side guard: runs on every request to any /admin/* page, BEFORE any
// HTML is sent to the browser. A non-admin (or logged-out) visitor can never
// see the admin UI or its data — this cannot be bypassed from the client.
export default async function AdminDashboardLayout({ children }) {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/login?next=/admin");
  }
  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
