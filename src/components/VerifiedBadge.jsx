"use client";

import { ShieldCheck } from "lucide-react";

export default function VerifiedBadge({ ribbon = false, className = "" }) {
  if (ribbon) {
    return (
      <span className="verified-ribbon">
        <ShieldCheck size={13} strokeWidth={2.5} />
        VERIFIED
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-gold-600 bg-gold-500/10 border border-gold-500/30 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      <ShieldCheck size={13} strokeWidth={2.5} />
      Verified
    </span>
  );
}
