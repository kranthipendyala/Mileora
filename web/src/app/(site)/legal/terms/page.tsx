import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms governing your use of Mileora's astrology, numerology, vasthu, jothisyam and online puja services.",
  path: "/legal/terms",
});

export default function Terms() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Last updated: 1 May 2026</p>
      <h1 className="mt-2">Terms of Service</h1>
      <p className="lead">
        Please read these terms carefully before using Mileora. By accessing the website, mobile app, or any service provided by us, you agree to be bound by these terms.
      </p>

      <h2>1. Who we are</h2>
      <p>
        &ldquo;Mileora&rdquo; (we, us, our) is a service-booking and lead-generation platform connecting seekers with verified astrologers, numerologists, vasthu guides, Tamil jothidars, and online puja providers. Mileora is operated by Magnus Conference (&ldquo;the Company&rdquo;), based in India.
      </p>

      <h2>2. Eligibility</h2>
      <p>You must be 18 or older to book paid services. Free tools (kundli, numerology, horoscope) are available without age restriction but minors should use them with a parent's consent.</p>

      <h2>3. Services</h2>
      <h3>Consultations</h3>
      <p>Astrologer consultations are delivered by independent guides. Mileora curates and verifies them but does not guarantee specific outcomes.</p>
      <h3>Online pujas</h3>
      <p>Pujas are performed at the listed temples by hereditary or temple-appointed priests. We arrange live streaming and prasad delivery as part of the booking.</p>
      <h3>Reports</h3>
      <p>Free and paid reports are generated based on the inputs you provide. Accuracy of inputs is your responsibility.</p>

      <h2>4. Bookings & payments</h2>
      <ul>
        <li>All payments are processed via Razorpay. Mileora does not store card or banking credentials.</li>
        <li>Prices are inclusive of applicable taxes unless mentioned otherwise.</li>
        <li>A booking is confirmed only after successful payment and our confirmation message.</li>
      </ul>

      <h2>5. Cancellations & refunds</h2>
      <p>
        See our <a href="/legal/refunds">Refund Policy</a> for the full schedule. In short: free cancellation up to 60 minutes before consultation start; pujas can be rescheduled up to 24 hours before the chosen date.
      </p>

      <h2>6. Acceptable use</h2>
      <ul>
        <li>Do not use Mileora for any unlawful, abusive, or harmful purpose.</li>
        <li>Do not record consultations without the astrologer's consent.</li>
        <li>Do not impersonate another person or share misleading birth details.</li>
      </ul>

      <h2>7. Intellectual property</h2>
      <p>All Mileora content, logos, and software are owned by the Company and protected by Indian and international IP law. You may not copy or redistribute it without permission.</p>

      <h2>8. Limitation of liability</h2>
      <p>
        Astrology, numerology, vasthu and jothisyam are spiritual sciences and should not replace professional medical, legal, financial or psychological advice. Mileora and its guides are not liable for any decision you make based on a reading. To the fullest extent permitted by law, our total liability is limited to the amount you paid for the specific service in question.
      </p>

      <h2>9. Governing law</h2>
      <p>These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts in Chennai.</p>

      <h2>10. Changes to these terms</h2>
      <p>We may update these terms periodically. Material changes will be notified via email and a banner on the site. Continued use after changes constitutes acceptance.</p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:info@magnusconference.com">info@magnusconference.com</a>.
      </p>
    </>
  );
}
