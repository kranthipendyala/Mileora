import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Free Daily Horoscope — All 12 Zodiac Signs",
  description: "Daily horoscope for all 12 zodiac signs — Aries to Pisces. Vedic + Western readings, updated every morning at 6am IST.",
  path: "/free/horoscope",
});

const SIGNS = [
  { slug: "aries", name: "Aries", tamil: "மேஷம்", date: "Mar 21 – Apr 19", emoji: "♈" },
  { slug: "taurus", name: "Taurus", tamil: "ரிஷபம்", date: "Apr 20 – May 20", emoji: "♉" },
  { slug: "gemini", name: "Gemini", tamil: "மிதுனம்", date: "May 21 – Jun 20", emoji: "♊" },
  { slug: "cancer", name: "Cancer", tamil: "கடகம்", date: "Jun 21 – Jul 22", emoji: "♋" },
  { slug: "leo", name: "Leo", tamil: "சிம்மம்", date: "Jul 23 – Aug 22", emoji: "♌" },
  { slug: "virgo", name: "Virgo", tamil: "கன்னி", date: "Aug 23 – Sep 22", emoji: "♍" },
  { slug: "libra", name: "Libra", tamil: "துலாம்", date: "Sep 23 – Oct 22", emoji: "♎" },
  { slug: "scorpio", name: "Scorpio", tamil: "விருச்சிகம்", date: "Oct 23 – Nov 21", emoji: "♏" },
  { slug: "sagittarius", name: "Sagittarius", tamil: "தனுசு", date: "Nov 22 – Dec 21", emoji: "♐" },
  { slug: "capricorn", name: "Capricorn", tamil: "மகரம்", date: "Dec 22 – Jan 19", emoji: "♑" },
  { slug: "aquarius", name: "Aquarius", tamil: "கும்பம்", date: "Jan 20 – Feb 18", emoji: "♒" },
  { slug: "pisces", name: "Pisces", tamil: "மீனம்", date: "Feb 19 – Mar 20", emoji: "♓" },
];

const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function FreeHoroscope() {
  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Daily Horoscope", path: "/free/horoscope" }])} />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,58,160,0.3),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Free daily horoscope · {today}</p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Choose your <span className="text-gradient-gold">zodiac sign</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            Vedic + Western daily readings, updated every morning at 6am IST. Tap your rasi to see what today holds.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {SIGNS.map((s) => (
            <Link
              key={s.slug}
              href={`/free/horoscope/${s.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5 text-center transition-all hover:-translate-y-1 hover:border-[color:var(--color-gold-500)]/60"
            >
              <div className="font-[family-name:var(--font-cormorant)] text-5xl text-gradient-gold">{s.emoji}</div>
              <h3 className="mt-3 font-[family-name:var(--font-cormorant)] text-xl text-[color:var(--color-text)]">{s.name}</h3>
              <p className="text-xs text-[color:var(--color-gold-100)]">{s.tamil}</p>
              <p className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">{s.date}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[color:var(--color-border)]/60 bg-[color:var(--color-bg-elev)]/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Want a personal reading instead?</h2>
          <p className="mt-3 text-[color:var(--color-text-muted)]">
            Daily horoscopes are general for your sign. A personal Vedic reading uses your full kundli — far more accurate.
          </p>
          <Link
            href="/astrologers"
            className="mt-6 inline-block rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
          >
            Talk to a Vedic astrologer
          </Link>
        </div>
      </section>
    </div>
  );
}
