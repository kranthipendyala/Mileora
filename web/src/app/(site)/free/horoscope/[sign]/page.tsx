import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Heart, Briefcase, Sparkles, Activity } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

const SIGNS: Record<string, { name: string; tamil: string; date: string; emoji: string; element: string; lucky: { color: string; number: number; day: string } }> = {
  aries:       { name: "Aries",       tamil: "மேஷம்",      date: "Mar 21 – Apr 19", emoji: "♈", element: "Fire",  lucky: { color: "Red",       number: 9, day: "Tuesday" } },
  taurus:      { name: "Taurus",      tamil: "ரிஷபம்",     date: "Apr 20 – May 20", emoji: "♉", element: "Earth", lucky: { color: "White",     number: 6, day: "Friday" } },
  gemini:      { name: "Gemini",      tamil: "மிதுனம்",    date: "May 21 – Jun 20", emoji: "♊", element: "Air",   lucky: { color: "Green",     number: 5, day: "Wednesday" } },
  cancer:      { name: "Cancer",      tamil: "கடகம்",      date: "Jun 21 – Jul 22", emoji: "♋", element: "Water", lucky: { color: "Silver",    number: 2, day: "Monday" } },
  leo:         { name: "Leo",         tamil: "சிம்மம்",    date: "Jul 23 – Aug 22", emoji: "♌", element: "Fire",  lucky: { color: "Gold",      number: 1, day: "Sunday" } },
  virgo:       { name: "Virgo",       tamil: "கன்னி",      date: "Aug 23 – Sep 22", emoji: "♍", element: "Earth", lucky: { color: "Olive",     number: 5, day: "Wednesday" } },
  libra:       { name: "Libra",       tamil: "துலாம்",     date: "Sep 23 – Oct 22", emoji: "♎", element: "Air",   lucky: { color: "Pink",      number: 6, day: "Friday" } },
  scorpio:     { name: "Scorpio",     tamil: "விருச்சிகம்", date: "Oct 23 – Nov 21", emoji: "♏", element: "Water", lucky: { color: "Maroon",    number: 9, day: "Tuesday" } },
  sagittarius: { name: "Sagittarius", tamil: "தனுசு",      date: "Nov 22 – Dec 21", emoji: "♐", element: "Fire",  lucky: { color: "Yellow",    number: 3, day: "Thursday" } },
  capricorn:   { name: "Capricorn",   tamil: "மகரம்",      date: "Dec 22 – Jan 19", emoji: "♑", element: "Earth", lucky: { color: "Indigo",    number: 8, day: "Saturday" } },
  aquarius:    { name: "Aquarius",    tamil: "கும்பம்",    date: "Jan 20 – Feb 18", emoji: "♒", element: "Air",   lucky: { color: "Blue",      number: 8, day: "Saturday" } },
  pisces:      { name: "Pisces",      tamil: "மீனம்",      date: "Feb 19 – Mar 20", emoji: "♓", element: "Water", lucky: { color: "Sea green", number: 3, day: "Thursday" } },
};

type Props = { params: Promise<{ sign: string }> };

export async function generateStaticParams() {
  return Object.keys(SIGNS).map((sign) => ({ sign }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sign } = await params;
  const s = SIGNS[sign];
  if (!s) return buildMetadata({ title: "Sign not found", path: `/free/horoscope/${sign}`, noindex: true });
  return buildMetadata({
    title: `${s.name} Horoscope Today — Vedic Daily Reading`,
    description: `Free daily horoscope for ${s.name} (${s.tamil}). Career, love, health and lucky numbers — updated every morning.`,
    path: `/free/horoscope/${s.sign}`,
  });
}

const READING = {
  general:
    "Today's planetary alignment supports thoughtful action over reactive moves. Pause before responding to provocations — your discernment is sharper than usual. A small, deliberate step taken now compounds into something significant by month-end.",
  career:
    "Communication-heavy day. Be the one who clarifies rather than the one who waits for clarity. A senior colleague may turn to you for input — speak honestly, even if it's not the popular take.",
  love:
    "Existing relationships benefit from undivided attention this evening. Single? An unexpected message from someone you'd written off may reopen a chapter — proceed with curiosity, not assumption.",
  health:
    "Hydration and short walks make a bigger difference than you'd expect today. Avoid heavy, late dinners. Sleep before 11pm if possible.",
};

export default async function SignPage({ params }: Props) {
  const { sign } = await params;
  const s = SIGNS[sign];
  if (!s) notFound();

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-cosmic">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Daily Horoscope", path: "/free/horoscope" },
          { name: s.name, path: `/free/horoscope/${sign}` },
        ])}
      />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-20">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
        <div className="mx-auto max-w-4xl">
          <Link href="/free/horoscope" className="inline-flex items-center gap-1 text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold-100)]">
            <ChevronLeft className="h-4 w-4" aria-hidden /> All signs
          </Link>
          <div className="mt-8 flex items-center gap-6">
            <div className="font-[family-name:var(--font-cormorant)] text-7xl text-gradient-gold">{s.emoji}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{today}</p>
              <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-5xl tracking-tight">
                {s.name} <span className="text-gradient-gold">Today</span>
              </h1>
              <p className="mt-1 text-[color:var(--color-text-muted)]">{s.tamil} · {s.date} · {s.element} sign</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            {[
              { Icon: Sparkles, label: "Today at a glance", text: READING.general },
              { Icon: Briefcase, label: "Career & money", text: READING.career },
              { Icon: Heart, label: "Love & relationships", text: READING.love },
              { Icon: Activity, label: "Health & wellbeing", text: READING.health },
            ].map(({ Icon, label, text }) => (
              <div key={label} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-bg)]/80 ring-1 ring-[color:var(--color-gold-500)]/30">
                    <Icon className="h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
                  </div>
                  <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">{label}</h2>
                </div>
                <p className="mt-3 text-[color:var(--color-text)]/90 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Lucky today</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between"><dt className="text-[color:var(--color-text-muted)]">Color</dt><dd className="text-[color:var(--color-text)]">{s.lucky.color}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-[color:var(--color-text-muted)]">Number</dt><dd className="text-[color:var(--color-text)]">{s.lucky.number}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-[color:var(--color-text-muted)]">Day of the week</dt><dd className="text-[color:var(--color-text)]">{s.lucky.day}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-[color:var(--color-text-muted)]">Element</dt><dd className="text-[color:var(--color-text)]">{s.element}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6 text-center">
              <p className="text-sm text-[color:var(--color-text-muted)]">Want a personal reading using your <strong className="text-[color:var(--color-text)]">full kundli</strong> instead of just sun sign?</p>
              <Link href="/free/kundli" className="mt-4 inline-block rounded-md bg-[color:var(--color-gold-500)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]">
                Get my free kundli
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
