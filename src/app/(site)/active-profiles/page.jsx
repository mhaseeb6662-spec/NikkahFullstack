"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import SectionHeading from "@/components/SectionHeading";

export default function ActiveProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        if (!cancelled) setProfiles(data.profiles || []);
      } catch {
        // keep empty on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <SectionHeading
        eyebrow="Verified & Live"
        title="Active Profiles"
        subtitle="Browse verified profiles currently active on Nikah Manzil, presented in a familiar social-feed style."
      />
      {loading ? (
        <p className="text-center text-ink-400 text-sm py-10">Loading profiles...</p>
      ) : profiles.length === 0 ? (
        <p className="text-center text-ink-400 text-sm py-10">No active profiles yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
          {profiles.map((p) => (
            <ProfileCard key={p._id} profile={p} />
          ))}
        </div>
      )}
    </div>
  );
}
