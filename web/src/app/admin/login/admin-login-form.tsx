"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSession } from "@/lib/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    // TODO: POST /api/auth/admin-login -> CI3 /auth/admin-login -> { token, profile, role: 'admin' }
    // Demo mode: any valid-looking email/password signs in.
    setTimeout(() => {
      setSession("admin", "demo-admin-jwt", {
        id: 1,
        name: email.split("@")[0],
        email,
        role: "admin",
      });
      setSubmitting(false);
      router.push("/admin");
    }, 700);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@mileora.com"
          className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none focus:border-rose-400/60"
          autoComplete="email"
          autoFocus
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none focus:border-rose-400/60"
          autoComplete="current-password"
        />
      </label>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-rose-500 px-4 py-3 text-base font-medium text-white hover:bg-rose-400 disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in to admin"}
      </button>
      <p className="text-center text-xs text-[color:var(--color-text-muted)]">
        Demo mode — wire <code>/api/auth/admin-login</code> to authenticate against the CI3 backend.
      </p>
    </form>
  );
}
