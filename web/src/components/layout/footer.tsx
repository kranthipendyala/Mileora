import Link from "next/link";

const COLS = [
  {
    heading: "Services",
    links: [
      { href: "/astrology", label: "Vedic Astrology" },
      { href: "/numerology", label: "Numerology" },
      { href: "/vasthu", label: "Vasthu Consultation" },
      { href: "/jothisyam", label: "Tamil Jothisyam" },
      { href: "/puja", label: "Online Puja Booking" },
    ],
  },
  {
    heading: "Free Tools",
    links: [
      { href: "/free/kundli", label: "Free Kundli" },
      { href: "/free/numerology", label: "Numerology Calculator" },
      { href: "/free/horoscope", label: "Daily Horoscope" },
      { href: "/free/compatibility", label: "Match Compatibility" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Mileora" },
      { href: "/astrologers", label: "Our Astrologers" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/refunds", label: "Refund Policy" },
      { href: "/legal/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[color:var(--color-border)]/60 bg-[color:var(--color-bg-elev)]/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="font-[family-name:var(--font-cormorant)] text-2xl text-gradient-gold">Mileora</div>
            <p className="mt-3 text-sm text-[color:var(--color-text-muted)]">
              Trusted Vedic astrologers, free kundli, numerology readings, vasthu consultation, and online puja booking
              — all in one place.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-gold-100)]">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="divider-gold mt-12" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-[color:var(--color-text-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} Mileora. All rights reserved.</p>
          <p>Made with reverence in India · info@magnusconference.com</p>
        </div>
      </div>
    </footer>
  );
}
