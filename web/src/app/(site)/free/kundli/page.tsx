import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { KundliForm } from "./kundli-form";
import { Sparkles, Check } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Free Online Kundli — Vedic Birth Chart in 60 Seconds",
  description:
    "Get your free Vedic kundli (birth chart) with rasi, navamsa, current dasha period and personalized predictions. No payment, no signup needed.",
  path: "/free/kundli",
});

export default function FreeKundli() {
  return (
    <div className="bg-cosmic">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Free tools", path: "/free/kundli" },
          { name: "Kundli", path: "/free/kundli" },
        ])}
      />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-1 text-xs text-[color:var(--color-gold-100)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> 100% free · No payment · No signup
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
              Your <span className="text-gradient-gold">free Vedic kundli</span> — in 60 seconds
            </h1>
            <p className="mt-5 text-lg text-[color:var(--color-text-muted)]">
              Enter your birth details and we'll cast your Vedic birth chart instantly. Includes rasi, navamsa, current dasha period, and a personalized snapshot from our experts.
            </p>
            <ul className="mt-8 space-y-3 text-[color:var(--color-text)]">
              {[
                "Vedic birth chart with rasi & navamsa kattam",
                "Current and upcoming dasha / antardasha",
                "Lucky days, colors, and gemstone for the next month",
                "Free PDF download — yours to keep",
              ].map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold-300)]" aria-hidden />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex items-center gap-2 text-sm text-[color:var(--color-text-muted)]">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-[color:var(--color-bg)] bg-gradient-to-br from-[color:var(--color-gold-300)] to-[color:var(--color-vedic-violet)]" />
                ))}
              </div>
              <span>Joined by 12,400+ seekers in the last 30 days</span>
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-glow)] sm:p-9">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Generate my kundli</h2>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Takes 60 seconds. Your data stays private.</p>
            <KundliForm />
          </div>
        </div>
      </section>
    </div>
  );
}
