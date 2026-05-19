import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Users } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "About Mileora — Our Story",
  description:
    "Mileora is a premium spiritual-services platform connecting seekers with verified astrologers, numerologists, vasthu guides, and sacred temple pujas across India.",
  path: "/about",
});

const STATS = [
  { v: "1,00,000+", k: "Seekers guided" },
  { v: "100+", k: "Verified guides" },
  { v: "30,000+", k: "Pujas delivered" },
  { v: "4.9 / 5", k: "Average rating" },
];

const VALUES = [
  { Icon: ShieldCheck, t: "Verified, never algorithmic", d: "Every astrologer is background-checked and scripture-trained. No bots, no AI-generated readings." },
  { Icon: Heart, t: "Sacred, not transactional", d: "We design every interaction — from sankalpam to prasad delivery — with reverence, not just convenience." },
  { Icon: Users, t: "Built for the diaspora too", d: "From Chennai to Chicago, our platform brings the temples and traditions of India to wherever you are." },
  { Icon: Sparkles, t: "Tradition, modern delivery", d: "Ancient wisdom delivered through video calls, live streams, and PDFs you can revisit anytime." },
];

export default function About() {
  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />

      {/* Hero */}
      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,58,160,0.3),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Our story</p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Bridging <span className="text-gradient-gold">5,000-year wisdom</span> and modern lives
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            Mileora was born from a simple frustration — finding a trustworthy astrologer or arranging an authentic puja shouldn't feel like guesswork. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-lg text-[color:var(--color-text)]/90 leading-relaxed">
          <p>
            India has more than a million practicing astrologers. Many are extraordinary. Many are not. There has never been a reliable way for a seeker — especially one outside their hometown or community — to know which is which.
          </p>
          <p>
            At the same time, the temples that anchor our spiritual life are increasingly out of reach. Distance, work, mobility, and the diaspora have all made it harder to walk into a temple on the right tithi, sit at the priest's feet, and ask for guidance.
          </p>
          <p>
            <span className="text-[color:var(--color-gold-100)]">Mileora exists to close both gaps.</span> A vetted marketplace of scripture-trained astrologers. Authentic pujas at India's most sacred temples, performed in your name and live-streamed to your screen. Free tools — kundli, numerology, daily horoscope — to begin the journey without spending a rupee.
          </p>
          <p>
            We are not a typical tech company. We are seekers building for seekers — with the rigor of modern engineering and the reverence of an old tradition.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[color:var(--color-border)]/60 bg-[color:var(--color-bg-elev)]/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.k} className="text-center">
              <p className="font-[family-name:var(--font-cormorant)] text-4xl text-gradient-gold sm:text-5xl">{s.v}</p>
              <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">What we stand for</p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">
              Four <span className="text-gradient-gold">non-negotiables</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {VALUES.map((v) => {
              const Icon = v.Icon;
              return (
                <div key={v.t} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-bg-elev)] ring-1 ring-[color:var(--color-gold-500)]/30">
                    <Icon className="h-6 w-6 text-[color:var(--color-gold-300)]" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-cormorant)] text-2xl">{v.t}</h3>
                  <p className="mt-2 text-[color:var(--color-text-muted)]">{v.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-10 text-center shadow-[var(--shadow-glow)] sm:p-14">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl tracking-tight sm:text-4xl">
            Begin your journey with a <span className="text-gradient-gold">free kundli</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[color:var(--color-text-muted)]">
            No payment, no signup. We'll cast your Vedic birth chart in 60 seconds.
          </p>
          <Link
            href="/free/kundli"
            className="mt-7 inline-block rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
          >
            Get my free kundli
          </Link>
        </div>
      </section>
    </div>
  );
}
