"use client";

import { useEffect, useState } from "react";
import { Landmark, Smartphone, Plus, Trash2, Save, Globe, MessageCircle, Image as ImageIcon } from "lucide-react";
import { Field, Input, Select, Textarea } from "@/components/FormFields";
import Button from "@/components/Button";
import { DEFAULT_SETTINGS } from "@/lib/siteSettings";

export default function WebsiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [general, setGeneral] = useState({ siteName: DEFAULT_SETTINGS.siteName, whatsappNumber: DEFAULT_SETTINGS.whatsappNumber });
  const [hero, setHero] = useState({
    heroBadge: DEFAULT_SETTINGS.heroBadge,
    heroTitlePrefix: DEFAULT_SETTINGS.heroTitlePrefix,
    heroTitleHighlight: DEFAULT_SETTINGS.heroTitleHighlight,
    heroSubtitle: DEFAULT_SETTINGS.heroSubtitle,
    heroImage: DEFAULT_SETTINGS.heroImage,
    heroPrimaryBtnText: DEFAULT_SETTINGS.heroPrimaryBtnText,
    heroSecondaryBtnText: DEFAULT_SETTINGS.heroSecondaryBtnText,
  });
  const [fee, setFee] = useState(DEFAULT_SETTINGS.registrationFee);
  const [accounts, setAccounts] = useState(DEFAULT_SETTINGS.paymentAccounts);
  const [newAcc, setNewAcc] = useState({ type: "Mobile Wallet", label: "", details: "" });
  const [heroImages, setHeroImages] = useState(DEFAULT_SETTINGS.heroImages);
  const [newHeroImage, setNewHeroImage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        const s = data.settings || {};
        setGeneral({
          siteName: s.siteName ?? DEFAULT_SETTINGS.siteName,
          whatsappNumber: s.whatsappNumber ?? DEFAULT_SETTINGS.whatsappNumber,
        });
        setHero({
          heroBadge: s.heroBadge ?? DEFAULT_SETTINGS.heroBadge,
          heroTitlePrefix: s.heroTitlePrefix ?? DEFAULT_SETTINGS.heroTitlePrefix,
          heroTitleHighlight: s.heroTitleHighlight ?? DEFAULT_SETTINGS.heroTitleHighlight,
          heroSubtitle: s.heroSubtitle ?? DEFAULT_SETTINGS.heroSubtitle,
          heroImage: s.heroImage ?? DEFAULT_SETTINGS.heroImage,
          heroPrimaryBtnText: s.heroPrimaryBtnText ?? DEFAULT_SETTINGS.heroPrimaryBtnText,
          heroSecondaryBtnText: s.heroSecondaryBtnText ?? DEFAULT_SETTINGS.heroSecondaryBtnText,
        });
        setFee(s.registrationFee ?? DEFAULT_SETTINGS.registrationFee);
        setAccounts(s.paymentAccounts ?? DEFAULT_SETTINGS.paymentAccounts);
        setHeroImages(Array.isArray(s.heroImages) ? s.heroImages : DEFAULT_SETTINGS.heroImages);
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const removeAccount = (id) => setAccounts((prev) => prev.filter((a) => a.id !== id));

  const addHeroImage = (e) => {
    e.preventDefault();
    const url = newHeroImage.trim();
    if (!url) return;
    setHeroImages((prev) => [...prev, url]);
    setNewHeroImage("");
  };

  const removeHeroImage = (idx) => setHeroImages((prev) => prev.filter((_, i) => i !== idx));

  const addAccount = (e) => {
    e.preventDefault();
    if (!newAcc.label || !newAcc.details) return;
    setAccounts((prev) => [...prev, { id: Date.now(), ...newAcc }]);
    setNewAcc({ type: "Mobile Wallet", label: "", details: "" });
  };

  const saveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...general,
          ...hero,
          heroImages,
          registrationFee: Number(fee) || 0,
          paymentAccounts: accounts,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Settings save nahi ho sakin.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-ink-400 text-sm">Loading settings...</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Website Settings</h1>
      <p className="text-ink-600 text-sm mb-8">
        Full control over the website — site name, hero section, WhatsApp number, registration fee and payment
        accounts. Changes apply live across the public site.
      </p>

      {error && (
        <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{error}</p>
      )}

      <form onSubmit={saveAll}>
        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-5 flex items-center gap-2">
            <Globe size={18} className="text-maroon-500" /> General
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Website Name">
              <Input value={general.siteName} onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} />
            </Field>
            <Field label="WhatsApp Number" hint="Digits only with country code, e.g. 923001234567">
              <Input value={general.whatsappNumber} onChange={(e) => setGeneral({ ...general, whatsappNumber: e.target.value })} />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-5 flex items-center gap-2">
            <ImageIcon size={18} className="text-maroon-500" /> Hero Section
          </h2>
          <Field label="Eyebrow Badge Text">
            <Input value={hero.heroBadge} onChange={(e) => setHero({ ...hero, heroBadge: e.target.value })} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Title (before highlight)">
              <Input value={hero.heroTitlePrefix} onChange={(e) => setHero({ ...hero, heroTitlePrefix: e.target.value })} />
            </Field>
            <Field label="Title (highlighted words)">
              <Input value={hero.heroTitleHighlight} onChange={(e) => setHero({ ...hero, heroTitleHighlight: e.target.value })} />
            </Field>
          </div>
          <Field label="Subtitle">
            <Textarea value={hero.heroSubtitle} onChange={(e) => setHero({ ...hero, heroSubtitle: e.target.value })} />
          </Field>
          <Field label="Background Image URL">
            <Input value={hero.heroImage} onChange={(e) => setHero({ ...hero, heroImage: e.target.value })} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Field label="Primary Button Text">
              <Input value={hero.heroPrimaryBtnText} onChange={(e) => setHero({ ...hero, heroPrimaryBtnText: e.target.value })} />
            </Field>
            <Field label="Secondary Button Text">
              <Input value={hero.heroSecondaryBtnText} onChange={(e) => setHero({ ...hero, heroSecondaryBtnText: e.target.value })} />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2 flex items-center gap-2">
            <ImageIcon size={18} className="text-maroon-500" /> Hero Slider Images
          </h2>
          <p className="text-ink-600 text-sm mb-5">
            Add multiple image URLs to show a rotating slider on the homepage banner. If none are added, the single
            Background Image above is used instead.
          </p>
          <div className="space-y-3 mb-6">
            {heroImages.map((url, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-ink-900/10">
                <img src={url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 bg-ink-900/5" />
                <p className="flex-1 min-w-0 text-xs text-ink-600 truncate">{url}</p>
                <button
                  type="button"
                  onClick={() => removeHeroImage(idx)}
                  className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-500/10"
                  aria-label="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {heroImages.length === 0 && (
              <p className="text-xs text-ink-400">No slider images added yet.</p>
            )}
          </div>
          <div className="border-t border-ink-900/10 pt-5 flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="https://... image URL"
              value={newHeroImage}
              onChange={(e) => setNewHeroImage(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addHeroImage}>
              <Plus size={15} /> Add Image
            </Button>
          </div>
          <p className="text-xs text-gold-600 font-semibold mt-3">
            ⚠️ "Add Image" only adds it to this list — click "Save All Settings" at the bottom of the page to actually
            publish it live.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-5">Registration Fee</h2>
          <Field label="One-Time Registration Fee (PKR)">
            <Input type="number" value={fee} onChange={(e) => setFee(e.target.value)} className="max-w-xs" />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-5">Payment Accounts</h2>
          <div className="space-y-3 mb-6">
            {accounts.map((acc) => {
              const Icon = acc.type === "Bank Account" ? Landmark : Smartphone;
              return (
                <div key={acc.id} className="flex items-start gap-3 p-4 rounded-xl border border-ink-900/10">
                  <span className="w-10 h-10 rounded-lg bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-900 text-sm">{acc.label}</p>
                    <p className="text-xs text-ink-600 mt-0.5">{acc.details}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAccount(acc.id)}
                    className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-500/10"
                    aria-label="Remove account"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="border-t border-ink-900/10 pt-5">
            <p className="text-sm font-semibold text-ink-800 mb-3">Add New Payment Account</p>
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              <Select value={newAcc.type} onChange={(e) => setNewAcc({ ...newAcc, type: e.target.value })}>
                <option>Bank Account</option>
                <option>Mobile Wallet</option>
              </Select>
              <Input
                placeholder="Label (e.g. JazzCash)"
                value={newAcc.label}
                onChange={(e) => setNewAcc({ ...newAcc, label: e.target.value })}
              />
              <Input
                placeholder="Details / Account number"
                value={newAcc.details}
                onChange={(e) => setNewAcc({ ...newAcc, details: e.target.value })}
              />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addAccount}>
              <Plus size={15} /> Add Account
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}><Save size={16} /> {saving ? "Saving..." : "Save All Settings"}</Button>
          {saved && <span className="text-sm text-green-600 font-semibold">Settings saved.</span>}
        </div>
      </form>
    </div>
  );
}
