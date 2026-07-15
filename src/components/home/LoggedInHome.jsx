"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, GraduationCap, Layers, ChevronDown, X,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Slider from "@/components/Slider";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import ProfileCard from "@/components/ProfileCard";
import { cities, castes } from "@/data/profiles";
import { useSiteSettings } from "@/lib/siteSettings";

// Selectable age range for the filter box below (18–70).
const AGES = Array.from({ length: 53 }, (_, i) => 18 + i);

// Home page shown to logged-in members.
// Unlike the guest home page, this one greets the member by name and
// includes the "Active Verified Profiles" browsing section.
export default function LoggedInHome() {
  const { settings } = useSiteSettings();

  // Filter state — Age range, Caste, City, Education (free text)
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [selectedCaste, setSelectedCaste] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [educationQuery, setEducationQuery] = useState("");

  const [liveProfiles, setLiveProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [successStories, setSuccessStories] = useState([]);

  useEffect(() => {
    fetch("/api/success-stories")
      .then((res) => res.json())
      .then((data) => setSuccessStories(data.stories || []))
      .catch(() => setSuccessStories([]));
  }, []);

  // Top hero banner slider — pulls from the images the admin has uploaded
  // (settings.heroImages). Falls back to the older single settings.heroImage
  // field so the page still works before that admin panel is updated.
  const heroImages = useMemo(() => {
    if (Array.isArray(settings.heroImages) && settings.heroImages.length > 0) {
      return settings.heroImages;
    }
    return settings.heroImage ? [settings.heroImage] : [];
  }, [settings.heroImages, settings.heroImage]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        if (!cancelled) setLiveProfiles(data.profiles || []);
      } catch {
        // keep empty on failure
      } finally {
        if (!cancelled) setProfilesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profiles/me");
        const data = await res.json();
        if (!cancelled) setProfile(data.profile || null);
      } catch {
        if (!cancelled) setProfile(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProfiles = useMemo(() => {
    return liveProfiles.filter((p) => {
      const ageOk =
        (!minAge || (p.age ?? 0) >= Number(minAge)) &&
        (!maxAge || (p.age ?? 0) <= Number(maxAge));
      const casteOk = !selectedCaste || p.caste === selectedCaste;
      const cityOk = !selectedCity || p.city === selectedCity;
      const eduOk =
        !educationQuery.trim() ||
        (p.education || "").toLowerCase().includes(educationQuery.trim().toLowerCase());
      return ageOk && casteOk && cityOk && eduOk;
    });
  }, [liveProfiles, minAge, maxAge, selectedCaste, selectedCity, educationQuery]);

  const hasActiveFilters =
    Boolean(minAge) || Boolean(maxAge) || Boolean(selectedCaste) || Boolean(selectedCity) || educationQuery.trim().length > 0;

  const clearFilters = () => {
    setMinAge("");
    setMaxAge("");
    setSelectedCaste("");
    setSelectedCity("");
    setEducationQuery("");
  };

  return (
    <div>
      {/* Welcome hero */}
      <section className="relative overflow-hidden bg-ink-900 h-64 sm:h-80 md:h-[420px]">
        {heroImages.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.img
              key={heroImages[heroIndex]}
              src={heroImages[heroIndex]}
              alt="Nikah Manzil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/10 via-ink-900/5 to-ink-900/20" />

        {heroImages.length > 1 && (
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2 z-10">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === heroIndex ? "w-6 bg-gold-400" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Show banner ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-blush-50 to-transparent" />
      </section>

      {/* Filter section — 4 category-style boxes: Age, Caste, City, Education */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-base font-semibold text-ink-900">Filter Profiles</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-ink-400 hover:text-maroon-500 flex items-center gap-1"
            >
              <X size={13} /> Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FilterBox icon={Calendar} title="Age Range">
            <div className="flex items-center gap-1.5">
              <Dropdown
                value={minAge}
                onChange={setMinAge}
                placeholder="From"
                options={[{ value: "", label: "From" }, ...AGES.map((a) => ({ value: String(a), label: String(a) }))]}
              />
              <span className="text-ink-400 text-xs shrink-0">to</span>
              <Dropdown
                value={maxAge}
                onChange={setMaxAge}
                placeholder="To"
                options={[{ value: "", label: "To" }, ...AGES.map((a) => ({ value: String(a), label: String(a) }))]}
              />
            </div>
          </FilterBox>

          <FilterBox icon={Layers} title="Caste">
            <Dropdown
              value={selectedCaste}
              onChange={setSelectedCaste}
              placeholder="All Castes"
              options={[{ value: "", label: "All Castes" }, ...castes.map((c) => ({ value: c, label: c }))]}
            />
          </FilterBox>

          <FilterBox icon={MapPin} title="City">
            <Dropdown
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="All Cities"
              options={[{ value: "", label: "All Cities" }, ...cities.map((c) => ({ value: c, label: c }))]}
            />
          </FilterBox>

          <FilterBox icon={GraduationCap} title="Education">
            <input
              type="text"
              value={educationQuery}
              onChange={(e) => setEducationQuery(e.target.value)}
              placeholder="e.g. BSc, Masters..."
              className="w-full text-xs font-semibold text-ink-700 placeholder:text-ink-400 placeholder:font-normal focus:outline-none"
            />
          </FilterBox>
        </div>
      </section>

      {/* Active profiles — same ProfileCard grid used on the Active Profiles page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {profilesLoading ? (
          <p className="text-center text-ink-400 text-sm py-10">Loading profiles...</p>
        ) : filteredProfiles.length === 0 ? (
          <p className="text-center text-ink-400 text-sm py-10">
            {hasActiveFilters ? "No profiles match the selected filters." : "No active profiles yet — check back soon!"}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
            {filteredProfiles.map((p) => (
              <ProfileCard key={p._id} profile={p} />
            ))}
          </div>
        )}
      </section>

      {/* Success stories slider — populated live from stories the admin publishes */}
      {successStories.length > 0 && (
        <section className="bg-ink-900 py-16 md:py-24 relative overflow-hidden">
          <svg className="absolute -left-20 -bottom-20 w-96 h-96 opacity-[0.06]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#B8924A" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#B8924A" strokeWidth="1" />
          </svg>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Real Families, Real Stories"
              title="Success Stories"
              subtitle="A few of the families who found their perfect match through Nikah Manzil."
              light
            />
            <Slider itemBasis="basis-[88%] sm:basis-[60%] lg:basis-[38%]">
              {successStories.map((s) => (
                <SuccessStoryCard key={s._id} story={s} />
              ))}
            </Slider>
          </div>
        </section>
      )}
    </div>
  );
}

// One of the 4 filter tiles (Age / Caste / City / Education) — professional
// "outlined field" style: icon + label sit inline at the top of the box,
// and the input/select blends into the same bordered container instead of
// having its own separate border, like a real form field.
function FilterBox({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl px-3 py-2.5 bg-white border border-ink-900/10 shadow-sm focus-within:border-maroon-500/50 focus-within:ring-1 focus-within:ring-maroon-500/20 transition-colors">
      <label className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className="text-maroon-500 shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wide text-ink-400">
          {title}
        </span>
      </label>
      <div className="[&_input]:border-0 [&_input]:bg-transparent [&_input]:p-0 [&_input]:h-6 [&_input]:focus:outline-none">
        {children}
      </div>
    </div>
  );
}

// Custom dropdown used in place of native <select> so the option list can
// actually be styled (padding, hover states, spacing) — native <select>
// popups ignore CSS in most browsers, which is why the old dropdown looked
// cramped/unstyled against the left edge.
function Dropdown({ value, onChange, options, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const label = selected?.value ? selected.label : placeholder;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-1 text-xs font-semibold focus:outline-none"
      >
        <span className={`truncate ${value ? "text-ink-700" : "text-ink-400 font-normal"}`}>
          {label}
        </span>
        <ChevronDown
          size={13}
          className={`text-ink-400 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-ink-900/10 rounded-lg shadow-lg max-h-56 overflow-y-auto py-1">
          {options.map((opt) => (
            <button
              key={opt.value || "empty"}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left pl-3 pr-3 py-2 text-xs transition-colors ${
                opt.value === value
                  ? "bg-maroon-500/10 text-maroon-500 font-semibold"
                  : "text-ink-700 font-medium hover:bg-blush-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}