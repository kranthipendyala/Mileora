import Link from "next/link";
import * as Lucide from "lucide-react";
import { getActiveCategories } from "@/lib/categories";

/**
 * Home-page services section — now fully dynamic. Categories come from CI3
 * (`GET /api/v1/categories`). When the API is unreachable, lib/categories.ts
 * serves a static fallback that mirrors the seeded catalog so the home page
 * never renders empty.
 *
 * The link target is `/services/[slug]` (the new dynamic browse page) instead
 * of the legacy marketing pages — those still exist at /astrology etc. for SEO,
 * but discovery now flows through the live catalog.
 */
export async function Services() {
  const { rows: categories, live } = await getActiveCategories({ limit: 6 });

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-300)]">
            What we offer
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">
            {categories.length === 1 ? "One path" : `${ordinal(categories.length)} paths`}{" "}
            to <span className="text-gradient-gold">cosmic clarity</span>
          </h2>
          <p className="mt-4 text-[color:var(--color-text-muted)]">
            Every Mileora service is delivered by a verified guide and backed by a satisfaction guarantee.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const Icon = (Lucide as Record<string, React.ComponentType<{ className?: string }>>)[c.icon ?? "Sparkles"] ?? Lucide.Sparkles;
            return (
              <Link
                key={c.slug}
                href={`/services/${c.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-[color:var(--color-gold-500)]/60"
              >
                <div className="absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-[color:var(--color-gold-500)]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-bg-elev)] ring-1 ring-[color:var(--color-gold-500)]/20">
                  <Icon className="h-6 w-6 text-[color:var(--color-gold-300)]" aria-hidden />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-cormorant)] text-2xl text-[color:var(--color-text)]">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-muted)] line-clamp-3">
                  {c.description ?? ""}
                </p>
                {c.active_guide_count !== undefined && c.active_guide_count > 0 && (
                  <p className="mt-3 text-xs text-[color:var(--color-gold-100)]">
                    {c.active_guide_count} verified guide{c.active_guide_count > 1 ? "s" : ""} available
                  </p>
                )}
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

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm text-[color:var(--color-gold-100)] hover:underline"
          >
            See all services →
          </Link>
          {!live && (
            <p className="mt-2 text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
              (Showing fallback catalog — CI3 backend not reachable)
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ordinal(n: number) {
  return ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"][n] ?? String(n);
}
