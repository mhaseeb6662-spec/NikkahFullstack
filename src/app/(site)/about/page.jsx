"use client";

import { ShieldCheck, Users, Lock, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";

const values = [
  { icon: ShieldCheck, title: "Verification First", desc: "Every single profile is manually screened by our admin team before it goes live." },
  { icon: Lock, title: "Privacy By Design", desc: "Phone numbers and private photos stay hidden until both families agree to share." },
  { icon: Users, title: "Family Centered", desc: "We built this platform around how Pakistani families actually search for rishtas." },
  { icon: HeartHandshake, title: "Respectful Process", desc: "No pressure, no spam — just a dignified path toward a serious commitment." },
];

export default function About() {
  return (
    <div>
      <div className="bg-ink-900 py-16 md:py-20 text-center px-4">
        <span className="text-gold-400 text-xs font-bold tracking-[0.25em] uppercase">About Nikah Manzil</span>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white mt-3 max-w-2xl mx-auto">
          A Platform Built On Trust, For Serious Families
        </h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink-900 mb-4">Our Story</h2>
            <p className="text-ink-600 leading-relaxed mb-4">
              Nikah Manzil was founded with one simple belief: finding a life
              partner should be a respectful, transparent process — not a
              guessing game. We noticed families struggling with unverified
              listings, unwanted contact, and platforms that prioritized
              volume over trust.
            </p>
            <p className="text-ink-600 leading-relaxed">
              So we built a matrimonial platform where every profile is
              reviewed by real people, private information stays private
              until both sides agree, and a one-time fee replaces endless
              subscriptions.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=60"
            alt="Family gathering"
            className="rounded-3xl w-full h-80 object-cover shadow-lg"
          />
        </div>
        <SectionHeading eyebrow="What Guides Us" title="Our Core Values" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-ink-900/5 shadow-sm">
              <span className="w-12 h-12 rounded-xl bg-maroon-500/10 text-maroon-500 flex items-center justify-center mb-4">
                <Icon size={22} />
              </span>
              <h3 className="font-display text-lg font-semibold text-ink-900 mb-2">{title}</h3>
              <p className="text-sm text-ink-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Button to="/register" size="lg">Join Nikah Manzil Today</Button>
        </div>
      </div>
    </div>
  );
}
