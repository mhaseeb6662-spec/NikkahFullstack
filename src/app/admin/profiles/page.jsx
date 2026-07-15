"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, BadgeCheck, EyeOff, Eye, Trash2, Pencil, X, Heart, Users, Phone, Mail, MessageCircle } from "lucide-react";
import { Input, Select, Field, Textarea } from "@/components/FormFields";
import Button from "@/components/Button";

export default function ProfileModeration() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyKey, setBusyKey] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const [editProfile, setEditProfile] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [successProfile, setSuccessProfile] = useState(null);
  const [successForm, setSuccessForm] = useState({ partnerName: "", story: "", published: true });
  const [movingSuccess, setMovingSuccess] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/profiles");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profiles load nahi ho sakin.");
      setProfiles(data.profiles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQ = !q || p.name?.toLowerCase().includes(q) || p.profileId?.toLowerCase().includes(q);
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && p.active) ||
        (filter === "inactive" && !p.active) ||
        (filter === "verified" && p.verified) ||
        (filter === "unverified" && !p.verified);
      return matchesQ && matchesFilter;
    });
  }, [profiles, query, filter]);

  const updateProfile = async (id, patch) => {
    setBusyKey(id);
    try {
      const res = await fetch(`/api/admin/profiles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setProfiles((prev) => prev.map((p) => (p._id === id ? data.profile : p)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyKey(null);
    }
  };

  const togglePhoto = async (profileId, photo) => {
    const key = photo._id;
    setBusyKey(key);
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}/photos/${photo._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenByAdmin: !photo.hiddenByAdmin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Photo update nahi ho saka.");
      setProfiles((prev) => prev.map((p) => (p._id === profileId ? data.profile : p)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyKey(null);
    }
  };

  const setPhotoVisibility = async (profileId, photo, visibility) => {
    const key = photo._id;
    setBusyKey(key);
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}/photos/${photo._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Photo update nahi ho saka.");
      setProfiles((prev) => prev.map((p) => (p._id === profileId ? data.profile : p)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyKey(null);
    }
  };

  const deletePhoto = async (profileId, photo) => {
    if (!confirm("Yeh photo permanently delete karni hai?")) return;
    const key = photo._id;
    setBusyKey(key);
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}/photos/${photo._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Photo delete nahi ho saki.");
      setProfiles((prev) => prev.map((p) => (p._id === profileId ? data.profile : p)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyKey(null);
    }
  };

  const deleteProfile = async (p) => {
    if (!confirm(`${p.name} ki profile permanently delete karni hai? User account active rahega.`)) return;
    setBusyKey(p._id);
    try {
      const res = await fetch(`/api/admin/profiles/${p._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete nahi ho saka.");
      setProfiles((prev) => prev.filter((x) => x._id !== p._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyKey(null);
    }
  };

  const openEdit = (p) => {
    setEditProfile(p);
    setEditForm({
      name: p.name || "",
      gender: p.gender || "",
      age: p.age || "",
      city: p.city || "",
      caste: p.caste || "",
      education: p.education || "",
      profession: p.profession || "",
      maritalStatus: p.maritalStatus || "",
      height: p.height || "",
      religion: p.religion || "",
      sect: p.sect || "",
      about: p.about || "",
      familyDetails: p.familyDetails || "",
      expectations: p.expectations || "",
    });
    setEditError("");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    setEditError("");
    try {
      const res = await fetch(`/api/admin/profiles/${editProfile._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, age: editForm.age ? Number(editForm.age) : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setProfiles((prev) => prev.map((p) => (p._id === editProfile._id ? data.profile : p)));
      setEditProfile(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const openSuccessForm = (p) => {
    setSuccessProfile(p);
    setSuccessForm({ partnerName: "", story: "", published: true });
  };

  const confirmMoveToSuccess = async (e) => {
    e.preventDefault();
    setMovingSuccess(true);
    try {
      const res = await fetch(`/api/admin/profiles/${successProfile._id}/move-to-success`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(successForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Move nahi ho saka.");
      setProfiles((prev) => prev.filter((p) => p._id !== successProfile._id));
      setSuccessProfile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setMovingSuccess(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Profiles &amp; Photos</h1>
      <p className="text-ink-600 text-sm mb-8">
        Activate or deactivate any profile, edit details, mark it verified, and control exactly which photos are
        visible on the public site — including whether a photo is public or only shown to approved contacts.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <Input className="pl-10" placeholder="Search by name or profile ID..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select className="sm:w-52" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Profiles</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="verified">Verified Only</option>
          <option value="unverified">Unverified Only</option>
        </Select>
      </div>

      {error && (
        <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{error}</p>
      )}

      {loading && <p className="text-ink-400 text-sm">Loading profiles...</p>}

      <div className="space-y-4">
        {!loading && filtered.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm overflow-hidden">
            <div className="p-5 flex flex-wrap items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-blush-100 shrink-0">
                {p.photo || p.photos?.[0]?.url ? (
                  <img src={p.photo || p.photos[0].url} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-[220px]">
                <p className="font-semibold text-ink-900 flex items-center gap-1.5">
                  {p.name} {p.verified && <BadgeCheck size={15} className="text-maroon-500" />}
                </p>
                <p className="text-xs text-ink-400">{p.profileId} • {p.city || "—"} • {p.photos?.length || 0} photos</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                  {p.phone ? (
                    <a href={`tel:${p.phone}`} className="text-xs font-semibold text-maroon-600 flex items-center gap-1 hover:underline">
                      <Phone size={12} /> {p.phone}
                    </a>
                  ) : (
                    <span className="text-xs text-ink-400 flex items-center gap-1">
                      <Phone size={12} /> No phone on file
                    </span>
                  )}
                  {p.phone && (
                    <a
                      href={`https://wa.me/${p.phone.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-green-600 flex items-center gap-1 hover:underline"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  )}
                  {p.email && (
                    <a href={`mailto:${p.email}`} className="text-xs text-ink-500 flex items-center gap-1 hover:underline">
                      <Mail size={12} /> {p.email}
                    </a>
                  )}
                </div>
              </div>

              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.active ? "bg-green-500/10 text-green-600" : "bg-rose-500/10 text-rose-600"}`}>
                {p.active ? "Active" : "Inactive"}
              </span>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button
                  disabled={busyKey === p._id}
                  onClick={() => updateProfile(p._id, { active: !p.active })}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40 ${
                    p.active ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20" : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                  }`}
                >
                  {p.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-ink-900/5 text-ink-700 hover:bg-ink-900/10"
                >
                  {expanded === p._id ? "Hide Photos" : "Manage Photos"}
                </button>
                <IconBtn title="Edit Profile Details" onClick={() => openEdit(p)}>
                  <Pencil size={14} />
                </IconBtn>
                <IconBtn title="Move to Successful Rishtas" tone="gold" onClick={() => openSuccessForm(p)}>
                  <Heart size={14} />
                </IconBtn>
                <IconBtn title="Delete Profile" tone="rose" disabled={busyKey === p._id} onClick={() => deleteProfile(p)}>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>

            {expanded === p._id && (
              <div className="border-t border-ink-900/5 p-5 bg-blush-50/60">
                {(!p.photos || p.photos.length === 0) && (
                  <p className="text-sm text-ink-400">No photos uploaded for this profile.</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {p.photos?.map((photo) => (
                    <div key={photo._id} className="relative rounded-xl overflow-hidden bg-white border border-ink-900/10 shadow-sm">
                      <div className="aspect-square relative">
                        <img
                          src={photo.url}
                          alt=""
                          className={`w-full h-full object-cover ${photo.hiddenByAdmin ? "opacity-35 grayscale" : ""}`}
                        />
                      </div>
                      <div className="p-2 space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <button
                            title={photo.hiddenByAdmin ? "Show this photo publicly" : "Hide this photo from the public site"}
                            disabled={busyKey === photo._id}
                            onClick={() => togglePhoto(p._id, photo)}
                            className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold rounded-lg py-1.5 disabled:opacity-40 ${
                              photo.hiddenByAdmin ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "bg-gold-500/10 text-gold-600 hover:bg-gold-500/20"
                            }`}
                          >
                            {photo.hiddenByAdmin ? <Eye size={12} /> : <EyeOff size={12} />}
                            {photo.hiddenByAdmin ? "Show" : "Hide"}
                          </button>
                          <button
                            title="Delete photo permanently"
                            disabled={busyKey === photo._id}
                            onClick={() => deletePhoto(p._id, photo)}
                            className="w-7 h-7 flex items-center justify-center text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg disabled:opacity-40"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <select
                          title="Who can see this photo"
                          disabled={busyKey === photo._id || photo.hiddenByAdmin}
                          value={photo.visibility || "everyone"}
                          onChange={(e) => setPhotoVisibility(p._id, photo, e.target.value)}
                          className="w-full text-[10px] font-semibold rounded-lg py-1 px-1 border border-ink-900/10 bg-white disabled:opacity-40"
                        >
                          <option value="everyone">Visible: Everyone</option>
                          <option value="approvedOnly">Visible: Approved Only</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-ink-400 text-sm py-10">No profiles match your filters.</p>
        )}
      </div>

      {editProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setEditProfile(null)}>
          <form
            onSubmit={saveEdit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-ink-900">Edit Profile — {editProfile.profileId}</h2>
              <button type="button" onClick={() => setEditProfile(null)} className="text-ink-400 hover:text-ink-700">
                <X size={18} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Name"><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Field>
              <Field label="Gender">
                <Select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </Field>
              <Field label="Age"><Input type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} /></Field>
              <Field label="City"><Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} /></Field>
              <Field label="Caste"><Input value={editForm.caste} onChange={(e) => setEditForm({ ...editForm, caste: e.target.value })} /></Field>
              <Field label="Education"><Input value={editForm.education} onChange={(e) => setEditForm({ ...editForm, education: e.target.value })} /></Field>
              <Field label="Profession"><Input value={editForm.profession} onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })} /></Field>
              <Field label="Marital Status"><Input value={editForm.maritalStatus} onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })} /></Field>
              <Field label="Height"><Input value={editForm.height} onChange={(e) => setEditForm({ ...editForm, height: e.target.value })} /></Field>
              <Field label="Religion"><Input value={editForm.religion} onChange={(e) => setEditForm({ ...editForm, religion: e.target.value })} /></Field>
              <Field label="Sect"><Input value={editForm.sect} onChange={(e) => setEditForm({ ...editForm, sect: e.target.value })} /></Field>
            </div>
            <Field label="About"><Textarea value={editForm.about} onChange={(e) => setEditForm({ ...editForm, about: e.target.value })} /></Field>
            <Field label="Family Details"><Textarea value={editForm.familyDetails} onChange={(e) => setEditForm({ ...editForm, familyDetails: e.target.value })} /></Field>
            <Field label="Expectations"><Textarea value={editForm.expectations} onChange={(e) => setEditForm({ ...editForm, expectations: e.target.value })} /></Field>
            {editError && <p className="text-sm text-rose-600 mb-3">{editError}</p>}
            <Button type="submit" disabled={savingEdit} className="w-full justify-center">
              {savingEdit ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      )}

      {successProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSuccessProfile(null)}>
          <form
            onSubmit={confirmMoveToSuccess}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
                <Heart size={18} className="text-rose-500" /> Mark as Successful Rishta
              </h2>
              <button type="button" onClick={() => setSuccessProfile(null)} className="text-ink-400 hover:text-ink-700">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-ink-500 mb-4">
              This removes <strong>{successProfile.name}</strong>'s active profile from the searchable pool and adds a
              record to Success Stories for public/record keeping.
            </p>
            <Field label="Partner's Name (optional)">
              <Input value={successForm.partnerName} onChange={(e) => setSuccessForm({ ...successForm, partnerName: e.target.value })} placeholder="e.g. Ayesha" />
            </Field>
            <Field label="Short Story (optional)">
              <Textarea value={successForm.story} onChange={(e) => setSuccessForm({ ...successForm, story: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink-700 mb-4">
              <input type="checkbox" checked={successForm.published} onChange={(e) => setSuccessForm({ ...successForm, published: e.target.checked })} />
              Publish on the public Success Stories page immediately
            </label>
            <Button type="submit" disabled={movingSuccess} className="w-full justify-center">
              {movingSuccess ? "Moving..." : "Confirm & Move"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, title, tone = "default", onClick, disabled }) {
  const tones = {
    default: "text-ink-600 hover:bg-blush-100",
    green: "text-green-600 hover:bg-green-500/10",
    rose: "text-rose-600 hover:bg-rose-500/10",
    gold: "text-gold-600 hover:bg-gold-500/10",
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}
