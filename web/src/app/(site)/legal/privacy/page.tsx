import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Mileora collects, uses, and protects your personal data — including birth details and consultation records.",
  path: "/legal/privacy",
});

export default function Privacy() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Last updated: 1 May 2026</p>
      <h1 className="mt-2">Privacy Policy</h1>
      <p className="lead">
        Your trust is sacred to us. This policy explains what we collect, why, how long we keep it, and your rights — in plain language.
      </p>

      <h2>1. Data we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li><strong>Identity:</strong> name, gender, phone number, email.</li>
        <li><strong>Birth details:</strong> date, time, and place of birth (required for kundli, jothisyam, numerology).</li>
        <li><strong>Booking data:</strong> services purchased, sankalpam (intentions), gotra.</li>
        <li><strong>Communication:</strong> messages you send to astrologers or our support team.</li>
      </ul>
      <h3>Information we collect automatically</h3>
      <ul>
        <li>Device, browser, IP, approximate location.</li>
        <li>Pages visited, features used, anonymous analytics.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To deliver the service you booked (consultation, puja, report).</li>
        <li>To send confirmations, reminders, and prasad shipping updates.</li>
        <li>To improve the platform — strictly aggregated, never identifying you.</li>
        <li>To prevent fraud and abuse.</li>
      </ul>

      <h2>3. What we never do</h2>
      <ul>
        <li>We do <strong>not</strong> sell your data to third parties.</li>
        <li>We do <strong>not</strong> share your kundli or sankalpam with anyone outside the assigned astrologer/temple.</li>
        <li>We do <strong>not</strong> use your birth details for advertising.</li>
      </ul>

      <h2>4. Sharing</h2>
      <p>We share data only with:</p>
      <ul>
        <li>The specific astrologer / temple you booked, limited to what's needed for the service.</li>
        <li>Razorpay (payments), MSG91 (SMS/WhatsApp), AWS / DigitalOcean (hosting), Brevo (email) — all under strict data-processing agreements.</li>
        <li>Indian government authorities only when legally compelled.</li>
      </ul>

      <h2>5. Retention</h2>
      <ul>
        <li>Account & booking records: 7 years (tax/regulatory requirement).</li>
        <li>Birth details: indefinitely while your account is active; deleted within 30 days of account deletion.</li>
        <li>Chat transcripts: 90 days, then anonymized.</li>
        <li>Anonymous analytics: 24 months.</li>
      </ul>

      <h2>6. Your rights</h2>
      <p>Under the Digital Personal Data Protection Act, 2023 you can:</p>
      <ul>
        <li>Access a copy of your data</li>
        <li>Correct inaccurate data</li>
        <li>Delete your account and associated data</li>
        <li>Withdraw consent for marketing communication</li>
      </ul>
      <p>
        Email{" "}
        <a href="mailto:info@magnusconference.com">info@magnusconference.com</a> with the subject line &ldquo;Data request&rdquo;. We respond within 7 days.
      </p>

      <h2>7. Security</h2>
      <p>
        Data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access is role-based and audited. We have not had a reported breach to date; if one occurs, we will notify affected users within 72 hours.
      </p>

      <h2>8. Children</h2>
      <p>Mileora is not directed at children under 13. We do not knowingly collect data from children.</p>

      <h2>9. Cookies</h2>
      <p>We use a minimum of cookies — only those needed for sign-in and anti-fraud, plus optional analytics. You can disable analytics in the cookie banner.</p>

      <h2>10. Contact</h2>
      <p>
        Privacy questions? Reach our Data Protection Officer at{" "}
        <a href="mailto:info@magnusconference.com">info@magnusconference.com</a>.
      </p>
    </>
  );
}
