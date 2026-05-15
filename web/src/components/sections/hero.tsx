import Link from "next/link";
import { Sparkles, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-grain relative isolate overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-1 text-xs text-[color:var(--color-gold-100)] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Trusted by 1,00,000+ seekers · Verified astrologers
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          The cosmos has answers.{" "}
          <span className="text-gradient-gold">Mileora connects you to them.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
          Vedic astrology, numerology, vasthu, jothisyam, and online puja — guided by handpicked experts. Get your free
          kundli in 60 seconds, or talk to an astrologer right now.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/free/kundli"
            className="rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] shadow-[var(--shadow-glow)] hover:bg-[color:var(--color-gold-300)] transition-colors"
          >
            Get my free kundli
          </Link>
          <Link
            href="/astrologers"
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-6 py-3 text-base font-medium text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)] transition-colors"
          >
            Talk to an astrologer
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-1 text-sm text-[color:var(--color-text-muted)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]" aria-hidden />
          ))}
          <span className="ml-2">4.9 / 5 from 12,400+ reviews</span>
        </div>
      </div>
    </section>
  );
}
