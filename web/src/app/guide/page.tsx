"use client";

import { Calendar, Wallet, Star, TrendingUp } from "lucide-react";

const STATS = [
  { Icon: Calendar, label: "Bookings this month", value: "47", trend: "+12%" },
  { Icon: TrendingUp, label: "Revenue (₹)", value: "₹46,950", trend: "+8%" },
  { Icon: Star, label: "Avg rating", value: "4.92", trend: "+0.04" },
  { Icon: Wallet, label: "Pending payout", value: "₹18,400", trend: "5 Mar" },
];

const UPCOMING = [
  { time: "Today, 4:30 PM", customer: "Anitha R.", service: "Vedic consultation", duration: "30 min" },
  { time: "Today, 6:00 PM", customer: "Ravi K.", service: "Tamil jothisyam", duration: "30 min" },
  { time: "Tomorrow, 10:30 AM", customer: "Meera S.", service: "Marriage porutham", duration: "45 min" },
  { time: "Tomorrow, 2:00 PM", customer: "Vikram T.", service: "Annual forecast", duration: "60 min" },
];

export default function GuideDashboard() {
  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
            <span className="text-gradient-gold">Namaste</span>, Suresh
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Here's your day at a glance.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ Icon, label, value, trend }) => (
          <div key={label} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
              <span className="text-xs text-[color:var(--color-text-muted)]">{trend}</span>
            </div>
            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl text-[color:var(--color-text)]">{value}</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6">
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Upcoming consultations</h2>
        <div className="mt-4 divide-y divide-[color:var(--color-border)]/60">
          {UPCOMING.map((b, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div>
                <p className="text-[color:var(--color-text)]">{b.customer} · {b.service}</p>
                <p className="text-xs text-[color:var(--color-text-muted)]">{b.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-[color:var(--color-gold-100)]">{b.time}</p>
                <button type="button" className="mt-1 text-xs text-[color:var(--color-text-muted)] underline hover:text-[color:var(--color-text)]">Open call</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-[color:var(--color-text-muted)]">
        Demo data — wire <code>/api/v1/guide/dashboard</code> in CI3 to populate live numbers.
      </p>
    </>
  );
}
