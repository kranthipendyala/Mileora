import type { Metadata } from "next";
import { Sun } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/service/service-page";

export const metadata: Metadata = buildMetadata({
  title: "Tamil Jothisyam — South Indian Vedic Astrology",
  description:
    "Authentic Tamil jothisyam readings — rasi, navamsa, traditional Tamil panchangam guidance from verified jothidars on Mileora.",
  path: "/jothisyam",
});

export default function JothisyamPage() {
  return (
    <ServicePage
      slug="jothisyam"
      eyebrow="தென்னிந்திய ஜோதிடம்"
      title="Tamil"
      titleAccent="Jothisyam"
      Icon={Sun}
      intro="South Indian jothisyam is rooted in the Parashari school but read through the lens of Tamil tradition — rasi, navamsa, panchangam, and the lineage wisdom of Tirunelveli and Kumbakonam pandits."
      whatYouGet={[
        "Rasi + navamsa kattam (chart) reading",
        "Tamil panchangam — auspicious tithi, nakshatra, yoga, karana",
        "Career, marriage (porutham), childbirth, foreign travel predictions",
        "Suitable mantras, parihara homam, temple visits",
        "Auspicious muhurtham for weddings, housewarming, business launch",
        "Reading delivered in Tamil or English — your preference",
      ]}
      process={[
        { step: "Share birth details", desc: "Date, exact time of birth, and birthplace. We'll cast your South Indian style rasi kattam." },
        { step: "Match with a jothidar", desc: "Our verified Tamil jothidars are gurukul-trained — many from temple-priest lineages." },
        { step: "Live reading + recording", desc: "30–60 min consultation in Tamil or English. You get a recording + written summary." },
      ]}
      pricing={[
        {
          label: "Free Rasi",
          price: "Free",
          bullets: ["Rasi + navamsa chart", "Current dasa-bhukti summary", "This week's panchangam"],
          cta: "Generate free chart",
        },
        {
          label: "Jothidar Reading",
          price: "₹999",
          bullets: ["30-min live consultation in Tamil/English", "Recorded + written summary", "Parihara recommendations", "7-day chat follow-up"],
          cta: "Book reading",
          highlight: true,
        },
        {
          label: "Marriage Porutham",
          price: "₹1,499",
          bullets: ["10-porutham (matchmaking) analysis", "Chart compatibility report", "Joint live consultation", "Wedding muhurtham included"],
          cta: "Check porutham",
        },
      ]}
      faqs={[
        { q: "What's the difference between jothisyam and Vedic astrology?", a: "Jothisyam is the Tamil-tradition flavor of Vedic astrology. The underlying jyotisha is the same — the chart styles (South vs North Indian), the regional almanacs (Tamil panchangam), and the lineage of interpretation differ." },
        { q: "Can the reading be conducted in Tamil?", a: "Yes. Most of our jothidars read in Tamil first, with English/Hindi available on request. Some also speak Telugu, Kannada, and Malayalam." },
        { q: "What is porutham?", a: "Porutham (kuta) is the 10-fold compatibility check between two horoscopes for marriage. We do all 10 (dinam, ganam, mahendra, stree-deergha, yoni, rasi, rasiyathipathi, vasiyam, rajju, vedha) and explain each score." },
        { q: "Do you suggest temples for parihara?", a: "Yes — including the lesser-known but powerful navagraha temples around Kumbakonam. Many seekers find a 1-day temple yatra deeply meaningful." },
      ]}
    />
  );
}
