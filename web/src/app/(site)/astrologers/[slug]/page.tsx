import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Globe, GraduationCap, Clock } from "lucide-react";
import { buildMetadata, SITE } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { ASTROLOGERS, formatINR } from "@/lib/mock-data";
import { siteUrl } from "@/lib/utils";
import { AstrologerBookingCard } from "@/components/booking/astrologer-booking-card";
import { getServicesForAstrologer } from "@/lib/services";

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

  const { rows: services } = await getServicesForAstrologer(slug);

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

            {/* Services & pricing */}
            {services.length > 0 && (
              <div className="mt-12">
                <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Services &amp; pricing</h2>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  Choose what you'd like — full details in the booking panel.
                </p>
                <ul className="mt-5 divide-y divide-[color:var(--color-border)]/60 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
                  {services.map((s) => {
                    const price = s.discounted_price_paise ?? s.base_price_paise;
                    const isDiscounted = s.discounted_price_paise && s.discounted_price_paise < s.base_price_paise;
                    return (
                      <li key={s.id} className="flex items-start justify-between gap-4 px-5 py-4">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-wider text-[color:var(--color-gold-300)]">{s.category_name}</p>
                          <p className="mt-1 font-medium text-[color:var(--color-text)]">{s.name}</p>
                          {s.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-[color:var(--color-text-muted)]">{s.description}</p>
                          )}
                          <p className="mt-2 inline-flex items-center gap-1 text-xs text-[color:var(--color-text-muted)]">
                            <Clock className="h-3 w-3" aria-hidden /> {s.duration_minutes} min · {s.delivery_mode.replace("_", " ")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          {isDiscounted && (
                            <p className="text-xs text-[color:var(--color-text-muted)] line-through">{formatINR(s.base_price_paise)}</p>
                          )}
                          <p className="font-[family-name:var(--font-cormorant)] text-2xl text-gradient-gold">{formatINR(price)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

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
            <AstrologerBookingCard
              services={services}
              astrologerName={a.name}
            />
          </aside>
        </div>
      </article>
    </div>
  );
}
