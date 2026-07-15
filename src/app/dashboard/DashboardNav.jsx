"use client";

import AccessGate from "@/components/AccessGate";

export default function DashboardNav({ children }) {
  return (
    <div className="min-h-screen bg-blush-50">
      <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
        <AccessGate>{children}</AccessGate>
      </div>
    </div>
  );
}
