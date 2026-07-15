"use client";

import { useEffect, useState } from "react";
import { KeyRound, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import { Field, Input } from "@/components/FormFields";

export default function AccountSettings() {
  const { user, refresh } = useAuth();

  const [phone, setPhone] = useState("");
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user?.phone]);

  const savePhone = async (e) => {
    e.preventDefault();
    setPhoneError("");
    setPhoneSaving(true);
    try {
      const res = await fetch("/api/auth/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Phone number update nahi ho saka.");
      await refresh();
      setPhoneSaved(true);
      setTimeout(() => setPhoneSaved(false), 2500);
    } catch (err) {
      setPhoneError(err.message);
    } finally {
      setPhoneSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Naya password aur confirm password match nahi kar rahay.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update nahi ho saka.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Account Settings</h1>
      <p className="text-ink-600 text-sm mb-8">Update your phone number or change your password.</p>

      <form onSubmit={savePhone} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8 mb-6">
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-5 flex items-center gap-2">
          <Phone size={18} className="text-maroon-500" /> Phone Number
        </h2>
        {phoneError && (
          <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{phoneError}</p>
        )}
        <Field label="Phone Number">
          <Input
            type="tel"
            placeholder="03xx-xxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={phoneSaving}>{phoneSaving ? "Saving..." : "Update Phone Number"}</Button>
          {phoneSaved && <span className="text-sm text-green-600 font-semibold">Phone number updated successfully.</span>}
        </div>
      </form>

      <form onSubmit={savePassword} className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-5 flex items-center gap-2">
          <KeyRound size={18} className="text-maroon-500" /> Change Password
        </h2>
        {passwordError && (
          <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">{passwordError}</p>
        )}
        <Field label="Current Password">
          <Input
            type="password"
            placeholder="••••••••"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            required
          />
        </Field>
        <Field label="New Password">
          <Input
            type="password"
            placeholder="••••••••"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            required
          />
        </Field>
        <Field label="Confirm New Password">
          <Input
            type="password"
            placeholder="••••••••"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            required
          />
        </Field>
        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={passwordSaving}>{passwordSaving ? "Saving..." : "Update Password"}</Button>
          {passwordSaved && <span className="text-sm text-green-600 font-semibold">Password updated successfully.</span>}
        </div>
      </form>
    </div>
  );
}
