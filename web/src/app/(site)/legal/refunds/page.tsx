import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund & Cancellation Policy",
  description: "Mileora's transparent refund and cancellation policy for consultations, online pujas and reports.",
  path: "/legal/refunds",
});

export default function Refunds() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Last updated: 1 May 2026</p>
      <h1 className="mt-2">Refund & Cancellation Policy</h1>
      <p className="lead">
        We want every Mileora experience to feel sacred and worthwhile. If something goes wrong, we make it right.
      </p>

      <h2>Consultations</h2>
      <ul>
        <li><strong>Free cancellation</strong> up to 60 minutes before the start time — full refund within 5 working days.</li>
        <li>Cancellation within 60 minutes of start time — 50% refund.</li>
        <li>No-shows — no refund (the astrologer's slot was held).</li>
        <li>If the astrologer is late or fails to join — full refund + free re-booking.</li>
      </ul>

      <h2>Satisfaction guarantee</h2>
      <p>
        Not happy with your reading? Email us within 48 hours of the consultation. We will either rebook you with another expert <strong>free of charge</strong> or process a full refund — your choice.
      </p>

      <h2>Online pujas</h2>
      <ul>
        <li><strong>Reschedule</strong> up to 24 hours before — free.</li>
        <li>Cancellation 24+ hours before — 80% refund (20% covers temple coordination already done).</li>
        <li>Cancellation under 24 hours — no refund (priest sankalpam and materials already prepared).</li>
        <li>If the temple cannot perform the puja on the chosen date — full refund or free reschedule.</li>
      </ul>

      <h2>Reports & PDFs</h2>
      <p>Personalized reports are non-refundable once delivered. If the report has factual errors caused by us, we'll regenerate it free.</p>

      <h2>Failed payments</h2>
      <p>If your bank deducted money but the booking did not confirm, the amount is automatically reversed by Razorpay within 5–7 working days. Email us if it doesn't.</p>

      <h2>How refunds reach you</h2>
      <p>
        Refunds are processed back to the original payment method. UPI: 1–2 working days. Cards/netbanking: 5–7 working days. Wallets: 1–3 working days.
      </p>

      <h2>How to request a cancellation or refund</h2>
      <p>
        Email <a href="mailto:info@magnusconference.com">info@magnusconference.com</a> with your booking ID, or use the &ldquo;Cancel booking&rdquo; button in your account dashboard.
      </p>
    </>
  );
}
