import Link from "next/link";
import { Sparkles, Calculator, Home, Sun, Flame, Heart } from "lucide-react";

const SERVICES = [
  {
    href: "/astrology",
    title: "Vedic Astrology",
    desc: "Birth chart analysis, dasha periods, planetary remedies — rooted in 5,000-year-old jyotisha tradition.",
    icon: Sparkles,
  },
  {
    href: "/numerology",
    title: "Numerology",
    desc: "Decode your life path, destiny number, and lucky vibrations from your name and date of birth.",
    icon: Calculator,
  },
  {
    href: "/vasthu",
    title: "Vasthu Shastra",
    desc: "Align your home or office with cosmic energies. Compass-based vasthu audit and remedies.",
    icon: Home,
  },
  {
    href: "/jothisyam",
    title: "Tamil Jothisyam",
    desc: "South Indian Vedic astrology with rasi, navamsa, and traditional Tamil panchangam guidance.",
    icon: Sun,
  },
  {
    href: "/puja",
    title: "Online Puja Booking",
    desc: "Book authentic pujas at famous temples. Live stream, sankalpam in your name, prasad delivered home.",
    icon: Flame,
  },
  {
    href: "/free/compatibility",
    title: "Match Compatibility",
    desc: "Vedic kundli matching with 36-guna porutham. Free instant report plus detailed expert analysis.",
    icon: Heart,
  },
];

export function Services() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-300)]">
            What we offer
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">
            Six paths to <span className="text-gradient-gold">cosmic clarity</span>
          </h2>
          <p className="mt-4 text-[color:var(--color-text-muted)]">
            Every Mileora service is delivered by a verified expert and backed by a satisfaction guarantee.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-[color:var(--color-gold-500)]/60"
              >
                <div className="absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-[color:var(--color-gold-500)]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-bg-elev)] ring-1 ring-[color:var(--color-gold-500)]/20">
                  <Icon className="h-6 w-6 text-[color:var(--color-gold-300)]" aria-hidden />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-cormorant)] text-2xl text-[color:var(--color-text)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{s.desc}</p>
                <span className="mt-5 inline-flex items-center text-sm font-medium text-[color:var(--color-gold-100)]">
                  Explore
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 010-1.06L10.94 10 7.21 6.29a.75.75 0 011.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
