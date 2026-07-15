"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import SectionHeading from "@/components/SectionHeading";
import { Input } from "@/components/FormFields";

export default function SearchProfilesPage() {
  return (
    <Suspense fallback={null}>
      <SearchProfiles />
    </Suspense>
  );
}

function SearchProfiles() {
  const [query, setQuery] = useState("");

  // All profiles are loaded once, then the smart search bar does the
  // narrowing on the client — this way a single search box can match
  // against registration number, name, education, age, city, caste, etc.
  // all at the same time, without needing several separate search fields.
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        if (!cancelled) setAllProfiles(data.profiles || []);
      } catch {
        if (!cancelled) setAllProfiles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProfiles;

    return allProfiles.filter((p) => {
      // The single professional search bar: one query, checked against
      // every field a family might search by — registration/profile ID,
      // name, education, age, city, caste and profession.
      const haystack = [
        p.profileId,
        p.registrationNumber,
        p._id,
        p.fullName,
        p.name,
        p.education,
        p.city,
        p.caste,
        p.profession,
        p.age != null ? String(p.age) : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [allProfiles, query]);

  return (
    <div className="bg-blush-50 min-h-screen">
      <div className="bg-white border-b border-ink-900/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Find Your Match"
            title="Search Profiles"
            subtitle="Search by Registration Number, Name, Education, Age, City or Caste."
            align="left"
          />

          {/* Professional smart search bar */}
          <div className="relative mb-2 group">
            <div className="relative rounded-2xl bg-white border-2 border-ink-900/10 shadow-sm group-focus-within:border-maroon-500/60 group-focus-within:shadow-md transition-all">
              <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-maroon-500 transition-colors" />
              <Input
                className="!border-0 !shadow-none pl-12 pr-11 py-3.5 text-base bg-transparent focus:!ring-0"
                placeholder="Search by Registration No, Name, Education, Age, City, Caste..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-maroon-500"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="search-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-ink-600 mb-6">
          {loading ? "Searching..." : (
            <>Showing <span className="font-semibold text-ink-900">{results.length}</span> profile{results.length !== 1 && "s"}</>
          )}
        </p>
        {!loading && results.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-ink-900 mb-2">No profiles found</p>
            <p className="text-ink-600 text-sm">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((p) => (
              <ProfileCard key={p._id} profile={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}