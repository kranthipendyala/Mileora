import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Globe, GraduationCap, Clock, Video, Phone, MessageCircle } from "lucide-react";
import { buildMetadata, SITE } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { ASTROLOGERS, formatINR } from "@/lib/mock-data";
import { siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ASTROLOGERS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ASTROLOGERS.find((x) => x.slug === slug);
  if (!a) return buildMetadata({ title: "Astrologer not found", path: `/astrologers/${slug}`, noindex: true });
  return buildMetadata({
    title: `${a.name} — ${a.tagline}`,
    description: a.bio,
    path: `/astrologers/${a.slug}`,
    image: a.photo,
    type: "profile",
  });
}

export default async function AstrologerDetail({ params }: Props) {
  const { slug } = await params;
  const a = ASTROLOGERS.find((x) => x.slug === slug);
  if (!a) notFound();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.name,
    description: a.bio,
    image: a.photo,
    jobTitle: "Astrologer",
    knowsAbout: a.specialties,
    knowsLanguage: a.languages,
    url: siteUrl(`/astrologers/${a.slug}`),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: a.rating,
      reviewCount: a.reviewsCount,
      bestRating: 5,
    },
    worksFor: { "@type": "Organization", name: SITE.name, url: siteUrl() },
  };

  return (
    <div className="bg-cosmic">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Astrologers", path: "/astrologers" },
            { name: a.name, path: `/astrologers/${a.slug}` },
          ]),
          personLd,
        ]}
      />

      <article className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Profile */}
          <div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full ring-2 ring-[color:var(--color-gold-500)]/40">
                <Image src={a.photo} alt={a.name} fill priority sizes="128px" className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{a.tagline}</p>
                <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">{a.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[color:var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]" aria-hidden />
                    <span className="text-[color:var(--color-gold-100)]">{a.rating.toFixed(2)}</span>
                    <span>· {a.reviewsCount.toLocaleString("en-IN")} reviews</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-4 w-4" aria-hidden /> {a.experienceYears} yrs experience</span>
                  <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4" aria-hidden /> {a.languages.join(", ")}</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-lg text-[color:var(--color-text)]/90 leading-relaxed">{a.bio}</p>

            <div className="mt-8">
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Specialties</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.specialties.map((s) => (
                  <span key={s} className="rounded-full border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)] px-3 py-1 text-sm text-[color:var(--color-gold-100)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample reviews */}
            <div className="mt-12">
              <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Recent reviews</h2>
              <div className="mt-5 space-y-4">
                {[
                  { name: "Priya M.", rating: 5, text: "Pinpointed the exact month my career would shift. It happened. Worth every rupee." },
                  { name: "Vikram T.", rating: 5, text: "Calm, scripture-based reading. No drama, no fear-mongering. Recommended." },
                  { name: "Sandhya R.", rating: 4, text: "Very accurate on family matters. Remedies were practical and easy to follow." },
                ].map((r, i) => (
                  <div key={i} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[color:var(--color-text)]">{r.name}</p>
                      <div className="flex">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]" aria-hidden />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-[color:var(--color-text)]/85">&ldquo;{r.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky booking */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-6 shadow-[var(--shadow-glow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Book a session</p>
              <p className="mt-2 font-[family-name:var(--font-cormorant)] text-5xl text-gradient-gold">{formatINR(a.pricePaise)}</p>
              <p className="text-sm text-[color:var(--color-text-muted)]">
                <Clock className="mr-1 inline h-3.5 w-3.5 -translate-y-px" aria-hidden /> {a.sessionMinutes}-minute session
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[{ Icon: Video, label: "Video" }, { Icon: Phone, label: "Voice" }, { Icon: MessageCircle, label: "Chat" }].map(({ Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="flex flex-col items-center gap-1 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 py-3 text-xs text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]"
                  >
                    <Icon className="h-4 w-4 text-[color:var(--color-gold-300)]" aria-hidden /> {label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Pick a time today</p>
                <div className="grid grid-cols-3 gap-2">
                  {["10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM", "6:30 PM", "8:00 PM"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 py-2 text-xs text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)] hover:text-[color:var(--color-gold-100)]"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="#"
                className="mt-6 block rounded-md bg-[color:var(--color-gold-500)] px-4 py-3 text-center text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
              >
                Continue · {formatINR(a.pricePaise)}
              </Link>
              <p className="mt-3 text-center text-xs text-[color:var(--color-text-muted)]">Free cancellation up to 1 hour before</p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
