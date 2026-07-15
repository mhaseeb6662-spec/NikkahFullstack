"use client";

import { Link } from "@/lib/router-compat";
import { UserRound, Users, Calendar, GraduationCap, ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&q=60";

export default function ProfileCard({ profile, className = "" }) {
  const regId = profile.profileId || profile.id;
  const photo = profile.photo || FALLBACK_PHOTO;

  return (
    <div
      className={`group relative flex flex-col w-full shrink-0 bg-white rounded-2xl overflow-hidden border border-ink-900/5 shadow-sm hover:shadow-2xl hover:shadow-maroon-500/10 transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Facebook-style header: name + registration number */}
      <div className="pt-4 px-4 pb-3 text-center border-b border-ink-900/5">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-ink-900 flex items-center justify-center gap-1.5 truncate">
          {profile.name}
          {profile.verified && (
            <ShieldCheck size={16} className="text-gold-600 shrink-0" strokeWidth={2.5} />
          )}
        </h3>
        <p className="mt-1 text-xs sm:text-sm font-semibold text-maroon-500 flex items-center justify-center gap-1">
          <BadgeCheck size={13} /> Reg # {regId}
        </p>
      </div>

      {/* Post-style photo, like a Facebook post */}
      <Link
        to={`/profile/${regId}`}
        className="relative block w-full aspect-square sm:aspect-[4/3] overflow-hidden bg-blush-200"
      >
        <img
          src={photo}
          alt={profile.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* 4 info boxes: name, caste, age, education */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <InfoBox icon={UserRound} label="Name" value={profile.name} />
        <InfoBox icon={Users} label="Caste" value={profile.caste} />
        <InfoBox icon={Calendar} label="Age" value={`${profile.age} yrs`} />
        <InfoBox icon={GraduationCap} label="Education" value={profile.education} />
      </div>

      {/* Profile View button */}
      <div className="px-3 pb-3 mt-auto">
        <Link
          to={`/profile/${regId}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-maroon-500 text-white text-sm font-semibold hover:bg-maroon-600 transition-colors"
        >
          Profile View <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-blush-50 rounded-xl px-2 py-2.5 text-center min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400 mb-1 flex items-center justify-center gap-1">
        <Icon size={11} className="text-maroon-500 shrink-0" /> {label}
      </p>
      <p className="text-xs sm:text-sm font-semibold text-ink-900 truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
