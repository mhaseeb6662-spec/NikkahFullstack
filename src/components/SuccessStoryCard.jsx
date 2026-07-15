"use client";

import { Heart } from "lucide-react";

export default function SuccessStoryCard({ story }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={story.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=60"}
          alt={story.coupleName}
          className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/50"
        />
        <div>
          <p className="font-display text-lg font-semibold text-white flex items-center gap-1.5">
            <Heart size={13} className="text-rose-400" fill="currentColor" /> {story.coupleName}
          </p>
          {story.city && (
            <p className="text-xs text-gold-400 font-semibold uppercase tracking-wide">{story.city}</p>
          )}
        </div>
      </div>
      <p className="text-white/70 text-sm leading-relaxed">"{story.story}"</p>
    </div>
  );
}
