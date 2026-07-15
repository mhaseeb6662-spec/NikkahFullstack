"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Users, Lock, HeadphonesIcon, UserPlus, FileEdit,
  CreditCard, BadgeCheck, Sparkles, ArrowRight,
} from "lucide-react";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Slider from "@/components/Slider";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import { useSiteSettings } from "@/lib/siteSettings";

const features = [
  { icon: ShieldCheck, title: "Verified Profiles", desc: "Every profile is manually reviewed and approved by our admin team before activation." },
  { icon: Users, title: "Family-Oriented Matchmaking", desc: "Built for families, not casual browsing — proposals are handled with respect and seriousness." },
  { icon: Lock, title: "Secure Registration", desc: "Contact numbers and hidden photos stay private until access is mutually approved." },
  { icon: HeadphonesIcon, title: "Professional Support", desc: "Our team is available to guide families through every step of the process." },
];

const steps = [
  { icon: UserPlus, title: "Create Account", desc: "Sign up with your email and phone number in seconds." },
  { icon: FileEdit, title: "Complete Profile", desc: "Fill in personal, education, career and family details — all on the same form." },
  { icon: CreditCard, title: "Pay Registration Fee", desc: "A one-time fee of PKR 1,000 — no monthly or yearly charges." },
  { icon: ShieldCheck, title: "Admin Verification", desc: "Our team reviews and verifies your submitted information." },
  { icon: BadgeCheck, title: "Profile Activated", desc: "Your verified profile goes live and becomes searchable." },
];

// Home page shown to visitors who are NOT logged in.
// Intentionally does NOT include the "Active Verified Profiles" browsing
// section — that is only available to logged-in members on their own home page.
export default function LoggedOutHome() {
  const { settings } = useSiteSettings();
  const [successStories, setSuccessStories] = useState([]);

  useEffect(() => {
    fetch("/api/success-stories")
      .then((res) => res.json())
      .then((data) => setSuccessStories(data.stories || []))
      .catch(() => setSuccessStories([]));
  }, []);

  // Hero banner slider — pulls from the images the admin has uploaded
  // (settings.heroImages). Falls back to the single settings.heroImage field
  // if the admin hasn't added slider images yet.
  const heroImages = useMemo(() => {
    if (Array.isArray(settings.heroImages) && settings.heroImages.length > 0) {
      return settings.heroImages;
    }
    return settings.heroImage ? [settings.heroImage] : [];
  }, [settings.heroImages, settings.heroImage]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        {heroImages.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.img
              key={heroImages[heroIndex]}
              src={heroImages[heroIndex]}
              alt="Nikah Manzil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 via-ink-900/65 to-ink-900/90" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(196,64,107,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(184,146,74,0.25), transparent 50%)",
          }}
        />
        <svg
          className="absolute -right-24 -top-24 w-[520px] h-[520px] opacity-[0.08] pointer-events-none"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="95" fill="none" stroke="#B8924A" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="#B8924A" strokeWidth="1" />
          <circle cx="100" cy="100" r="55" fill="none" stroke="#B8924A" strokeWidth="0.75" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-gold-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-6"
          >
            <Sparkles size={14} /> {settings.heroBadge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] max-w-4xl mx-auto"
          >
            {settings.heroTitlePrefix} <span className="bg-gradient-to-r from-rose-400 to-gold-400 bg-clip-text text-transparent">{settings.heroTitleHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-white/70 text-base sm:text-lg max-w-2xl mx-auto"
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-row flex-nowrap items-center justify-center gap-2.5 sm:gap-4"
          >
            <Button
              to="/register"
              variant="gold"
              size="lg"
              className="!px-4 !py-2.5 !text-xs sm:!px-8 sm:!py-4 sm:!text-lg whitespace-nowrap"
            >
              {settings.heroPrimaryBtnText} <ArrowRight size={18} className="hidden sm:inline" />
            </Button>
            <Button
              to="/login"
              variant="outline"
              size="lg"
              className="!border-white/40 !text-white hover:!bg-white hover:!text-ink-900 !px-4 !py-2.5 !text-xs sm:!px-8 sm:!py-4 sm:!text-lg whitespace-nowrap"
            >
              Login To Browse Profiles
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              ["1,248+", "Registered Families"],
              ["864", "Active Profiles"],
              ["132", "Success Stories"],
              ["100%", "Verified Process"],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">{num}</p>
                <p className="text-white/50 text-xs sm:text-sm mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-blush-50 to-transparent" />
      </section>

      {/* Features / trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <SectionHeading
          eyebrow="Why Families Trust Us"
          title="Built On Trust, Privacy & Respect"
          subtitle="Everything about our platform is designed to give both families peace of mind."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-ink-900/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="w-12 h-12 rounded-xl bg-maroon-500/10 text-maroon-500 flex items-center justify-center mb-4">
                <Icon size={22} />
              </span>
              <h3 className="font-display text-xl font-semibold text-ink-900 mb-2">{title}</h3>
              <p className="text-sm text-ink-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Registration steps */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple Process"
            title="Registration In 5 Easy Steps"
            subtitle="A one-time registration fee of PKR 1,000 — no monthly charges, no yearly subscription, no hidden fees."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative text-center px-2"
              >
                <div className="relative mx-auto w-16 h-16 rounded-full bg-blush-100 border-2 border-gold-500/40 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-maroon-500" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-maroon-500 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">{title}</h3>
                <p className="text-sm text-ink-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories slider — populated live from stories the admin publishes */}
      {successStories.length > 0 && (
        <section className="bg-ink-900 py-16 md:py-24 relative overflow-hidden mt-12">
          <svg className="absolute -left-20 -bottom-20 w-96 h-96 opacity-[0.06]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#B8924A" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#B8924A" strokeWidth="1" />
          </svg>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Real Families, Real Stories"
              title="Success Stories"
              subtitle="A few of the families who found their perfect match through Nikah Manzil."
              light
            />
            <Slider itemBasis="basis-[88%] sm:basis-[60%] lg:basis-[38%]">
              {successStories.map((s) => (
                <SuccessStoryCard key={s._id} story={s} />
              ))}
            </Slider>
          </div>
        </section>
      )}

    </div>
  );
}