"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2, Plus, X, Eye, EyeOff } from "lucide-react";
import { Field, Input, Textarea } from "@/components/FormFields";
import Button from "@/components/Button";

export default function SuccessStoriesManagement() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ coupleName: "", city: "", story: "", image: "" });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/success-stories?all=1");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Stories load nahi ho sakin.");
      setStories(data.stories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeStory = async (id) => {
    if (!confirm("Yeh story permanently delete karni hai?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/success-stories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete nahi ho saka.");
      setStories((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const togglePublished = async (s) => {
    setBusyId(s._id);
    try {
      const res = await fetch(`/api/success-stories/${s._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !s.published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
      setStories((prev) => prev.map((x) => (x._id === s._id ? data.story : x)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const addStory = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/success-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Story save nahi ho saki.");
      setStories((prev) => [data.story, ...prev]);
      setForm({ coupleName: "", city: "", story: "", image: "" });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Success Stories</h1>
        <Button onClick={() => setShowForm((s) => !s)} size="sm">
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Cancel" : "Add Story"}
        </Button>
      </div>
      <p className="text-ink-600 text-sm mb-8">
        Publish or remove success stories shown on the public site. Stories moved here from Profiles &amp; Photos
        (Successful Rishta Management) also appear automatically.
      </p>

      {error && (
        <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{error}</p>
      )}

      {showForm && (
        <form onSubmit={addStory} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 mb-8">
          <Field label="Couple Name">
            <Input required value={form.coupleName} onChange={(e) => setForm({ ...form, coupleName: e.target.value })} placeholder="e.g. Ahmed & Ayesha" />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>
          <Field label="Photo URL (optional)">
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Story">
            <Textarea required value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
          </Field>
          <Button type="submit" disabled={saving}>{saving ? "Publishing..." : "Publish Story"}</Button>
        </form>
      )}

      {loading && <p className="text-ink-400 text-sm">Loading stories...</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        {!loading && stories.map((s) => (
          <div key={s._id} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-5 flex gap-4">
            <img
              src={s.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=60"}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/40 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-ink-900 flex items-center gap-1.5">
                <Heart size={12} className="text-rose-500" fill="currentColor" /> {s.coupleName}
              </p>
              <p className="text-xs text-gold-600 font-bold uppercase tracking-wide mb-1.5">{s.city || "—"}</p>
              <p className="text-xs text-ink-600 line-clamp-2">{s.story}</p>
              <span className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.published ? "bg-green-500/10 text-green-600" : "bg-ink-900/5 text-ink-500"}`}>
                {s.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                disabled={busyId === s._id}
                onClick={() => togglePublished(s)}
                title={s.published ? "Unpublish" : "Publish"}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-600 hover:bg-blush-100 disabled:opacity-40"
              >
                {s.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                disabled={busyId === s._id}
                onClick={() => removeStory(s._id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-500/10 disabled:opacity-40"
                aria-label="Remove story"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {!loading && stories.length === 0 && (
          <p className="text-center text-ink-400 text-sm py-10 col-span-2">No success stories yet.</p>
        )}
      </div>
    </div>
  );
}
