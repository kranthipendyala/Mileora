import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import * as Lucide from "lucide-react";
import { Star, Clock, Video } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/components/seo/json-ld";
import { getCategoryBySlug } from "@/lib/categories";
import { apiPublic } from "@/lib/api-client";
import { formatINR, ASTROLOGERS } from "@/lib/mock-data";

type GuideServiceRow = {
  id: number;
  guide_id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price_paise: number;
  discounted_price_paise: number | null;
  price_unit: string;
  duration_minutes: number;
  delivery_mode: string;
  is_active: 0 | 1;
  guide_name: string;
  guide_slug: string | null;
  guide_photo: string | null;
  guide_rating: number | null;
  guide_reviews: number | null;
  guide_experience: number | null;
  guide_languages: string | null;
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = await getCategoryBySlug(category);
  if (!c) return buildMetadata({ title: "Service not found", path: `/services/${category}`, noindex: true });
  return buildMetadata({
    title: c.meta_title ?? `${c.name} — Verified Guides`,
    description: c.meta_description ?? c.description ?? `Browse verified guides offering ${c.name} on Mileora.`,
    path: `/services/${c.slug}`,
  });
}

async function fetchOfferings(slug: string): Promise<{ rows: GuideServiceRow[]; live: boolean }> {
  try {
    const r = await apiPublic.get<{ data: GuideServiceRow[] }>(`/services?category=${encodeURIComponent(slug)}`, { revalidate: 60 });
    return { rows: Array.isArray(r?.data) ? r.data : [], live: true };
  } catch {
    return { rows: [], live: false };
  }
}

export default async function ServicesByCategory({ params }: Props) {
  const { category } = await params;
  const c = await getCategoryBySlug(category);
  if (!c) notFound();

  const { rows, live } = await fetchOfferings(c.slug);
  const Icon = (Lucide as Record<string, React.ComponentType<{ className?: string }>>)[c.icon ?? "Sparkles"] ?? Lucide.Sparkles;

  return (
    <div className="bg-cosmic">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: c.name, path: `/services/${c.slug}` },
          ]),
          serviceJsonLd(c.name, c.description ?? `${c.name} services on Mileora`, `/services/${c.slug}`),
        ]}
      />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
        <div className="mx-auto max-w-4xl">
          <Link href="/services" className="text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold-100)]">← All services</Link>
          <div className="mt-6 flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] ring-1 ring-[color:var(--color-gold-500)]/30">
              <Icon className="h-7 w-7 text-[color:var(--color-gold-300)]" aria-hidden />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-cormorant)] text-5xl tracking-tight">{c.name}</h1>
              <p className="mt-3 max-w-2xl text-lg text-[color:var(--color-text-muted)]">{c.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Verified guides offering {c.name}</h2>
            <span className="text-sm text-[color:var(--color-text-muted)]">{rows.length} {rows.length === 1 ? "offering" : "offerings"}</span>
          </div>

          {rows.length === 0 ? (
            <EmptyState live={live} categoryName={c.name} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((s) => <ServiceCard key={s.id} s={s} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ s }: { s: GuideServiceRow }) {
  const price = s.discounted_price_paise ?? s.base_price_paise;
  const isDiscounted = s.discounted_price_paise && s.discounted_price_paise < s.base_price_paise;
  return (
    <Link
      href={`/astrologers/${s.guide_slug ?? "#"}`}
      className="group rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-gold-500)]/60"
    >
      <div className="flex items-start gap-3">
        {s.guide_photo ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-[color:var(--color-gold-500)]/20">
            <Image src={s.guide_photo} alt={s.guide_name} fill sizes="48px" className="object-cover" />
          </div>
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-full bg-[color:var(--color-bg)]" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[color:var(--color-text)]">{s.guide_name}</p>
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-text-muted)]">
            {s.guide_rating != null && (
              <span className="inline-flex items-center gap-0.5 text-[color:var(--color-gold-100)]">
                <Star className="h-3 w-3 fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]" aria-hidden />
                {Number(s.guide_rating).toFixed(2)}
              </span>
            )}
            {s.guide_experience != null && <span>· {s.guide_experience} yrs</span>}
          </div>
        </div>
      </div>
      <p className="mt-3 font-[family-name:var(--font-cormorant)] text-xl text-[color:var(--color-text)]">{s.name}</p>
      {s.description && <p className="mt-1 line-clamp-2 text-sm text-[color:var(--color-text-muted)]">{s.description}</p>}
      <div className="mt-4 flex items-center justify-between border-t border-[color:var(--color-border)]/60 pt-3">
        <div className="flex items-center gap-2 text-xs text-[color:var(--color-text-muted)]">
          <Clock className="h-3 w-3" aria-hidden /> {s.duration_minutes} min
          <Video className="ml-2 h-3 w-3" aria-hidden /> {s.delivery_mode.replace("_", " ")}
        </div>
        <div className="text-right">
          {isDiscounted && (
            <p className="text-xs text-[color:var(--color-text-muted)] line-through">{formatINR(s.base_price_paise)}</p>
          )}
          <p className="font-[family-name:var(--font-cormorant)] text-xl text-gradient-gold">{formatINR(price)}</p>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ live, categoryName }: { live: boolean; categoryName: string }) {
  // Show a curated suggestion of astrologers while the catalog is empty/offline.
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30 p-10 text-center">
      <p className="text-[color:var(--color-text-muted)]">
        {live
          ? `No active guides offering ${categoryName} yet. Be the first.`
          : `CI3 backend isn't reachable — here's our featured guides instead:`}
      </p>
      {!live && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ASTROLOGERS.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              href={`/astrologers/${a.slug}`}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4 text-left hover:border-[color:var(--color-gold-500)]/60"
            >
              <p className="font-medium text-[color:var(--color-text)]">{a.name}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">{a.tagline}</p>
              <p className="mt-2 text-sm text-[color:var(--color-gold-100)]">{formatINR(a.pricePaise)}</p>
            </Link>
          ))}
        </div>
      )}
      <Link
        href="/guide/register"
        className="mt-6 inline-block rounded-md bg-[color:var(--color-gold-500)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
      >
        Apply to offer {categoryName}
      </Link>
    </div>
  );
}
