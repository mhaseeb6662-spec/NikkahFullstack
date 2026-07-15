"use client";

import { useEffect, useState } from "react";
import { Save, User, GraduationCap, Users, Heart, FileText, UploadCloud, Lock, Unlock, Trash2, ShieldAlert, Images } from "lucide-react";
import Button from "@/components/Button";
import { Field, Input, Select, Textarea } from "@/components/FormFields";
import { citiesByProvince, provinces, castes, educationLevels } from "@/data/profiles";

export default function EditProfile() {
  const [photos, setPhotos] = useState([]);
  const [mainPhoto, setMainPhoto] = useState("");
  const [photosError, setPhotosError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    height: "",
    maritalStatus: "Never Married",
    city: "",
    province: "",
    caste: "",
    education: "",
    collegeUniversity: "",
    profession: "",
    jobBusiness: "",
    income: "",
    sect: "",
    home: "",
    homeSize: "",
    nationality: "Pakistani",
    fatherOccupation: "",
    motherOccupation: "",
    brothers: "",
    sisters: "",
    about: "",
    familyDetails: "",
    reqAgeLimit: "",
    reqHeight: "",
    reqCity: "",
    reqCaste: "",
    reqQualification: "",
    reqOthers: "",
    expectations: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profiles/me");
        const data = await res.json();
        const p = data.profile;
        if (p && !cancelled) {
          setPhotos(p.photos || []);
          setMainPhoto(p.photo || "");
          setForm((f) => ({
            ...f,
            name: p.name || "",
            gender: p.gender ? p.gender[0].toUpperCase() + p.gender.slice(1) : "",
            age: p.age ?? "",
            height: p.height || "",
            maritalStatus: p.maritalStatus || "Never Married",
            city: p.city || "",
            province: p.province || "",
            caste: p.caste || "",
            education: p.education || "",
            collegeUniversity: p.collegeUniversity || "",
            profession: p.profession || "",
            jobBusiness: p.jobBusiness || "",
            income: p.income || "",
            sect: p.sect || "",
            home: p.home || "",
            homeSize: p.homeSize || "",
            nationality: p.nationality || "Pakistani",
            fatherOccupation: p.fatherOccupation || "",
            motherOccupation: p.motherOccupation || "",
            brothers: p.brothers ?? "",
            sisters: p.sisters ?? "",
            about: p.about || "",
            familyDetails: p.familyDetails || "",
            reqAgeLimit: p.reqAgeLimit || "",
            reqHeight: p.reqHeight || "",
            reqCity: p.reqCity || "",
            reqCaste: p.reqCaste || "",
            reqQualification: p.reqQualification || "",
            reqOthers: p.reqOthers || "",
            expectations: p.expectations || "",
          }));
        }
      } catch {
        // keep blank form on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setPhotosError("");
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/profiles/me/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload nahi ho saka.");
      setPhotos(data.profile.photos);
      setMainPhoto(data.profile.photo || "");
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleHidden = async (photo) => {
    setBusyId(photo._id);
    try {
      const res = await fetch(`/api/profiles/me/photos/${photo._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenByUser: !photo.hiddenByUser }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setPhotos(data.profile.photos);
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const removePhoto = async (photo) => {
    setBusyId(photo._id);
    try {
      const res = await fetch(`/api/profiles/me/photos/${photo._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete nahi ho saka.");
      setPhotos(data.profile.photos);
      if (mainPhoto === photo.url) setMainPhoto(data.profile.photo || "");
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const setAsMainPhoto = async (photo) => {
    setBusyId(photo._id);
    setPhotosError("");
    try {
      const res = await fetch("/api/profiles/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: photo.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setMainPhoto(data.profile.photo || "");
    } catch (err) {
      setPhotosError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          gender: form.gender ? form.gender.toLowerCase() : undefined,
          age: form.age ? Number(form.age) : undefined,
          brothers: form.brothers !== "" ? Number(form.brothers) : undefined,
          sisters: form.sisters !== "" ? Number(form.sisters) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile save nahi ho saki.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Profile save nahi ho saki.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blush-50">
        <p className="text-ink-400 text-sm">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-ink-600 text-sm max-w-md mx-auto">
            Fill in your details below — a complete profile gets noticed faster by serious families.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <FormSection icon={Images} title="Photos">
            {photosError && (
              <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{photosError}</p>
            )}
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-ink-900/15 rounded-2xl py-8 cursor-pointer hover:border-maroon-500/40 transition-colors mb-5">
              <UploadCloud size={22} className="text-ink-400" />
              <span className="text-sm text-ink-600 font-semibold">
                {uploading ? "Uploading..." : "Click to upload a new photo"}
              </span>
              <span className="text-xs text-ink-400">JPG or PNG, up to 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={addPhoto} disabled={uploading} />
            </label>

            {photos.length === 0 ? (
              <p className="text-ink-400 text-sm text-center py-4">No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photos.map((p) => (
                  <div key={p._id} className="relative rounded-2xl overflow-hidden bg-blush-50 border border-ink-900/5 group">
                    <div className="aspect-square relative">
                      <img
                        src={p.url}
                        alt=""
                        className={`w-full h-full object-cover ${p.hiddenByUser || p.hiddenByAdmin ? "opacity-40 blur-[2px]" : ""}`}
                      />
                      {p.hiddenByAdmin && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40">
                          <ShieldAlert size={18} className="text-white drop-shadow" />
                          <span className="text-[10px] text-white font-semibold uppercase tracking-wide">Hidden by admin</span>
                        </div>
                      )}
                      {!p.hiddenByAdmin && p.hiddenByUser && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock size={20} className="text-white drop-shadow" />
                        </div>
                      )}
                      {mainPhoto === p.url && (
                        <span className="absolute top-1.5 left-1.5 text-[10px] font-bold uppercase tracking-wide bg-maroon-500 text-white px-2 py-0.5 rounded-full">
                          Main
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                      <button
                        type="button"
                        onClick={() => setAsMainPhoto(p)}
                        disabled={busyId === p._id || mainPhoto === p.url}
                        title="Set as main photo"
                        className="flex-1 text-[10px] font-semibold text-white bg-white/20 hover:bg-white/30 rounded-lg py-1 disabled:opacity-40"
                      >
                        Set Main
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleHidden(p)}
                        disabled={p.hiddenByAdmin || busyId === p._id}
                        className="w-7 h-7 flex items-center justify-center text-white bg-white/20 hover:bg-white/30 rounded-lg disabled:opacity-40"
                        aria-label="Toggle hidden"
                      >
                        {p.hiddenByUser ? <Unlock size={11} /> : <Lock size={11} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(p)}
                        disabled={busyId === p._id}
                        className="w-7 h-7 flex items-center justify-center text-white bg-rose-600/80 hover:bg-rose-600 rounded-lg disabled:opacity-40"
                        aria-label="Delete photo"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          <FormSection icon={User} title="Personal Details">
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Full Name"><Input value={form.name} onChange={update("name")} required /></Field>
              <Field label="Gender">
                <Select value={form.gender} onChange={update("gender")}>
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </Field>
              <Field label="Age"><Input type="number" value={form.age} onChange={update("age")} /></Field>
              <Field label="Height"><Input value={form.height} onChange={update("height")} /></Field>
              <Field label="Marital Status">
                <Select value={form.maritalStatus} onChange={update("maritalStatus")}>
                  <option>Never Married</option><option>Divorced</option><option>Widowed</option>
                </Select>
              </Field>
              <Field label="Nationality"><Input value={form.nationality} onChange={update("nationality")} /></Field>
              <Field label="Province">
                <Select
                  value={form.province}
                  onChange={(e) => setForm((f) => ({ ...f, province: e.target.value, city: "" }))}
                >
                  <option value="" disabled>Select Province</option>
                  {provinces.map((p) => <option key={p}>{p}</option>)}
                </Select>
              </Field>
              <Field label="City">
                <Select value={form.city} onChange={update("city")}>
                  <option value="" disabled>Select City</option>
                  {(form.province ? [form.province] : provinces).map((p) => (
                    <optgroup key={p} label={p}>
                      {citiesByProvince[p].map((c) => <option key={c}>{c}</option>)}
                    </optgroup>
                  ))}
                </Select>
              </Field>
              <Field label="Caste">
                <Select value={form.caste} onChange={update("caste")}>
                  <option value="" disabled>Select</option>
                  {castes.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Sect"><Input value={form.sect} onChange={update("sect")} /></Field>
            </div>
            <Field label="Personal Introduction">
              <Textarea value={form.about} onChange={update("about")} />
            </Field>
          </FormSection>

          <FormSection icon={GraduationCap} title="Education & Career">
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Education">
                <Select value={form.education} onChange={update("education")}>
                  <option value="" disabled>Select</option>
                  {educationLevels.map((e) => <option key={e}>{e}</option>)}
                </Select>
              </Field>
              <Field label="College / University"><Input value={form.collegeUniversity} onChange={update("collegeUniversity")} /></Field>
              <Field label="Profession"><Input value={form.profession} onChange={update("profession")} /></Field>
              <Field label="Job / Business Detail"><Input value={form.jobBusiness} onChange={update("jobBusiness")} /></Field>
              <Field label="Income"><Input value={form.income} onChange={update("income")} /></Field>
            </div>
          </FormSection>

          <FormSection icon={Users} title="Family Background">
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Home">
                <Select value={form.home} onChange={update("home")}>
                  <option value="" disabled>Select</option>
                  <option>Own</option>
                  <option>Rented</option>
                </Select>
              </Field>
              <Field label="House Size"><Input value={form.homeSize} onChange={update("homeSize")} /></Field>
              <Field label="Father's Occupation"><Input value={form.fatherOccupation} onChange={update("fatherOccupation")} /></Field>
              <Field label="Mother's Occupation"><Input value={form.motherOccupation} onChange={update("motherOccupation")} /></Field>
              <Field label="Brothers"><Input type="number" min="0" value={form.brothers} onChange={update("brothers")} /></Field>
              <Field label="Sisters"><Input type="number" min="0" value={form.sisters} onChange={update("sisters")} /></Field>
            </div>
            <Field label="Family Details" hint="Parents' occupation, siblings, family background.">
              <Textarea value={form.familyDetails} onChange={update("familyDetails")} />
            </Field>
          </FormSection>

          <FormSection icon={Heart} title="Partner Preferences">
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Age Limit"><Input placeholder="e.g. 20-25" value={form.reqAgeLimit} onChange={update("reqAgeLimit")} /></Field>
              <Field label="Height"><Input placeholder="e.g. Less than 5'7&quot;" value={form.reqHeight} onChange={update("reqHeight")} /></Field>
              <Field label="City"><Input value={form.reqCity} onChange={update("reqCity")} /></Field>
              <Field label="Caste"><Input value={form.reqCaste} onChange={update("reqCaste")} /></Field>
              <Field label="Qualification"><Input value={form.reqQualification} onChange={update("reqQualification")} /></Field>
              <Field label="Others / Demand"><Input value={form.reqOthers} onChange={update("reqOthers")} /></Field>
            </div>
            <Field label="Expectations From Partner">
              <Textarea value={form.expectations} onChange={update("expectations")} />
            </Field>
          </FormSection>

          <div className="sticky bottom-4 z-10">
            <div className="bg-white rounded-2xl border border-ink-900/10 shadow-lg px-5 py-4 flex items-center justify-between gap-4">
              <span className="text-sm text-ink-500 hidden sm:inline">
                {saved ? "Saved just now." : "Don't forget to save your changes."}
              </span>
              <div className="flex items-center gap-3 ml-auto">
                {saved && <span className="text-sm text-green-600 font-semibold">Profile updated successfully.</span>}
                <Button type="submit" disabled={saving}>
                  <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// A clean, labeled card that groups related fields together — replaces the
// old single flat form so the page reads as simple, guided steps instead
// of one long dashboard-style data dump.
function FormSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-5 sm:p-7">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-9 h-9 rounded-xl bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
          <Icon size={17} />
        </span>
        <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}