import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "./DashboardNav";

// Server-side guard so an unauthenticated visitor can't load the member
// dashboard at all. Admins are sent to their own panel instead.
export default async function UserDashboardLayout({ children }) {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/login?next=/dashboard");
  }
  if (session.role === "admin") {
    redirect("/admin");
  }

  return <DashboardNav>{children}</DashboardNav>;
}
