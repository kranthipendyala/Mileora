import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, MapPin, Clock } from "lucide-react";
import { buildMetadata, SITE } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { PUJAS } from "@/lib/mock-data";
import { siteUrl } from "@/lib/utils";
import { PujaBookingCard } from "@/components/booking/puja-booking-card";

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
            <PujaBookingCard pricePaise={p.pricePaise} pujaName={p.name} />
          </aside>
        </div>
      </article>
    </div>
  );
}
