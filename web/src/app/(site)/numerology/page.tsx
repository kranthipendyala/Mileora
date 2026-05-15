import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/service/service-page";

export const metadata: Metadata = buildMetadata({
  title: "Numerology — Life Path, Destiny & Lucky Numbers",
  description:
    "Decode your life path, destiny, and lucky numbers from your name and date of birth. Free instant numerology reading + expert consultation on Mileora.",
  path: "/numerology",
});

export default function NumerologyPage() {
  return (
    <ServicePage
      slug="numerology"
      eyebrow="Numbers don't lie"
      title="Numerology"
      titleAccent="Decoded"
      Icon={Calculator}
      intro="Every name and date of birth carries a vibration. Numerology decodes your life path number, destiny number, and lucky vibrations — the hidden grammar behind your decisions, relationships and career."
      whatYouGet={[
        "Life path, destiny, soul-urge, and personality numbers calculated",
        "Personal-year forecast for the next 12 months",
        "Lucky numbers, colors, days, and gemstones",
        "Name-correction analysis (with suggested spellings)",
        "Business-name + brand numerology audit (premium)",
        "Compatibility report between two people",
      ]}
      process={[
        { step: "Enter your name + DOB", desc: "Use the name on your birth certificate. We compute every number in seconds." },
        { step: "Read your free report", desc: "Instant breakdown of your core numbers and what each one means for you." },
        { step: "Talk to an expert", desc: "Optional 30-minute consultation with a numerology specialist for nuance + remedies." },
      ]}
      pricing={[
        {
          label: "Free Report",
          price: "Free",
          bullets: ["Life path + destiny + soul-urge numbers", "Brief personality reading", "Lucky numbers & days"],
          cta: "Generate free report",
        },
        {
          label: "Expert Consultation",
          price: "₹799",
          bullets: ["30-min live session", "Name-correction guidance", "Personal-year forecast PDF", "7-day chat follow-up"],
          cta: "Book consultation",
          highlight: true,
        },
        {
          label: "Business Numerology",
          price: "₹3,999",
          bullets: ["Brand + founder numerology audit", "Naming & domain recommendations", "Launch-date selection", "Logo color guidance"],
          cta: "Audit my business",
        },
      ]}
      faqs={[
        { q: "Which numerology system do you use?", a: "We use the Pythagorean system by default (most widely understood) but our experts can also read in the Chaldean tradition on request." },
        { q: "Should I change my name based on numerology?", a: "Only if it resonates with you. We suggest spelling tweaks rather than full changes — a single letter often shifts the vibration enough." },
        { q: "Does the time of birth matter for numerology?", a: "Numerology only needs your date of birth. Time is required for astrology/kundli, not numerology." },
        { q: "Can numerology really help my business?", a: "It's one input, not the whole picture — but choosing a brand name and launch date with favorable vibrations costs nothing extra and many founders swear by it." },
      ]}
    />
  );
}
