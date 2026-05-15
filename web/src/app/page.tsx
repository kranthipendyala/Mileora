import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { LeadForm } from "@/components/sections/lead-form";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Astrology, Numerology, Vasthu, Jothisyam & Puja",
  description:
    "Talk to verified Vedic astrologers, get a free kundli, book authentic online pujas, and find your numerology, vasthu, and jothisyam answers — all on Mileora.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <Hero />
      <Trust />
      <Services />
      <Testimonials />
      <LeadForm />
      <Faq />
    </>
  );
}
