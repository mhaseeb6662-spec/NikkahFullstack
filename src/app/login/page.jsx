"use client";

import { Suspense, useState } from "react";
import { useNavigate, useSearchParams } from "@/lib/router-compat";
import { LogIn } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/Button";
import { Field, Input } from "@/components/FormFields";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user.role === "admin") {
        navigate(next && next.startsWith("/admin") ? next : "/admin");
      } else if (!user.profileComplete) {
        // Profile not created yet — send to the profile-creation form first.
        navigate("/complete-profile");
      } else if (user.status !== "active") {
        // Profile done, payment still pending/under review.
        navigate("/payment");
      } else if (next && next.startsWith("/dashboard")) {
        navigate(next);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to manage your profile and view your matches."
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
            {error}
          </p>
        )}
        <Field label="Email">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" className="rounded border-ink-900/20 text-maroon-500 focus:ring-maroon-500/40" />
            Remember me
          </label>
          <a href="#" className="text-sm font-semibold text-maroon-500 hover:underline">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          <LogIn size={16} /> {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-sm text-ink-600 mt-5">
          Don't have an account?{" "}
          <a href="/register" className="text-maroon-500 font-semibold hover:underline">Register</a>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
