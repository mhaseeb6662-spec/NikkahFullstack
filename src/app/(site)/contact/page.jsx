"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Field, Input, Textarea } from "@/components/FormFields";
import Button from "@/components/Button";
import { useSiteSettings } from "@/lib/siteSettings";

function formatPhoneDisplay(digits) {
  if (!digits) return "";
  return `+${digits}`.replace(/^\+(\d{2})(\d{3})(\d+)$/, "+$1 $2 $3");
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { settings } = useSiteSettings();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <SectionHeading
        eyebrow="We're Here To Help"
        title="Contact Us"
        subtitle="Have a question about registration, verification, or your profile? Reach out anytime."
      />
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          {[
            [MapPin, "Our Office", "Multan, Punjab, Pakistan"],
            [Phone, "Call Us", formatPhoneDisplay(settings.whatsappNumber)],
            [Mail, "Email Us", "support@nikahmanzil.pk"],
            [MessageCircle, "WhatsApp", formatPhoneDisplay(settings.whatsappNumber)],
          ].map(([Icon, title, value]) => (
            <div key={title} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-5 flex items-start gap-4">
              <span className="w-11 h-11 rounded-xl bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
                <Icon size={19} />
              </span>
              <div>
                <p className="font-semibold text-ink-900 text-sm">{title}</p>
                <p className="text-ink-600 text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-3 bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-10">
              <h3 className="font-display text-2xl font-semibold text-ink-900 mb-2">Message Sent!</h3>
              <p className="text-ink-600 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid sm:grid-cols-2 gap-x-4">
                <Field label="Full Name"><Input placeholder="Your name" required /></Field>
                <Field label="Email Address"><Input type="email" placeholder="you@example.com" required /></Field>
              </div>
              <Field label="Subject"><Input placeholder="How can we help?" required /></Field>
              <Field label="Message">
                <Textarea placeholder="Write your message..." required />
              </Field>
              <Button type="submit" className="w-full mt-2">
                <Send size={16} /> Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
