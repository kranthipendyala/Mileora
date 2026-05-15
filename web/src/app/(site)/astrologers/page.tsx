import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { AstrologerCard } from "@/components/cards/astrologer-card";
import { ASTROLOGERS } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Talk to Verified Astrologers — Vedic, Numerology, Vasthu, Jothisyam",
  description:
    "Browse 100+ verified Vedic astrologers, numerologists, vasthu experts and Tamil jothidars on Mileora. Live consultation by call or video, satisfaction guaranteed.",
  path: "/astrologers",
});

export default function AstrologersList() {
  return (
    <div className="bg-cosmic">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Astrologers", path: "/astrologers" },
        ])}
      />

      {/* Hero */}
      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-28">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,58,160,0.25),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">
            All experts are background-checked
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Talk to a <span className="text-gradient-gold">verified astrologer</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            100+ scripture-trained experts across Vedic, jothisyam, numerology and vasthu. Filter by language, specialty, and price — book in under a minute.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-muted)]" aria-hidden />
              <input
                type="search"
                placeholder="Search by name or specialty…"
                className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 py-2.5 pl-10 pr-3 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
              />
            </label>
            <select className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none">
              <option>All specialties</option>
              <option>Vedic</option>
              <option>Jothisyam</option>
              <option>Numerology</option>
              <option>Vasthu</option>
              <option>KP</option>
              <option>Tarot</option>
            </select>
            <select className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none">
              <option>All languages</option>
              <option>English</option>
              <option>Tamil</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Kannada</option>
              <option>Bengali</option>
            </select>
            <select className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none">
              <option>Sort: Top rated</option>
              <option>Sort: Price (low → high)</option>
              <option>Sort: Most experienced</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <p className="text-sm text-[color:var(--color-text-muted)]">
              Showing <span className="text-[color:var(--color-text)]">{ASTROLOGERS.length}</span> verified astrologers
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ASTROLOGERS.map((a) => <AstrologerCard key={a.slug} a={a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
