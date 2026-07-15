"use client";

import { useEffect, useState } from "react";

// These defaults exactly match what used to be hardcoded across the site, so
// nothing visually changes until an admin edits a value from
// /admin/settings. Every consumer merges its fetched settings on top of this
// object, meaning a page never has to know whether Settings exist yet.
export const DEFAULT_SETTINGS = {
  siteName: "Nikah Manzil",
  whatsappNumber: "923001234567",
  heroBadge: "Trusted by Serious Families",
  heroTitlePrefix: "Find Your Perfect",
  heroTitleHighlight: "Life Partner",
  heroSubtitle:
    "Trusted matrimonial platform for serious families — verified profiles, respectful matchmaking and complete privacy protection.",
  heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=70",
  heroImages: [],
  heroPrimaryBtnText: "Register Now",
  heroSecondaryBtnText: "Browse Profiles",
  registrationFee: 1000,
  paymentAccounts: [
    {
      id: 1,
      type: "Bank Account",
      label: "Meezan Bank — Nikah Manzil (Pvt) Ltd",
      details: "Account #: 0110-1234567-001 · IBAN: PK36MEZN0001101234567001",
    },
    { id: 2, type: "Mobile Wallet", label: "JazzCash", details: "0300-1234567 — Nikah Manzil Services" },
    { id: 3, type: "Mobile Wallet", label: "EasyPaisa", details: "0300-1234567 — Nikah Manzil Services" },
  ],
};

// Lightweight client hook — fetches /api/settings once and merges over the
// defaults above. Safe to call from any "use client" component.
export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (!cancelled && data?.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch {
        // Keep defaults on failure — never break the page over a settings fetch.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loaded };
}
