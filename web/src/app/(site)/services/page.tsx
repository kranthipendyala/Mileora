import type { Metadata } from "next";
import Link from "next/link";
import * as Lucide from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { getActiveCategories } from "@/lib/categories";

export const metadata: Metadata = buildMetadata({
  title: "All Services — Find a Verified Guide",
  description: "Browse every Mileora service category — Vedic astrology, numerology, vasthu, jothisyam, online puja, kundli matching, tarot, daily horoscope, remedial pujas. Pick a category and find a verified guide.",
  path: "/services",
});

export default async function ServicesIndex() {
  const { rows, live } = await getActiveCategories();

  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,58,160,0.25),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">
            Mileora services
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Find the <span className="text-gradient-gold">right guide</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            Every service category on Mileora. Pick what you need and we'll show you the verified guides offering it.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => {
            const Icon = (Lucide as Record<string, React.ComponentType<{ className?: string }>>)[c.icon ?? "Sparkles"] ?? Lucide.Sparkles;
            return (
              <Link
                key={c.slug}
                href={`/services/${c.slug}`}
                className="group rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-7 transition-all hover:-translate-y-1 hover:border-[color:var(--color-gold-500)]/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-bg-elev)] ring-1 ring-[color:var(--color-gold-500)]/20">
                  <Icon className="h-6 w-6 text-[color:var(--color-gold-300)]" aria-hidden />
                </div>
                <h2 className="mt-5 font-[family-name:var(--font-cormorant)] text-2xl">{c.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-[color:var(--color-text-muted)]">{c.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-[color:var(--color-gold-100)]">
                    {c.active_guide_count && c.active_guide_count > 0
                      ? `${c.active_guide_count} guide${c.active_guide_count > 1 ? "s" : ""}`
                      : "Find a guide →"}
                  </span>
                  <span className="text-[color:var(--color-text-muted)]">{c.active_service_count ?? 0} offerings</span>
                </div>
              </Link>
            );
          })}
        </div>
        {!live && (
          <p className="mx-auto mt-8 max-w-7xl text-center text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
            Showing fallback catalog — connect the CI3 backend to see live counts
          </p>
        )}
      </section>
    </div>
  );
}
