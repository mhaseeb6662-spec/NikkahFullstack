"use client";

import { useEffect, useState } from "react";
import { Landmark, Smartphone, UploadCloud, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useNavigate } from "@/lib/router-compat";
import { Field, Input } from "@/components/FormFields";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useSiteSettings } from "@/lib/siteSettings";

const iconFor = (type) => (type === "Bank Account" ? Landmark : Smartphone);

export default function Payment() {
  const { user, loading: authLoading, refresh } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [latestPayment, setLatestPayment] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [screenshotData, setScreenshotData] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login?next=/payment");
      return;
    }
    if (user.status === "active") {
      navigate("/");
      return;
    }
    if (!user.profileComplete) {
      navigate("/complete-profile");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/payments");
        const data = await res.json();
        const payments = data.payments || [];
        setLatestPayment(payments[0] || null);
      } catch {
        // ignore — form will just be shown
      } finally {
        setChecking(false);
      }
    })();
  }, [authLoading, user]);

  // While the member is waiting on the "pending review" screen, quietly
  // re-check their approval status every few seconds. As soon as an admin
  // approves them, this picks it up and the effect above redirects them
  // straight to the full site — no manual refresh or re-login needed.
  useEffect(() => {
    if (authLoading || !user || user.status === "active") return;
    const interval = setInterval(() => {
      refresh();
    }, 8000);
    return () => clearInterval(interval);
  }, [authLoading, user, refresh]);

  if (authLoading || checking) {
    return <div className="min-h-[60vh] flex items-center justify-center text-ink-400 text-sm">Loading...</div>;
  }

  const pendingReview = submitted || latestPayment?.status === "pending";
  const rejected = latestPayment?.status === "rejected" && !submitted;

  if (pendingReview) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-ink-900/5 p-10 text-center">
          <span className="w-16 h-16 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center mx-auto mb-5">
            <Clock size={30} />
          </span>
          <h1 className="font-display text-2xl font-semibold text-ink-900 mb-2">
            Payment Submitted
          </h1>
          <p className="text-ink-600 text-sm mb-6">
            Your payment is under review. Our admin team verifies transactions
            within 24 hours — once approved your profile will be activated
            and you'll get full access to Nikah Manzil.
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gold-500/10 text-gold-600 px-4 py-2 rounded-full">
            Status: Pending Approval
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-rose-500">Final Step</span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mt-2">
            Registration Fee Payment
          </h1>
          <p className="text-ink-600 text-sm mt-2">
            One-time fee of <span className="font-semibold text-maroon-500">PKR {Number(settings.registrationFee || 1000).toLocaleString()}</span> — no monthly or yearly charges.
          </p>
        </div>

        {rejected && (
          <div className="max-w-2xl mx-auto mb-8 flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            <XCircle size={18} className="text-rose-600 shrink-0" />
            <p className="text-sm text-rose-700">
              Your previous payment was rejected{latestPayment?.notes ? `: ${latestPayment.notes}` : "."} Please submit valid payment proof again.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-ink-900/5 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-5">Choose A Payment Method</h2>
            <div className="space-y-4">
              {(settings.paymentAccounts || []).map((acc) => {
                const Icon = iconFor(acc.type);
                return (
                  <div key={acc.id} className="flex items-start gap-3 p-4 rounded-xl border border-ink-900/10 hover:border-maroon-500/40 transition-colors">
                    <span className="w-10 h-10 rounded-lg bg-maroon-500/10 text-maroon-500 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{acc.label}</p>
                      <p className="text-xs text-ink-600 mt-0.5">{acc.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              try {
                const res = await fetch("/api/payments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: Number(settings.registrationFee || 1000),
                    method: "Manual Transfer",
                    transactionId,
                    screenshot: screenshotData,
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Payment submit nahi ho saka.");
                await refresh();
                setSubmitted(true);
              } catch (err) {
                setError(err.message || "Payment submit nahi ho saka.");
              } finally {
                setLoading(false);
              }
            }}
            className="bg-white rounded-3xl shadow-sm border border-ink-900/5 p-6 sm:p-8"
          >
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-5">Submit Payment Proof</h2>
            {error && (
              <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}
            <Field label="Transaction ID">
              <Input
                placeholder="Enter transaction / reference ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
            </Field>
            <Field label="Payment Screenshot">
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-ink-900/15 rounded-xl py-8 cursor-pointer hover:border-maroon-500/40 transition-colors">
                <UploadCloud size={24} className="text-ink-400" />
                <span className="text-sm text-ink-600">
                  {fileName || "Click to upload screenshot"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  required={!screenshotData}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFileName(file.name);
                    const reader = new FileReader();
                    reader.onload = () => setScreenshotData(reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </Field>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              <CheckCircle2 size={16} /> {loading ? "Submitting..." : "Submit For Review"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
