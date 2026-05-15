import Link from "next/link";
import { Sparkles } from "lucide-react";

const NAV = [
  { href: "/astrology", label: "Astrology" },
  { href: "/numerology", label: "Numerology" },
  { href: "/vasthu", label: "Vasthu" },
  { href: "/jothisyam", label: "Jothisyam" },
  { href: "/puja", label: "Puja & Rituals" },
  { href: "/astrologers", label: "Talk to an Astrologer" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)]/60 backdrop-blur-md bg-[color:var(--color-bg)]/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-2xl">
          <Sparkles className="h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
          <span className="text-gradient-gold tracking-wide">Mileora</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold-100)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/book"
            className="rounded-md bg-[color:var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
