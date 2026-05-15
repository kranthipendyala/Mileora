import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin, Clock, Calendar } from "lucide-react";
import { buildMetadata, SITE } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { PUJAS, formatINR } from "@/lib/mock-data";
import { siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PUJAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PUJAS.find((x) => x.slug === slug);
  if (!p) return buildMetadata({ title: "Puja not found", path: `/puja/${slug}`, noindex: true });
  return buildMetadata({
    title: `${p.name} — Online Puja Booking`,
    description: p.description,
    path: `/puja/${p.slug}`,
    image: p.image,
  });
}

export default async function PujaDetail({ params }: Props) {
  const { slug } = await params;
  const p = PUJAS.find((x) => x.slug === slug);
  if (!p) notFound();

  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: p.name,
    description: p.description,
    image: p.image,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: siteUrl(`/puja/${p.slug}`),
    },
    organizer: { "@type": "Organization", name: SITE.name, url: siteUrl() },
    offers: {
      "@type": "Offer",
      price: (p.pricePaise / 100).toString(),
      priceCurrency: "INR",
      url: siteUrl(`/puja/${p.slug}`),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="bg-cosmic">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Puja & Rituals", path: "/puja" },
            { name: p.name, path: `/puja/${p.slug}` },
          ]),
          eventLd,
        ]}
      />

      <article className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Hero image + content */}
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-[color:var(--color-border)]">
              <Image src={p.image} alt={p.name} fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg)] via-transparent to-transparent" />
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{p.deity}</p>
              <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">{p.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[color:var(--color-text-muted)]">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden /> {p.temple}, {p.city}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden /> {p.durationMinutes} minutes</span>
              </div>

              <p className="mt-6 text-lg text-[color:var(--color-text)]/90 leading-relaxed">{p.description}</p>

              <h2 className="mt-10 font-[family-name:var(--font-cormorant)] text-3xl">What's included</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-gold-300)]" aria-hidden />
                    <span className="text-[color:var(--color-text)]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-6 shadow-[var(--shadow-glow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Book this puja</p>
              <p className="mt-2 font-[family-name:var(--font-cormorant)] text-5xl text-gradient-gold">{formatINR(p.pricePaise)}</p>
              <p className="text-sm text-[color:var(--color-text-muted)]">includes prasad delivery</p>

              <div className="mt-6 space-y-3">
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Choose date</span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5">
                    <Calendar className="h-4 w-4 text-[color:var(--color-gold-300)]" aria-hidden />
                    <input type="date" className="flex-1 bg-transparent text-sm text-[color:var(--color-text)] outline-none" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Your name (sankalpam)</span>
                  <input
                    type="text"
                    placeholder="Full name as per official ID"
                    className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Gotra (optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. Bharadwaja"
                    className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
                  />
                </label>
              </div>

              <Link
                href="#"
                className="mt-6 block rounded-md bg-[color:var(--color-gold-500)] px-4 py-3 text-center text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
              >
                Book puja · {formatINR(p.pricePaise)}
              </Link>
              <p className="mt-3 text-center text-xs text-[color:var(--color-text-muted)]">Secure checkout via Razorpay</p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
