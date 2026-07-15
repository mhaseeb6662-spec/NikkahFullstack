"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import {
  UploadCloud,
  CheckCircle2,
  User,
  Users2,
  HeartHandshake,
  Image as ImageIcon,
  EyeOff,
} from "lucide-react";
import Button from "@/components/Button";
import { Field, Input, Select, Textarea } from "@/components/FormFields";
import { useAuth } from "@/context/AuthContext";

/* ------------------------------------------------------------------ */
/* Static option data                                                  */
/* ------------------------------------------------------------------ */
const HOUSE_STATUSES = ["Own", "Rented"];

const MARRIAGE_PREFERENCES = ["Own Caste", "Open Caste"];

const SECTS = ["Ahle Sunnat", "Ahle Hadith", "Shia", "Other"];

const MASLAK_OPTIONS = ["Ahle Sunnat", "Deobandi", "Ahle Hadith", "Shia"];

const MARITAL_STATUSES = ["Single", "Divorced", "Widowed", "Nikah Break"];

const STEPS = [
  { icon: User, label: "Personal" },
  { icon: Users2, label: "Family" },
  { icon: HeartHandshake, label: "Requirements" },
  { icon: ImageIcon, label: "Photos" },
];

const StepsStrip = () => (
  <div className="hidden sm:flex items-center justify-between mb-8 bg-white/60 border border-ink-900/5 rounded-2xl px-4 py-3">
    {STEPS.map(({ icon: Icon, label }, i) => (
      <div key={label} className="flex items-center gap-2 flex-1">
        <span className="w-8 h-8 rounded-full bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
          <Icon size={15} />
        </span>
        <span className="text-xs font-semibold text-ink-700">{label}</span>
        {i < STEPS.length - 1 && <span className="flex-1 h-px bg-ink-900/10 mx-2" />}
      </div>
    ))}
  </div>
);

