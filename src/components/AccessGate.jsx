"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "@/context/AuthContext";

// The one page a "profile complete but not yet approved" member is allowed
// to sit on — it's where they submit/track payment and see the
// "under review" message. Everything else redirects here until they're active.
const PAYMENT_PATH = "/payment";
// The one page an "account created but profile not filled" member is
// allowed to sit on.
const COMPLETE_PROFILE_PATH = "/complete-profile";

/**
 * Wraps the public site + member dashboard so that, until a user's profile
 * is completed AND their payment is approved by the admin, they can only
 * ever see the profile-creation form (or the pending-verification screen)
 * — no browsing, searching, messaging, or any other feature.
 */
export default function AccessGate({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const navigate = useNavigate();

  const needsProfile = !!user && user.role !== "admin" && !user.profileComplete;
  const needsApproval =
    !!user && user.role !== "admin" && user.profileComplete && user.status !== "active";

  useEffect(() => {
    if (loading || !user || user.role === "admin") return;

    if (needsProfile && pathname !== COMPLETE_PROFILE_PATH) {
      navigate(COMPLETE_PROFILE_PATH);
      return;
    }
    if (needsApproval && pathname !== PAYMENT_PATH) {
      navigate(PAYMENT_PATH);
    }
  }, [loading, user, pathname, needsProfile, needsApproval]);

  if (loading) return null;

  const shouldBlock =
    user &&
    user.role !== "admin" &&
    ((needsProfile && pathname !== COMPLETE_PROFILE_PATH) ||
      (needsApproval && pathname !== PAYMENT_PATH));

  if (shouldBlock) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-400 text-sm">
        Redirecting...
      </div>
    );
  }

  return children;
}
