import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description: "Mileora disclaimer — astrology, numerology, vasthu and jothisyam services are spiritual guidance, not medical, legal or financial advice.",
  path: "/legal/disclaimer",
});

export default function Disclaimer() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Last updated: 1 May 2026</p>
      <h1 className="mt-2">Disclaimer</h1>
      <p className="lead">
        Mileora connects you to spiritual guidance — not professional advice. Please read this carefully before acting on anything you receive through our platform.
      </p>

      <h2>1. Spiritual guidance, not medical or legal advice</h2>
      <p>
        Astrology, numerology, vasthu, jothisyam, and puja are spiritual sciences. Readings and remedies are intended for personal reflection and faith-based guidance only. They are <strong>not</strong> a substitute for:
      </p>
      <ul>
        <li>Medical diagnosis or treatment by a qualified doctor</li>
        <li>Mental health support from a licensed therapist</li>
        <li>Legal counsel from an advocate</li>
        <li>Financial advice from a SEBI-registered advisor</li>
      </ul>
      <p>If you are facing a medical emergency or mental health crisis, please call iCALL (9152987821) or your local emergency services immediately.</p>

      <h2>2. Outcomes</h2>
      <p>
        Outcomes from spiritual guidance vary across individuals and cannot be guaranteed. Mileora and its astrologers do not promise specific results — we promise sincere, scripture-rooted readings from verified experts.
      </p>

      <h2>3. Astrologer independence</h2>
      <p>
        Astrologers on Mileora are independent practitioners. Their interpretations and remedies are their own. Mileora curates and verifies them but does not endorse any particular reading.
      </p>

      <h2>4. Birth-detail accuracy</h2>
      <p>
        The accuracy of any astrology / numerology reading depends on the accuracy of the inputs you provide. Please share your correct date, time, and place of birth.
      </p>

      <h2>5. Fortune-telling jurisdictions</h2>
      <p>
        In some jurisdictions, astrology and divination are legally classified as &ldquo;entertainment.&rdquo; Where applicable, Mileora services are provided for entertainment and personal-development purposes.
      </p>

      <h2>6. External links</h2>
      <p>
        Our site may link to third-party temples, payment processors, and educational resources. We are not responsible for the content or practices of those external sites.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions? Email <a href="mailto:info@magnusconference.com">info@magnusconference.com</a>.
      </p>
    </>
  );
}