const SectionHeader = ({ icon: Icon, step, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-5">
    <span className="w-10 h-10 rounded-xl bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
      <Icon size={18} />
    </span>
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-maroon-500">
        Step {step} of {STEPS.length}
      </p>
      <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
      {subtitle && <p className="text-ink-600 text-sm mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Required = () => <span className="text-rose-500 ml-0.5">*</span>;

// Small ON/OFF switch used for "Hide Photos", styled to match the rest
// of the form (maroon accent, rounded, no external dependency).
const ToggleSwitch = ({ checked, onChange, labelOn = "ON", labelOff = "OFF" }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center gap-2 rounded-full px-1 py-1 border transition-colors ${
      checked ? "bg-maroon-500 border-maroon-500" : "bg-ink-900/5 border-ink-900/10"
    }`}
    aria-pressed={checked}
  >
    <span
      className={`w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-[10px] font-bold transition-transform ${
        checked ? "translate-x-0 text-maroon-500" : "text-ink-500"
      }`}
    >
      {checked ? labelOn : labelOff}
    </span>
  </button>
);

// Generic "select with Other free-text fallback" field — still used for
// Preferred Sect, which needs an "Other, please specify" option.
const SelectWithOtherField = ({ label, options, value, otherValue, onSelectChange, onOtherChange }) => (
  <>
    <Field label={label}>
      <Select value={value} onChange={onSelectChange}>
        <option value="" disabled>Select</option>
        {options.map((o) => <option key={o}>{o}</option>)}
        {!options.includes("Other") && <option value="Other">Other</option>}
      </Select>
    </Field>
    {value === "Other" && (
      <Field label={`${label} (please specify)`}>
        <Input placeholder={`Enter ${label.toLowerCase()}`} value={otherValue} onChange={onOtherChange} />
      </Field>
    )}
  </>
);

export default function CompleteProfile() {
  const { user, loading: authLoading, refresh } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // 1. Personal Details
    fullName: "",
    fatherName: "",
    gender: "",
    religion: "Islam",
    sect: "",
    maritalStatus: "Single",
    age: "",
    height: "",
    education: "",
    profession: "",
    income: "",
    caste: "",
    city: "", // free text, no dropdown
    address: "", // free text
    houseStatus: "",
    houseSize: "",

    // 2. Family Details
    fatherOccupation: "",
    motherOccupation: "",
    brothers: "",
    marriedBrothers: "",
    sisters: "",
    marriedSisters: "",
    familyIntro: "",

    // 3. Partner Requirements
    preferredAge: "", // free text, e.g. "15 to 25"
    preferredCaste: "", // only used/shown when marriagePreference === "Open Caste"
    marriagePreference: "",
    preferredSect: "",
    preferredSectOther: "",
    additionalRequirements: "",
  });

  // 4. Profile Photos
  const [photoFiles, setPhotoFiles] = useState([]);
  const [hidePhotos, setHidePhotos] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login?next=/complete-profile");
    } else if (user?.name && !form.fullName) {
      // Pre-fill with the name used at signup, but still let the person edit it.
      setForm((f) => ({ ...f, fullName: user.name }));
    }
  }, [authLoading, user]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const readAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles(files);
  };

  // If user switches to "Own Caste", clear any typed preferred caste value
  // so stale text doesn't get submitted silently.
  const handleMarriagePreferenceChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      marriagePreference: value,
      preferredCaste: value === "Open Caste" ? f.preferredCaste : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (photoFiles.length > 8) {
      setError("Please upload a maximum of 8 photos.");
      return;
    }

    setLoading(true);
    try {
      // 1. Save the profile details
      const res = await fetch("/api/profiles/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          fatherName: form.fatherName,
          gender: form.gender ? form.gender.toLowerCase() : undefined,
          religion: form.religion,
          sect: form.sect,
          maritalStatus: form.maritalStatus,
          age: form.age ? Number(form.age) : undefined,
          height: form.height,
          education: form.education,
          profession: form.profession,
          income: form.income,
          city: form.city,
          address: form.address,
          caste: form.caste,
          houseStatus: form.houseStatus,
          houseSize: form.houseSize,

          fatherOccupation: form.fatherOccupation,
          motherOccupation: form.motherOccupation,
          brothers: form.brothers ? Number(form.brothers) : undefined,
          marriedBrothers: form.marriedBrothers ? Number(form.marriedBrothers) : undefined,
          sisters: form.sisters ? Number(form.sisters) : undefined,
          marriedSisters: form.marriedSisters ? Number(form.marriedSisters) : undefined,
          familyIntro: form.familyIntro,

          preferredAge: form.preferredAge,
          preferredCaste: form.marriagePreference === "Open Caste" ? form.preferredCaste : "",
          marriagePreference: form.marriagePreference,
          preferredSect:
            form.preferredSect === "Other" ? form.preferredSectOther : form.preferredSect,
          additionalRequirements: form.additionalRequirements,

          hidePhotos,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile save nahi ho saki.");

      // 2. Upload profile photos (4–5)
      for (const file of photoFiles) {
        const dataUrl = await readAsDataUrl(file);
        await fetch("/api/profiles/me/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl, hidden: hidePhotos }),
        });
      }

      // 3. Refresh the logged-in user in context so profileComplete is
      // up to date immediately — otherwise the access guard on the next
      // page still sees the old (incomplete) status and bounces back here.
      await refresh();

      // Profile complete — move on to membership payment. The payment
      // page collects the registration fee, Transaction ID, and payment
      // screenshot; the profile then stays "Pending" until Admin approval.
      navigate("/payment");
    } catch (err) {
      setError(err.message || "Profile save nahi ho saki.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush-50 py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-rose-500">
            Almost There
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mt-2">
            Complete Your Profile
          </h1>
          <p className="text-ink-600 text-sm mt-2">
            Welcome{user?.name ? `, ${user.name}` : ""}! Fill out the form below — it's all on one page,
            just scroll down and complete each section.
          </p>
        </div>

        <StepsStrip />

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-ink-900/5 p-6 sm:p-8 space-y-10">
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          {/* SECTION 1: Personal Details */}
          <section>
            <SectionHeader icon={User} step={1} title="Personal Details" />
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Full Name">
                <Input placeholder="e.g. Abdul Haseeb" value={form.fullName} onChange={update("fullName")} />
              </Field>
              <Field label="Father Name">
                <Input placeholder="e.g. Muhammad Aslam" value={form.fatherName} onChange={update("fatherName")} />
              </Field>
              <Field label="Gender">
                <Select value={form.gender} onChange={update("gender")}>
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </Field>
              <Field label="Marital Status">
                <Select value={form.maritalStatus} onChange={update("maritalStatus")}>
                  {MARITAL_STATUSES.map((m) => <option key={m}>{m}</option>)}
                </Select>
              </Field>
              <Field label="Religion">
                <Input value={form.religion} disabled />
              </Field>
              <Field label="Sect (Maslak) | مسلک">
                <Select value={form.sect} onChange={update("sect")}>
                  <option value="" disabled>Select</option>
                  {MASLAK_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Age">
                <Input type="number" min="18" max="70" placeholder="e.g. 28" value={form.age} onChange={update("age")} />
              </Field>
              <Field label="Height">
                <Input placeholder="e.g. 5'8&quot;" value={form.height} onChange={update("height")} />
              </Field>
              <Field label="Education">
                <Input placeholder="e.g. BSc Computer Science" value={form.education} onChange={update("education")} />
              </Field>
              <Field label="Profession / Business">
                <Input placeholder="e.g. Job in Factory" value={form.profession} onChange={update("profession")} />
              </Field>
              <Field label="Monthly Income">
                <Input placeholder="e.g. PKR 50,000+" value={form.income} onChange={update("income")} />
              </Field>
              <Field label="Caste">
                <Input placeholder="e.g. Arain" value={form.caste} onChange={update("caste")} />
              </Field>
              <Field label="City">
                <Input placeholder="e.g. Multan" value={form.city} onChange={update("city")} />
              </Field>
              <Field label="House Status">
                <Select value={form.houseStatus} onChange={update("houseStatus")}>
                  <option value="" disabled>Select</option>
                  {HOUSE_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="House Size">
                <Input placeholder="e.g. 5 Marla" value={form.houseSize} onChange={update("houseSize")} />
              </Field>
            </div>
            <Field label="Full Address">
              <Textarea placeholder="House #, street, area..." value={form.address} onChange={update("address")} />
            </Field>
          </section>

          {/* SECTION 2: Family Details */}
          <section className="pt-8 border-t border-ink-900/10">
            <SectionHeader icon={Users2} step={2} title="Family Details" subtitle="A short background about your family." />
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Father's Profession">
                <Input placeholder="e.g. Businessman / Late" value={form.fatherOccupation} onChange={update("fatherOccupation")} />
              </Field>
              <Field label="Mother's Profession">
                <Input placeholder="e.g. House Wife" value={form.motherOccupation} onChange={update("motherOccupation")} />
              </Field>
              <Field label="Total Brothers">
                <Input type="number" min="0" value={form.brothers} onChange={update("brothers")} />
              </Field>
              <Field label="Married Brothers">
                <Input type="number" min="0" value={form.marriedBrothers} onChange={update("marriedBrothers")} />
              </Field>
              <Field label="Total Sisters">
                <Input type="number" min="0" value={form.sisters} onChange={update("sisters")} />
              </Field>
              <Field label="Married Sisters">
                <Input type="number" min="0" value={form.marriedSisters} onChange={update("marriedSisters")} />
              </Field>
            </div>
            <Field label="Short Family Introduction">
              <Textarea placeholder="e.g. Father is a businessman, mother is a homemaker, 2 brothers & 1 sister, joint family..." value={form.familyIntro} onChange={update("familyIntro")} />
            </Field>
          </section>

          {/* SECTION 3: Partner Requirements */}
          <section className="pt-8 border-t border-ink-900/10">
            <SectionHeader icon={HeartHandshake} step={3} title="Partner Requirements" subtitle="What are you looking for in a match?" />
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Preferred Age">
                <Input placeholder="e.g. 15 to 25" value={form.preferredAge} onChange={update("preferredAge")} />
              </Field>
              <Field label="Marriage Preference">
                <Select value={form.marriagePreference} onChange={handleMarriagePreferenceChange}>
                  <option value="" disabled>Select</option>
                  {MARRIAGE_PREFERENCES.map((m) => <option key={m}>{m}</option>)}
                </Select>
              </Field>
              {form.marriagePreference === "Open Caste" && (
                <Field label="Preferred Caste">
                  <Input placeholder="e.g. Arain, Rajput, Jutt..." value={form.preferredCaste} onChange={update("preferredCaste")} />
                </Field>
              )}
              <SelectWithOtherField
                label="Preferred Sect"
                options={SECTS}
                value={form.preferredSect}
                otherValue={form.preferredSectOther}
                onSelectChange={(e) => setForm((f) => ({ ...f, preferredSect: e.target.value }))}
                onOtherChange={update("preferredSectOther")}
              />
            </div>
            <Field label="Partner Requirements" hint="Optional">
              <Textarea placeholder="Any other preferences or requirements..." value={form.additionalRequirements} onChange={update("additionalRequirements")} />
            </Field>
          </section>

          {/* SECTION 4: Profile Photos */}
          <section className="pt-8 border-t border-ink-900/10">
            <SectionHeader icon={ImageIcon} step={4} title="Profile Photos" subtitle="Apni recent photos upload karein (optional)." />
            <Field label="Upload Photos" hint="Optional — up to 8 photos">
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-ink-900/15 rounded-xl py-6 cursor-pointer hover:border-maroon-500/40 hover:bg-maroon-500/5 transition-colors">
                <UploadCloud size={22} className="text-ink-400" />
                <span className="text-sm text-ink-600">
                  {photoFiles.length > 0 ? `${photoFiles.length} photo(s) selected` : "Click to upload photos (optional)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotosChange}
                />
              </label>
            </Field>

            <div className="flex items-center justify-between gap-4 bg-maroon-500/5 border border-maroon-500/10 rounded-xl px-4 py-3.5 mt-5">
              <div className="flex items-start gap-2.5">
                <EyeOff size={16} className="text-maroon-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Hide Photos</p>
                  <p className="text-xs text-ink-600 mt-0.5">
                    When ON, your photos stay hidden from everyone. Only Admin can grant access to a specific user.
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={hidePhotos} onChange={setHidePhotos} />
            </div>
          </section>

          <Button type="submit" className="w-full" disabled={loading}>
            <CheckCircle2 size={16} /> {loading ? "Saving Your Profile..." : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}