import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = buildMetadata({
  title: "Sign in to Mileora",
  description: "Sign in with your phone number to access bookings, kundli history, and personalized recommendations.",
  path: "/login",
  noindex: true,
});

export default function Login() {
  return (
    <div className="bg-cosmic min-h-[calc(100dvh-4rem)] grid place-items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] ring-1 ring-[color:var(--color-gold-500)]/30">
            <Sparkles className="h-7 w-7 text-[color:var(--color-gold-300)]" aria-hidden />
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
            Welcome to <span className="text-gradient-gold">Mileora</span>
          </h1>
          <p className="mt-2 text-[color:var(--color-text-muted)]">Sign in with your phone — no password to remember.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-card)]">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-[color:var(--color-text-muted)]">
          Are you a Mileora{" "}
          <Link href="/guide/login" className="text-[color:var(--color-gold-100)] underline">guide</Link> or{" "}
          <Link href="/admin/login" className="text-[color:var(--color-gold-100)] underline">admin</Link>?
        </p>

        <p className="mt-4 text-center text-xs text-[color:var(--color-text-muted)]">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" className="text-[color:var(--color-gold-100)] underline">Terms</Link> and{" "}
          <Link href="/legal/privacy" className="text-[color:var(--color-gold-100)] underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
