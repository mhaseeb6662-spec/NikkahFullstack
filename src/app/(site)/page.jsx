"use client";

import { useAuth } from "@/context/AuthContext";
import LoggedOutHome from "@/components/home/LoggedOutHome";
import LoggedInHome from "@/components/home/LoggedInHome";

// Home route ("/") — shows a different home page depending on login state:
// - Not logged in  -> LoggedOutHome (marketing/landing page, no profile browsing)
// - Logged in      -> LoggedInHome (personalized welcome + active profiles)
export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    // Avoid a flash of the wrong home page while auth status is resolving
    return <div className="min-h-[60vh]" />;
  }

  return user ? <LoggedInHome /> : <LoggedOutHome />;
}
