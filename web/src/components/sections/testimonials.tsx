import { Star } from "lucide-react";

const ITEMS = [
  {
    name: "Anitha R.",
    location: "Chennai",
    rating: 5,
    quote:
      "Pandit Suresh's jothisyam reading was uncannily accurate. The remedy he suggested for my career stagnation actually worked within three months.",
  },
  {
    name: "Ravi K.",
    location: "Bengaluru",
    rating: 5,
    quote:
      "We booked the Rudrabhishek puja at Kashi for our wedding anniversary. Live stream was crystal clear and the prasad arrived in two days. Felt blessed.",
  },
  {
    name: "Meera S.",
    location: "Mumbai",
    rating: 5,
    quote:
      "The vasthu audit reorganized our home office and within weeks my husband landed a major client. Worth every rupee.",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-300)]">
            Trusted by seekers worldwide
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">
            What our community is <span className="text-gradient-gold">saying</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ITEMS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-7 shadow-[var(--shadow-card)]"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]"
                    aria-hidden
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-[color:var(--color-text)]/90">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 text-sm text-[color:var(--color-text-muted)]">
                <span className="font-medium text-[color:var(--color-text)]">{t.name}</span> · {t.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
