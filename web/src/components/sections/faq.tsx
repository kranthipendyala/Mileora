import { JsonLd, faqJsonLd } from "@/components/seo/json-ld";

const HOME_FAQS = [
  {
    q: "How accurate are Mileora's astrology readings?",
    a: "Every astrologer on Mileora is verified, scripture-trained, and rated by real users. We back every paid reading with a satisfaction guarantee — if you're not happy, we offer a free re-do or full refund.",
  },
  {
    q: "Is the free kundli really free?",
    a: "Yes — your basic Vedic birth chart with rasi, navamsa, and dasha periods is completely free. Detailed predictions and remedies are available as a premium PDF report or via a paid consultation.",
  },
  {
    q: "How does an online puja work?",
    a: "You choose the puja and date, share your sankalpam (name + gotra). On the day, the ritual is performed at the temple in your name with a private live stream. Prasad is shipped to your door within 2–4 days.",
  },
  {
    q: "Are payments secure?",
    a: "All payments are processed via Razorpay with bank-grade encryption. We support UPI, cards, netbanking, and wallets. Mileora never stores your card details.",
  },
  {
    q: "Can I talk to an astrologer in Tamil or Hindi?",
    a: "Yes — filter astrologers by language. Most of our guides offer consultations in English, Tamil, Hindi, Telugu, Kannada, or Malayalam.",
  },
];

type Item = { q: string; a: string };

export function FaqList({ items, title = "Common questions", emitJsonLd = true }: {
  items?: Item[];
  title?: string;
  emitJsonLd?: boolean;
}) {
  const list = items ?? HOME_FAQS;
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      {emitJsonLd && <JsonLd data={faqJsonLd(list)} />}
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-300)]">FAQ</p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">
            {title.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{title.split(" ").slice(-1)}</span>
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {list.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5 open:border-[color:var(--color-gold-500)]/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-[color:var(--color-text)]">
                {f.q}
                <span className="text-[color:var(--color-gold-300)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[color:var(--color-text-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Backward-compatible export used by the home page
export const Faq = () => <FaqList />;
