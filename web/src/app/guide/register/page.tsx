import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { GuideRegisterForm } from "./guide-register-form";

export const metadata: Metadata = buildMetadata({
  title: "Become a Mileora Guide",
  description: "Apply to join Mileora as a verified astrologer, numerologist, vasthu guide, jothidar, or puja provider.",
  path: "/guide/register",
  noindex: true,
});

const PERKS = [
  "Reach 1,00,000+ Mileora seekers across India and the diaspora",
  "Set your own pricing, slots, and languages",
  "Weekly payouts via UPI / NEFT, transparent fee structure",
  "Live calendar + booking dashboard",
  "Verified-guide badge after KYC + reference checks",
];

export default function GuideRegister() {
  return (
    <div className="min-h-dvh px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        {/* Left — pitch */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-1 text-xs text-[color:var(--color-gold-100)]">
            <Briefcase className="h-3.5 w-3.5" aria-hidden /> Guide onboarding · ~5 minutes
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Share your <span className="text-gradient-gold">wisdom</span> with Mileora
          </h1>
          <p className="mt-5 text-lg text-[color:var(--color-text-muted)]">
            Join 100+ scripture-trained astrologers and pujari already on Mileora. Tell us about your practice and we'll review within 48 hours.
          </p>
          <ul className="mt-8 space-y-3 text-[color:var(--color-text)]">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold-300)]" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-[color:var(--color-text-muted)]">
            Already a guide?{" "}
            <Link href="/guide/login" className="text-[color:var(--color-gold-100)] underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right — form */}
        <div className="rounded-3xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-glow)] sm:p-9">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Application</h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">All fields are required unless marked optional.</p>
          <GuideRegisterForm />
        </div>
      </div>
    </div>
  );
}
