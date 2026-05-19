import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/components/seo/json-ld";
import { FaqList } from "@/components/sections/faq";
import { faqJsonLd } from "@/components/seo/json-ld";

export type ServicePageProps = {
  slug: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  Icon: LucideIcon;
  whatYouGet: string[];
  process: { step: string; desc: string }[];
  pricing: { label: string; price: string; bullets: string[]; cta: string; highlight?: boolean }[];
  faqs: { q: string; a: string }[];
};

export function ServicePage(props: ServicePageProps) {
  const { slug, eyebrow, title, titleAccent, intro, Icon, whatYouGet, process, pricing, faqs } = props;

  return (
    <div className="bg-cosmic">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: title, path: `/${slug}` },
          ]),
          serviceJsonLd(title, intro, `/${slug}`),
          faqJsonLd(faqs),
        ]}
      />

      {/* Hero */}
      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] ring-1 ring-[color:var(--color-gold-500)]/30">
            <Icon className="h-7 w-7 text-[color:var(--color-gold-300)]" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{eyebrow}</p>
          <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            {title} <span className="text-gradient-gold">{titleAccent}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">{intro}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/astrologers"
              className="rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] shadow-[var(--shadow-glow)] hover:bg-[color:var(--color-gold-300)]"
            >
              Talk to a guide
            </Link>
            <Link
              href={`/free/${slug === "puja" ? "kundli" : slug}`}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-6 py-3 text-base font-medium text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]"
            >
              Get a free reading
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">What's included</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {whatYouGet.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold-300)]" aria-hidden />
                <span className="text-[color:var(--color-text)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-[color:var(--color-border)]/60 bg-[color:var(--color-bg-elev)]/40 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">How it works</p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">A simple, sacred process</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {process.map((s, i) => (
              <li key={i} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6">
                <div className="font-[family-name:var(--font-cormorant)] text-5xl text-gradient-gold">{i + 1}</div>
                <h3 className="mt-2 text-lg font-medium text-[color:var(--color-text)]">{s.step}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Pricing</p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
              Honest pricing. <span className="text-gradient-gold">No surprises.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricing.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border p-7 shadow-[var(--shadow-card)] ${
                  p.highlight
                    ? "border-[color:var(--color-gold-500)]/60 bg-[color:var(--color-surface)] ring-1 ring-[color:var(--color-gold-500)]/30"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--color-gold-500)] px-3 py-1 text-xs font-medium text-[color:var(--color-bg)]">
                    Most popular
                  </div>
                )}
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl">{p.label}</h3>
                <p className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl text-gradient-gold">{p.price}</p>
                <ul className="mt-5 space-y-2 text-sm text-[color:var(--color-text-muted)]">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold-300)]" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/astrologers"
                  className={`mt-6 block rounded-md px-4 py-3 text-center text-sm font-medium ${
                    p.highlight
                      ? "bg-[color:var(--color-gold-500)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
                      : "border border-[color:var(--color-border)] text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqList items={faqs} title="Common questions" emitJsonLd={false} />
    </div>
  );
}
