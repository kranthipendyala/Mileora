"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, X } from "lucide-react";

const schema = z.object({
  rating: z.number().int().min(1, "Pick a rating").max(5),
  title:  z.string().max(200).optional().or(z.literal("")),
  body:   z.string().min(10, "Please share at least a sentence").max(2000),
});
type Values = z.infer<typeof schema>;

export function ReviewModal({
  bookingId,
  providerName,
  onClose,
  onSubmitted,
}: {
  bookingId: string;
  providerName: string;
  onClose: () => void;
  onSubmitted?: (rating: number) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, title: "", body: "" },
  });

  function pick(n: number) {
    setRating(n);
    setValue("rating", n, { shouldValidate: true });
  }

  async function onSubmit(v: Values) {
    setSubmitting(true);
    // TODO: apiUser('user').post('/reviews', { booking_id: bookingId, rating: v.rating, title: v.title, body: v.body })
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    onSubmitted?.(v.rating);
    setTimeout(onClose, 1400);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <div className="w-full max-w-lg rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Booking {bookingId}</p>
            <h2 id="review-title" className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl">
              How was your session with {providerName}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center text-emerald-200">
            🙏 Thank you for your review. It helps other seekers find the right guide.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Rating</span>
              <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => {
                  const lit = (hover || rating) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHover(n)}
                      onClick={() => pick(n)}
                      className="rounded p-1"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          lit
                            ? "fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]"
                            : "text-[color:var(--color-border)]"
                        }`}
                        aria-hidden
                      />
                    </button>
                  );
                })}
                <input type="hidden" {...register("rating", { valueAsNumber: true })} value={rating} />
              </div>
              {errors.rating && <p className="mt-1 text-xs text-rose-300">{errors.rating.message}</p>}
            </div>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Title (optional)</span>
              <input
                {...register("title")}
                placeholder='"Pinpoint accurate"'
                className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Your experience</span>
              <textarea
                {...register("body")}
                rows={5}
                placeholder="What did you appreciate? Would you recommend this guide?"
                className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
              />
              {errors.body && <p className="mt-1 text-xs text-rose-300">{errors.body.message}</p>}
            </label>

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[color:var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Post review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
