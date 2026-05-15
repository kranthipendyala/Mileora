import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/service/service-page";

export const metadata: Metadata = buildMetadata({
  title: "Vedic Astrology — Birth Chart, Dasha & Remedies",
  description:
    "Authentic Vedic astrology readings on Mileora. Get your kundli analyzed, understand dasha periods, and receive personalized remedies from verified astrologers.",
  path: "/astrology",
});

export default function AstrologyPage() {
  return (
    <ServicePage
      slug="astrology"
      eyebrow="Vedic Jyotisha"
      title="Vedic"
      titleAccent="Astrology"
      Icon={Sparkles}
      intro="A 5,000-year-old science of light. Your kundli reveals the karmic blueprint you brought into this life — career, marriage, health, wealth, and the dasha periods shaping each chapter."
      whatYouGet={[
        "Detailed birth-chart (kundli) analysis with rasi, navamsa, divisional charts",
        "Current and upcoming dasha / antardasha interpretation",
        "Career, marriage, health, finance & education predictions",
        "Personalized remedies — mantras, gemstones, fasts, charity",
        "Written PDF report you can revisit anytime",
        "Follow-up questions answered via chat for 7 days",
      ]}
      process={[
        { step: "Share birth details", desc: "Date, exact time, and city of birth — that's all we need to cast your chart." },
        { step: "Match with an expert", desc: "We pair you with a verified astrologer who specializes in your concern + speaks your language." },
        { step: "Live reading + report", desc: "30–60 min live consultation on call/video, plus a written PDF and 7-day follow-up." },
      ]}
      pricing={[
        {
          label: "Free Kundli",
          price: "Free",
          bullets: ["Vedic birth chart with rasi & navamsa", "Current dasha period summary", "Auspicious days for the next month"],
          cta: "Generate free kundli",
        },
        {
          label: "Detailed Reading",
          price: "₹999",
          bullets: ["30-min live consultation", "Written PDF report", "Personalized remedies", "7-day chat follow-up"],
          cta: "Book a reading",
          highlight: true,
        },
        {
          label: "Annual Forecast",
          price: "₹2,499",
          bullets: ["60-min deep-dive consultation", "12-month varshphal report", "Monthly do's & don'ts", "30-day chat follow-up"],
          cta: "Book annual",
        },
      ]}
      faqs={[
        { q: "What if I don't know my exact birth time?", a: "We can do an approximate reading or perform 'birth-time rectification' from major life events. Most experienced astrologers can narrow it within ±15 minutes." },
        { q: "How is Vedic astrology different from Western?", a: "Vedic uses the sidereal zodiac (fixed against stars) and emphasizes dasha — planetary periods that activate parts of your life. Western uses the tropical zodiac and focuses more on personality archetypes." },
        { q: "Will the remedies require me to change my faith?", a: "No. Vedic remedies are framed within Hindu tradition but are universal — mantras, gemstones, fasts, charity. Use what resonates and feels right." },
        { q: "Is the consultation private?", a: "Yes — calls are end-to-end encrypted, your chart is never shared, and you can request deletion of your data at any time." },
        { q: "Can I get a reading in Tamil / Hindi?", a: "Absolutely. Filter astrologers by language on the booking page." },
      ]}
    />
  );
}
