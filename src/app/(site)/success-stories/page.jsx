"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";

export default function SuccessStories() {
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/success-stories")
      .then((res) => res.json())
      .then((data) => setSuccessStories(data.stories || []))
      .catch(() => setSuccessStories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <SectionHeading
        eyebrow="Real Families, Real Stories"
        title="Success Stories"
        subtitle="Every rishta finalized through Nikah Manzil is a story of trust between two families."
      />
      {!loading && successStories.length === 0 && (
        <p className="text-center text-ink-400 text-sm mb-10">
          Success stories will appear here soon, in shaa Allah.
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-6">
        {successStories.map((s) => (
          <div key={s._id} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 flex gap-5">
            <img
              src={s.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=60"}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-2 border-gold-500/40 shrink-0"
            />
            <div>
              <p className="font-display text-lg font-semibold text-ink-900 flex items-center gap-1.5">
                <Heart size={13} className="text-rose-500" fill="currentColor" /> {s.coupleName}
              </p>
              {s.city && (
                <p className="text-xs text-gold-600 font-bold uppercase tracking-wide mb-2">{s.city}</p>
              )}
              <p className="text-sm text-ink-600 leading-relaxed">"{s.story}"</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-14">
        <p className="font-display text-2xl font-semibold text-ink-900 mb-2">
          Ready to write your own success story?
        </p>
        <Button to="/register" size="lg" className="mt-4">
          Register Now
        </Button>
      </div>
    </div>
  );
}
