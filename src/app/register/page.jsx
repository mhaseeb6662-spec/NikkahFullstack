"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { UserPlus } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/Button";
import { Field, Input } from "@/components/FormFields";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password aur Confirm Password match nahi kar rahe.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password kam az kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);
    try {
      // Create the account only — no profile fields collected here.
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      // Automatically move the user into the profile-creation form next.
      navigate("/complete-profile");
    } catch (err) {
      setError(err.message || "Register nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Just your basic details to get started — you'll complete your profile in the next step."
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
            {error}
          </p>
        )}

        <Field label="Full Name">
          <Input placeholder="Enter your full name" value={form.name} onChange={update("name")} required />
        </Field>
        <Field label="Email Address">
          <Input type="email" placeholder="you@example.com" value={form.email} onChange={update("email")} required />
        </Field>
        <Field label="Phone Number">
          <Input type="tel" placeholder="03XX-XXXXXXX" value={form.phone} onChange={update("phone")} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password">
            <Input type="password" placeholder="••••••••" value={form.password} onChange={update("password")} required />
          </Field>
          <Field label="Confirm Password">
            <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={update("confirmPassword")} required />
          </Field>
        </div>

        <label className="flex items-start gap-2 text-xs text-ink-600 mb-6 mt-1">
          <input type="checkbox" required className="mt-0.5 rounded border-ink-900/20 text-maroon-500 focus:ring-maroon-500/40" />
          I agree to the{" "}
          <a href="/terms" className="text-maroon-500 font-semibold hover:underline">Terms & Conditions</a> and{" "}
          <a href="/privacy-policy" className="text-maroon-500 font-semibold hover:underline">Privacy Policy</a>.
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          <UserPlus size={16} /> {loading ? "Creating Your Account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-ink-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-maroon-500 font-semibold hover:underline">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
}
