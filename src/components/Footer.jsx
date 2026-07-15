"use client";

import { Link } from "@/lib/router-compat";
import { Heart, Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";

function formatPhoneDisplay(digits) {
  if (!digits) return "";
  return `+${digits}`.replace(/^\+(\d{2})(\d{3})(\d+)$/, "+$1 $2 $3");
}

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/active-profiles", label: "Active Profiles" },
      { to: "/search", label: "Search Profiles" },
      { to: "/success-stories", label: "Success Stories" },
      { to: "/about", label: "About Us" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/register", label: "Register" },
      { to: "/login", label: "Login" },
      { to: "/dashboard", label: "My Profile" },
      { to: "/payment", label: "Registration Fee" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
];

export default function Footer() {
  const { settings } = useSiteSettings();
  return (
    <footer className="bg-ink-900 text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-maroon-500 to-rose-500 flex items-center justify-center text-white">
                <Heart size={16} fill="white" />
              </span>
              <span className="font-display text-xl font-bold text-white">{settings.siteName}</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-5">
              A trusted matrimonial platform for serious families — verified
              profiles, respectful matchmaking, and complete privacy
              protection every step of the way.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-maroon-500 hover:text-white transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-white font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-gold-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" /> Multan, Punjab, Pakistan</li>
              <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0 text-gold-400" /> {formatPhoneDisplay(settings.whatsappNumber)}</li>
              <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0 text-gold-400" /> support@nikahmanzil.pk</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/40 px-4">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
