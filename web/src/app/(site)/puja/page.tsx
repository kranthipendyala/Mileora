import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/components/seo/json-ld";
import { PujaCard } from "@/components/cards/puja-card";
import { PUJAS } from "@/lib/mock-data";

export const metadata: Metadata = buildMetadata({
  title: "Online Puja Booking — Authentic Rituals at Famous Temples",
  description:
    "Book authentic pujas at India's most sacred temples — live stream, sankalpam in your name, prasad delivered. Kashi Vishwanath, Tirupati, Mahalakshmi & more on Mileora.",
  path: "/puja",
});

export default function PujaCatalog() {
  const featured = PUJAS.filter((p) => p.featured);
  const others = PUJAS.filter((p) => !p.featured);

  return (
    <div className="bg-cosmic">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Puja & Rituals", path: "/puja" },
          ]),
          serviceJsonLd("Online Puja Booking", "Book authentic pujas at famous Indian temples — live streamed in your name with prasad delivery.", "/puja"),
        ]}
      />

      {/* Hero */}
      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-14 sm:px-6 lg:px-8 lg:pt-28">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,122,0,0.18),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] ring-1 ring-[color:var(--color-gold-500)]/30">
            <Flame className="h-7 w-7 text-[color:var(--color-gold-300)]" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Online puja booking</p>
          <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Sacred rituals, <span className="text-gradient-gold">delivered to your devotion.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            Authentic pujas at India's most sacred temples — performed by hereditary priests, live streamed in your name, with prasad shipped to your home in 2–4 days.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Featured pujas</h2>
            <span className="text-sm text-[color:var(--color-text-muted)]">{featured.length} sacred rituals</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <PujaCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {/* All */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 font-[family-name:var(--font-cormorant)] text-3xl">More pujas</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => <PujaCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {/* How it works strip */}
      <section className="border-y border-[color:var(--color-border)]/60 bg-[color:var(--color-bg-elev)]/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-[family-name:var(--font-cormorant)] text-3xl">How online puja works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { t: "Choose a puja", d: "Pick from temple-verified pujas above." },
              { t: "Share sankalpam", d: "Your name, gotra, and intention." },
              { t: "Live stream", d: "Watch the puja performed in real-time." },
              { t: "Prasad delivery", d: "Tirumankalyam, kumkum, prasad — 2–4 days." },
            ].map((s, i) => (
              <li key={i} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5 text-center">
                <div className="font-[family-name:var(--font-cormorant)] text-4xl text-gradient-gold">{i + 1}</div>
                <h3 className="mt-2 font-medium text-[color:var(--color-text)]">{s.t}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
