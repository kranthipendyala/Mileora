import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { type Astrologer, formatINR } from "@/lib/mock-data";

export function AstrologerCard({ a }: { a: Astrologer }) {
  return (
    <Link
      href={`/astrologers/${a.slug}`}
      className="group flex gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-gold-500)]/60"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-[color:var(--color-gold-500)]/20">
        <Image src={a.photo} alt={a.name} fill sizes="80px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-[family-name:var(--font-cormorant)] text-xl text-[color:var(--color-text)]">{a.name}</h3>
            <p className="truncate text-xs text-[color:var(--color-text-muted)]">{a.tagline}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]" aria-hidden />
            <span className="text-[color:var(--color-gold-100)]">{a.rating.toFixed(1)}</span>
            <span className="text-[color:var(--color-text-muted)]">({a.reviewsCount.toLocaleString("en-IN")})</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {a.specialties.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-2 py-0.5 text-[11px] text-[color:var(--color-text-muted)]">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-[color:var(--color-text-muted)]">{a.experienceYears} yrs · {a.languages.slice(0, 2).join(", ")}</span>
          <span className="font-medium text-[color:var(--color-text)]">{formatINR(a.pricePaise)}</span>
        </div>
      </div>
    </Link>
  );
}
