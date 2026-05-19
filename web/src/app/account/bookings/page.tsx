"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Star } from "lucide-react";
import { ReviewModal } from "@/components/booking/review-modal";

type Status = "upcoming" | "completed" | "cancelled";
type Booking = {
  id: string; type: "consultation" | "puja" | "report";
  title: string; provider: string; at: string;
  amount: string; status: Status; can_review?: boolean;
};

// TODO: apiUser('user').get<Envelope<Booking[]>>('/bookings')
const BOOKINGS: Booking[] = [
  { id: "MIL-1042", type: "consultation", title: "Vedic reading",                provider: "Pandit Suresh Iyer",     at: "Today, 4:30 PM",          amount: "₹999",   status: "upcoming" },
  { id: "MIL-1041", type: "puja",         title: "Kashi Rudrabhishek",           provider: "Kashi Vishwanath Temple", at: "Tomorrow, 8:00 AM",      amount: "₹2,511", status: "upcoming" },
  { id: "MIL-1040", type: "consultation", title: "Marriage porutham (compatibility)", provider: "Smt. Lakshmi Narayanan", at: "12 Apr, 10:30 AM",   amount: "₹1,499", status: "completed", can_review: true },
  { id: "MIL-1038", type: "consultation", title: "Vedic reading",                provider: "Pandit Suresh Iyer",     at: "5 Apr, 11:00 AM",         amount: "₹999",   status: "completed" },
  { id: "MIL-1037", type: "puja",         title: "Saraswati puja (board exams)", provider: "Sringeri Sharadamba",    at: "28 Mar, 6:00 AM",         amount: "₹999",   status: "completed" },
  { id: "MIL-1034", type: "consultation", title: "Annual forecast",              provider: "Acharya Rajesh Kumar",   at: "10 Feb, 7:00 PM",         amount: "₹2,499", status: "cancelled" },
];

export default function AccountBookings() {
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [reviewing, setReviewing] = useState<Booking | null>(null);

  const upcoming  = bookings.filter((b) => b.status === "upcoming");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  function onSubmitted(bookingId: string) {
    setBookings((all) => all.map((b) => (b.id === bookingId ? { ...b, can_review: false } : b)));
  }

  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">My Bookings</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Past consultations, upcoming pujas, and reports.</p>

      {upcoming.length > 0 && <Section title="Upcoming" items={upcoming} onReview={setReviewing} />}
      {completed.length > 0 && <Section title="Completed" items={completed} onReview={setReviewing} />}
      {cancelled.length > 0 && <Section title="Cancelled" items={cancelled} onReview={setReviewing} />}
      {bookings.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--color-border)] p-10 text-center text-[color:var(--color-text-muted)]">
          You haven't booked anything yet.{" "}
          <Link href="/book" className="text-[color:var(--color-gold-100)] underline">Book your first session</Link>.
        </div>
      )}

      {reviewing && (
        <ReviewModal
          bookingId={reviewing.id}
          providerName={reviewing.provider}
          onClose={() => setReviewing(null)}
          onSubmitted={() => onSubmitted(reviewing.id)}
        />
      )}
    </>
  );
}

function Section({ title, items, onReview }: { title: string; items: Booking[]; onReview: (b: Booking) => void }) {
  return (
    <section className="mt-8">
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{title}</h2>
      <ul className="mt-3 divide-y divide-[color:var(--color-border)]/60 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        {items.map((b) => (
          <li key={b.id} className="px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-cormorant)] text-xl text-[color:var(--color-text)]">{b.title}</p>
                <p className="text-sm text-[color:var(--color-text-muted)]">with {b.provider}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--color-text-muted)]">
                  <span className="font-mono">{b.id}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" aria-hidden /> {b.at}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden /> {b.type}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[color:var(--color-text)]">{b.amount}</p>
                <p className={`mt-1 text-xs ${
                  b.status === "upcoming" ? "text-[color:var(--color-gold-100)]" :
                  b.status === "completed" ? "text-emerald-200" :
                  "text-rose-300"
                }`}>{b.status}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {b.status === "upcoming" && (
                <button type="button" className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-1.5 text-xs text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]">
                  Open call link
                </button>
              )}
              {b.status === "upcoming" && (
                <button type="button" className="rounded-md border border-rose-400/30 bg-rose-400/5 px-3 py-1.5 text-xs text-rose-200 hover:border-rose-400/60">
                  Cancel
                </button>
              )}
              {b.status === "completed" && b.can_review && (
                <button
                  type="button"
                  onClick={() => onReview(b)}
                  className="inline-flex items-center gap-1 rounded-md bg-[color:var(--color-gold-500)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
                >
                  <Star className="h-3 w-3" aria-hidden /> Write a review
                </button>
              )}
              {b.status === "completed" && (
                <button type="button" className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-1.5 text-xs text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]">
                  Re-book
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
