import type { Metadata } from "next";
import { Calculator, Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { NumerologyForm } from "./numerology-form";

export const metadata: Metadata = buildMetadata({
  title: "Free Numerology Calculator — Life Path & Lucky Numbers",
  description: "Free instant numerology reading. Get your life path, destiny, soul-urge numbers + lucky days, colors and gemstone.",
  path: "/free/numerology",
});

export default function FreeNumerology() {
  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Free Numerology", path: "/free/numerology" }])} />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-1 text-xs text-[color:var(--color-gold-100)]">
              <Calculator className="h-3.5 w-3.5" aria-hidden /> 100% free · No payment · Instant
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
              <span className="text-gradient-gold">Numerology calculator</span> — instant
            </h1>
            <p className="mt-5 text-lg text-[color:var(--color-text-muted)]">
              Decode your life path, destiny, and soul-urge numbers from your name and date of birth — and see what each one means.
            </p>
            <ul className="mt-8 space-y-3 text-[color:var(--color-text)]">
              {[
                "Life path · destiny · soul-urge · personality numbers",
                "Personal year forecast for the next 12 months",
                "Lucky numbers, colors, days, and gemstone",
                "Free PDF download you can share",
              ].map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold-300)]" aria-hidden />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-glow)] sm:p-9">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Calculate my numbers</h2>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Use the name on your birth certificate for the most accurate reading.</p>
            <NumerologyForm />
          </div>
        </div>
      </section>
    </div>
  );
}
