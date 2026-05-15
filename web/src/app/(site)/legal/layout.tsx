import Link from "next/link";

const NAV = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/refunds", label: "Refund Policy" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cosmic">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Legal</p>
            <nav className="mt-4 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-md border border-transparent px-3 py-2 text-sm text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)]/60 hover:text-[color:var(--color-text)]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4 text-xs text-[color:var(--color-text-muted)]">
              Questions? Email{" "}
              <a className="text-[color:var(--color-gold-100)]" href="mailto:info@magnusconference.com">
                info@magnusconference.com
              </a>
            </div>
          </aside>

          <article className="prose-mileora max-w-none">
            {children}
          </article>
        </div>
      </div>

      <style>{`
        .prose-mileora h1 {
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: 2.75rem;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--color-text);
        }
        .prose-mileora p.lead {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          margin-top: 0.75rem;
        }
        .prose-mileora h2 {
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: 1.875rem;
          color: var(--color-text);
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
        }
        .prose-mileora h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--color-gold-100);
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose-mileora p,
        .prose-mileora li {
          color: var(--color-text);
          opacity: 0.9;
          line-height: 1.7;
        }
        .prose-mileora ul {
          margin: 0.75rem 0 1rem 1.25rem;
          list-style: disc;
        }
        .prose-mileora li {
          margin-bottom: 0.35rem;
        }
        .prose-mileora a {
          color: var(--color-gold-100);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
