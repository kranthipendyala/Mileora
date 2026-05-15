import type { Metadata } from "next";
import { Heart, Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { CompatibilityForm } from "./compatibility-form";

export const metadata: Metadata = buildMetadata({
  title: "Free Kundli Match — 36-Guna Porutham Compatibility",
  description: "Free Vedic kundli matching with 36-guna porutham analysis. Check compatibility for marriage instantly.",
  path: "/free/compatibility",
});

export default function FreeCompatibility() {
  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Compatibility", path: "/free/compatibility" }])} />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,71,106,0.25),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-1 text-xs text-[color:var(--color-gold-100)]">
            <Heart className="h-3.5 w-3.5" aria-hidden /> 100% free · No payment · Instant
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            <span className="text-gradient-gold">Kundli matching</span> — 36 guna porutham
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            Enter both birth details for an instant Vedic compatibility report — varna, vashya, tara, yoni, graha maitri, gana, bhakoot, and nadi.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-glow)] sm:p-9">
          <CompatibilityForm />
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-[family-name:var(--font-cormorant)] text-3xl">What's included in your free report</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "All 8 ashtakoota gunas scored individually",
              "Total guna score out of 36 with interpretation",
              "Mangal dosha (kuja dosham) check for both",
              "Nadi compatibility (the most weighted guna)",
              "Detailed remedies if any dosha is present",
              "Free PDF download you can print and share",
            ].map((it) => (
              <div key={it} className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold-300)]" aria-hidden />
                <span className="text-[color:var(--color-text)]">{it}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
