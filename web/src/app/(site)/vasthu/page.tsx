import type { Metadata } from "next";
import { Home } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/service/service-page";

export const metadata: Metadata = buildMetadata({
  title: "Vasthu Shastra — Home & Office Energy Audit",
  description:
    "Compass-based vasthu audit for your home or office. Practical, no-demolition fixes from verified vasthu experts on Mileora.",
  path: "/vasthu",
});

export default function VasthuPage() {
  return (
    <ServicePage
      slug="vasthu"
      eyebrow="Where you live shapes how you live"
      title="Vasthu"
      titleAccent="Shastra"
      Icon={Home}
      intro="Vasthu shastra is the ancient Indian science of harmonizing your space with the five elements. Aligning your home or office with cosmic energies isn't superstition — it's a deliberate design language for prosperity, peace and health."
      whatYouGet={[
        "Compass-based audit of every room (with dosha report)",
        "Personalized fixes — most are no-demolition (mirror placements, color, plants)",
        "Main door, kitchen, and bedroom analysis (the highest-impact zones)",
        "Office or shop layout review for prosperity & focus",
        "Plot vasthu for those buying/building from scratch",
        "Detailed PDF report with diagrams + 30-day chat follow-up",
      ]}
      process={[
        { step: "Share your floor plan", desc: "Upload a sketch or floor plan. We also need a compass photo (or your phone's compass screenshot) for accurate orientation." },
        { step: "Live walkthrough", desc: "60-min video call where the vasthu expert walks through each room with you." },
        { step: "Receive your report", desc: "Detailed PDF with annotated diagrams, prioritized fixes, and remedies — most under ₹2,000 to implement." },
      ]}
      pricing={[
        {
          label: "Single Room",
          price: "₹999",
          bullets: ["One room (bedroom / kitchen / pooja room)", "30-min consultation", "Quick PDF report"],
          cta: "Audit one room",
        },
        {
          label: "Full Home Audit",
          price: "₹2,999",
          bullets: ["Up to 4 BHK", "60-min video walkthrough", "Annotated PDF report", "30-day chat follow-up"],
          cta: "Book full audit",
          highlight: true,
        },
        {
          label: "Office / Commercial",
          price: "₹7,999",
          bullets: ["Office / shop / restaurant", "On-site visit (metro cities)", "Staff seating + entrance review", "60-day follow-up"],
          cta: "Book office audit",
        },
      ]}
      faqs={[
        { q: "Will I have to break walls or relocate doors?", a: "Almost never. 90% of vasthu doshas can be balanced with mirrors, colors, plants, crystals, or repositioning furniture. We only suggest structural changes for serious doshas in homes you're still building." },
        { q: "Does vasthu work for apartments?", a: "Yes — apartment vasthu focuses on internal layout (door, kitchen, bedroom orientation, pooja zone). The building's overall vasthu is set, but you have lots of agency inside your unit." },
        { q: "Is vasthu compatible with modern interior design?", a: "Completely. Our experts work with your design vocabulary — modern, minimalist, traditional — to find solutions that don't compromise your aesthetic." },
        { q: "Do you do on-site visits?", a: "Yes for office/commercial in metro cities (Chennai, Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune). Residential is video-first by default — works just as well." },
      ]}
    />
  );
}
