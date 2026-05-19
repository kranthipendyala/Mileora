import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { GuideLoginForm } from "./guide-login-form";

export const metadata: Metadata = buildMetadata({
  title: "Guide Sign In",
  description: "Mileora guide portal — sign in to manage your bookings, calendar, and payouts.",
  path: "/guide/login",
  noindex: true,
});

export default function GuideLogin() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] ring-1 ring-[color:var(--color-gold-500)]/30">
            <Briefcase className="h-7 w-7 text-[color:var(--color-gold-300)]" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Guide portal</p>
          <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
            Welcome back, <span className="text-gradient-gold">guide</span>
          </h1>
          <p className="mt-2 text-[color:var(--color-text-muted)]">Sign in with your registered phone number.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-card)]">
          <GuideLoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-[color:var(--color-text-muted)]">
          New to Mileora?{" "}
          <Link href="/guide/register" className="text-[color:var(--color-gold-100)] underline">
            Apply to become a guide
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-[color:var(--color-text-muted)]">
          Are you a customer?{" "}
          <Link href="/login" className="text-[color:var(--color-gold-100)] underline">
            Customer sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
