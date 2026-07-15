"use client";

import { useEffect, useState } from "react";
import {
  MessageCircle, UserCog, MapPin, GraduationCap, Briefcase, Ruler,
  Calendar, Users, BadgeCheck, Landmark, Globe2, Heart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSiteSettings } from "@/lib/siteSettings";
import Button from "@/components/Button";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&q=60";
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=60";

// A single, complete profile page — no dashboard stats, no internal tabs.
// Everything (photo, details, family background, partner preferences and
// the photo gallery) lives on one scrollable page, styled like a classic
// social-profile page: a cover banner, a profile picture overlapping it,
// and clean info sections below.
export default function MyProfile() {
  const { user } = useAuth();
  const { settings } = useSiteSettings();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profiles/me");
        const data = await res.json();
        if (!cancelled) setProfile(data.profile || null);
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-ink-400 text-sm">Loading your profile...</p>;
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-8 text-center">
        <p className="font-display text-xl font-semibold text-ink-900 mb-2">No Profile Found</p>
        <p className="text-ink-600 text-sm mb-6">You haven't filled in your profile details yet.</p>
        <Button to="/dashboard/edit-profile"><UserCog size={15} /> Complete Your Profile</Button>
      </div>
    );
  }

  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum, I need help regarding my profile ${profile.profileId} — ${profile.name}.`
  )}`;

  const details = [
    { icon: Calendar, label: "Age", value: profile.age ? `${profile.age} Years` : "—" },
    { icon: Ruler, label: "Height", value: profile.height || "—" },
    { icon: Users, label: "Marital Status", value: profile.maritalStatus || "—" },
    { icon: MapPin, label: "City", value: profile.city || "—" },
    { icon: GraduationCap, label: "Education", value: profile.education || "—" },
    { icon: Briefcase, label: "Profession", value: profile.profession || "—" },
    { icon: Landmark, label: "Caste", value: profile.caste || "—" },
    { icon: Globe2, label: "Nationality", value: profile.nationality || "—" },
  ];

  const visiblePhotos = (profile.photos || []).filter((p) => !p.hiddenByAdmin);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover + profile picture, Facebook-profile style */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-ink-900/5 shadow-sm">
        <div className="h-32 sm:h-48 w-full">
          <img src={FALLBACK_COVER} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
            <img
              src={profile.photo || FALLBACK_PHOTO}
              alt={profile.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white shrink-0"
            />
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">{profile.name}</h1>
                {profile.verified && <BadgeCheck size={20} className="text-gold-600 shrink-0" />}
              </div>
              <p className="text-ink-600 text-sm mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5"><BadgeCheck size={13} className="text-maroon-500" /> {profile.profileId}</span>
                {profile.city && <span className="flex items-center gap-1.5"><MapPin size={13} className="text-maroon-500" /> {profile.city}</span>}
              </p>
            </div>
            <div className="flex gap-2.5 sm:pb-1">
              <Button href={waLink} target="_blank" rel="noreferrer" variant="primary" size="sm">
                <MessageCircle size={15} /> WhatsApp
              </Button>
              <Button to="/dashboard/edit-profile" variant="outline" size="sm">
                <UserCog size={15} /> Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile details grid */}
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5">
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-5">Profile Details</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-ink-600">{label}</p>
                <p className="text-sm font-semibold text-ink-900 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5">
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-3 flex items-center gap-2">
          <Users size={18} className="text-maroon-500" /> About Me
        </h2>
        <p className="text-ink-600 text-sm leading-relaxed">{profile.about || "No introduction added yet."}</p>
      </div>

      {/* Family details */}
      {profile.familyDetails && (
        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5">
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-3">Family Details</h2>
          <p className="text-ink-600 text-sm leading-relaxed">{profile.familyDetails}</p>
        </div>
      )}

      {/* Partner preferences */}
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5">
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-3 flex items-center gap-2">
          <Heart size={18} className="text-maroon-500" /> Expectations From Partner
        </h2>
        <p className="text-ink-600 text-sm leading-relaxed">{profile.expectations || "—"}</p>
      </div>

      {/* Photo gallery */}
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5 mb-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-ink-900">Photos</h2>
          <Button to="/dashboard/edit-profile" variant="ghost" size="sm">Manage Photos</Button>
        </div>
        {visiblePhotos.length === 0 ? (
          <p className="text-ink-400 text-sm">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {visiblePhotos.map((p) => (
              <div key={p._id} className="aspect-square rounded-xl overflow-hidden bg-blush-100">
                <img
                  src={p.url}
                  alt=""
                  className={`w-full h-full object-cover ${p.hiddenByUser ? "opacity-40 blur-[2px]" : ""}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
