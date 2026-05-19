import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { ARTICLES } from "@/lib/mock-data";

export const metadata: Metadata = buildMetadata({
  title: "Mileora Blog — Astrology, Numerology, Vasthu, Puja insights",
  description:
    "Plain-language articles on Vedic astrology, numerology, vasthu shastra, Tamil jothisyam, and online puja — written by verified guides.",
  path: "/blog",
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function Blog() {
  const [hero, ...rest] = ARTICLES;

  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-10 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Mileora Journal</p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Wisdom you can <span className="text-gradient-gold">actually use</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            Plain-language articles from verified astrologers, numerologists, vasthu guides, and temple priests.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero article */}
          <Link
            href={`/blog/${hero.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto">
              <Image src={hero.cover} alt={hero.title} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{hero.category}</p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl tracking-tight sm:text-4xl">{hero.title}</h2>
              <p className="mt-4 text-[color:var(--color-text-muted)]">{hero.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-[color:var(--color-text-muted)]">
                <span>{hero.author}</span>
                <span>·</span>
                <span>{fmtDate(hero.publishedAt)}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden /> {hero.readMinutes} min read</span>
              </div>
            </div>
          </Link>

          {/* Rest grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 transition-all hover:-translate-y-1 hover:border-[color:var(--color-gold-500)]/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={a.cover} alt={a.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{a.category}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl">{a.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--color-text-muted)] line-clamp-2">{a.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-[color:var(--color-text-muted)]">
                    <span>{fmtDate(a.publishedAt)}</span>
                    <span>·</span>
                    <span>{a.readMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
