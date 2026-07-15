"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MessageCircle, MapPin, GraduationCap, Briefcase, Ruler,
  Calendar, Users, BadgeCheck, Landmark, Globe2, Heart,
  Lock, Phone, PhoneCall, ShieldCheck, Image as ImageIcon,
} from "lucide-react";
import Button from "@/components/Button";
import { useSiteSettings } from "@/lib/siteSettings";
import { useAuth } from "@/context/AuthContext";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&q=60";
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=60";

// Same one-page, scrollable, Facebook-profile-style layout as the member's
// own "My Profile" page (src/app/dashboard/page.jsx) — cover banner, profile
// picture overlapping it, and clean info cards below — so a visitor viewing
// someone else's profile sees the exact same design language. The only
// difference is the Contact Number card, which stays locked until the admin
// approves an access request.
export default function ProfileDetail() {
  const { id } = useParams();
  const { settings } = useSiteSettings();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null); // null | pending | approved | rejected | self | admin
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/profiles/${id}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (!cancelled) {
          setProfile(data.profile);
          setAccessStatus(data.profile.myAccessStatus || null);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const requestAccess = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setRequesting(true);
    setRequestError("");
    try {
      const res = await fetch("/api/admin/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetProfile: profile._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request bheji nahi ja saki.");
      setAccessStatus("pending");
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <p className="text-ink-400 text-sm px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto">Loading profile...</p>;
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-3xl font-semibold text-ink-900 mb-2">Profile Not Found</h1>
        <p className="text-ink-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
        <Button to="/search">Search Other Profiles</Button>
      </div>
    );
  }

  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum, I am interested in Profile ${profile.profileId} — ${profile.name}.`
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

  const visiblePhotos = profile.photos || [];
  const hiddenCount = profile.hiddenPhotoCount || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Cover + profile picture, Facebook-profile style — identical to My Profile */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Contact number — locked until admin approves access */}
      <ContactCard
        profile={profile}
        accessStatus={accessStatus}
        requesting={requesting}
        requestError={requestError}
        onRequest={requestAccess}
      />

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
          <Users size={18} className="text-maroon-500" /> About
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

      {/* Additional details */}
      <AdditionalDetails profile={profile} />

      {/* Photo gallery */}
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5 mb-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-ink-900">Photos</h2>
        </div>
        {visiblePhotos.length === 0 && hiddenCount === 0 ? (
          <p className="text-ink-400 text-sm">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {visiblePhotos.map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-blush-100">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {Array.from({ length: hiddenCount }).map((_, i) => (
              <div
                key={`hidden-${i}`}
                className="aspect-square rounded-xl bg-ink-900/90 flex flex-col items-center justify-center text-white/70 gap-1"
              >
                <Lock size={18} />
                <span className="text-[10px] font-semibold">Hidden</span>
              </div>
            ))}
          </div>
        )}
        {hiddenCount > 0 && (
          <p className="text-xs text-ink-400 mt-3 flex items-center gap-1.5">
            <ImageIcon size={13} /> {hiddenCount} photo(s) hidden — request access via admin.
          </p>
        )}
      </div>

      <div className="text-center mb-6">
        <Button to="/search" variant="ghost">← Back To Search</Button>
      </div>
    </div>
  );
}

function ContactCard({ profile, accessStatus, requesting, requestError, onRequest }) {
  const phone = profile.phone;

  // Phone is present in the API response only when access has been granted
  // (self / admin / an approved access grant) — show it directly.
  if (phone) {
    const digits = phone.replace(/[^\d+]/g, "");
    return (
      <div className="bg-white rounded-2xl border border-green-500/20 shadow-sm p-6 sm:p-8 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </span>
          <h2 className="font-display text-lg font-semibold text-ink-900">Contact Number</h2>
        </div>
        <p className="text-2xl font-bold text-ink-900 tracking-wide mb-4">{phone}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button href={`tel:${digits}`} variant="primary" className="justify-center">
            <PhoneCall size={16} /> Call Now
          </Button>
          <Button href={`https://wa.me/${digits.replace(/^\+/, "")}`} target="_blank" rel="noreferrer" variant="outline" className="justify-center">
            <MessageCircle size={16} /> WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  // No phone in the response — number is private. Show the right state
  // depending on whether this member has already asked the admin for access.
  let statusNode;
  if (accessStatus === "pending") {
    statusNode = (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-500/10 text-gold-600">
        Request Sent — Waiting For Admin Approval
      </span>
    );
  } else if (accessStatus === "rejected") {
    statusNode = (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600">
        Request Denied By Admin
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-10 h-10 rounded-xl bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
          <Phone size={18} />
        </span>
        <h2 className="font-display text-lg font-semibold text-ink-900">Contact Number</h2>
      </div>
      <p className="text-ink-600 text-sm mb-4 flex items-center gap-1.5">
        <Lock size={13} className="text-ink-400 shrink-0" /> This member's phone number is private and only shared once our admin approves your request.
      </p>
      {statusNode && <div className="mb-4">{statusNode}</div>}
      {requestError && <p className="text-xs text-rose-600 mb-3">{requestError}</p>}
      {accessStatus !== "pending" && (
        <Button
          variant="outline"
          onClick={onRequest}
          disabled={requesting}
          className="w-full sm:w-auto justify-center"
        >
          <Lock size={16} /> {requesting ? "Sending..." : accessStatus === "rejected" ? "Request Again" : "Request Contact Details"}
        </Button>
      )}
    </div>
  );
}

function BioLine({ label, value }) {
  if (!value) return null;
  return (
    <p className="text-ink-700 text-sm">
      <span className="text-ink-400">{label}: </span>
      <span className="font-medium">{value}</span>
    </p>
  );
}

function AdditionalDetails({ profile }) {
  const lines = [
    ["College / University", profile.collegeUniversity],
    ["Job / Business", profile.jobBusiness],
    ["Income", profile.income],
    ["Sect", profile.sect],
    ["Home", profile.home],
    ["Home Size", profile.homeSize],
    ["Father's Occupation", profile.fatherOccupation],
    ["Mother's Occupation", profile.motherOccupation],
    ["Brothers", profile.brothers ?? profile.siblings?.brothers],
    ["Sisters", profile.sisters ?? profile.siblings?.sisters],
    ["Requirement — Age Limit", profile.reqAgeLimit],
    ["Requirement — Height", profile.reqHeight],
    ["Requirement — City", profile.reqCity],
    ["Requirement — Caste", profile.reqCaste],
    ["Requirement — Qualification", profile.reqQualification],
    ["Requirement — Others", profile.reqOthers],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  if (lines.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mt-5">
      <h2 className="font-display text-lg font-semibold text-ink-900 mb-3">Additional Details</h2>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {lines.map(([label, value]) => (
          <BioLine key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}
