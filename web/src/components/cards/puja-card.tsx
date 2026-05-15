import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { type Puja, formatINR } from "@/lib/mock-data";

export function PujaCard({ p }: { p: Puja }) {
  return (
    <Link
      href={`/puja/${p.slug}`}
      className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-[color:var(--color-gold-500)]/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={p.image} alt={p.name} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg)] via-transparent to-transparent" />
        {p.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-[color:var(--color-gold-500)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-bg)]">
            Featured
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[color:var(--color-text)]">{p.name}</h3>
        <p className="mt-1 text-sm text-[color:var(--color-gold-100)]">{p.deity}</p>
        <p className="mt-2 line-clamp-2 text-sm text-[color:var(--color-text-muted)]">{p.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[color:var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden /> {p.temple}, {p.city}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {p.durationMinutes} min</span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-[color:var(--color-border)]/60 pt-4">
          <span className="font-[family-name:var(--font-cormorant)] text-2xl text-gradient-gold">{formatINR(p.pricePaise)}</span>
          <span className="text-sm font-medium text-[color:var(--color-gold-100)]">Book →</span>
        </div>
      </div>
    </Link>
  );
}
