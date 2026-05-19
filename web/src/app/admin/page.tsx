"use client";

import { TrendingUp, Users, UserCog, Wallet, AlertCircle } from "lucide-react";

const STATS = [
  { Icon: TrendingUp, label: "Revenue this month", value: "₹14.2L", trend: "+18%" },
  { Icon: Users, label: "Active users", value: "12,486", trend: "+342" },
  { Icon: UserCog, label: "Active guides", value: "127", trend: "+8" },
  { Icon: Wallet, label: "Pending payouts", value: "₹3.8L", trend: "due Fri" },
];

export default function AdminOverview() {
  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
        Admin <span className="text-gradient-gold">overview</span>
      </h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Platform KPIs at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ Icon, label, value, trend }) => (
          <div key={label} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-rose-300" aria-hidden />
              <span className="text-xs text-[color:var(--color-text-muted)]">{trend}</span>
            </div>
            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl">{value}</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Action required</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "3 guide applications awaiting review",
              "12 leads unassigned for more than 2 hours",
              "1 refund request flagged by Razorpay",
            ].map((it, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-lg border border-rose-400/20 bg-rose-400/5 p-3 text-[color:var(--color-text)]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Top guides this month</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { name: "Pandit Suresh Iyer", revenue: "₹84,950" },
              { name: "Dr. Meera Shastri",  revenue: "₹67,500" },
              { name: "Acharya Rajesh Kumar", revenue: "₹58,400" },
              { name: "Smt. Lakshmi Narayanan", revenue: "₹52,300" },
            ].map((v, i) => (
              <li key={i} className="flex items-center justify-between border-b border-[color:var(--color-border)]/60 pb-2 last:border-none">
                <span className="text-[color:var(--color-text)]">{v.name}</span>
                <span className="font-mono text-[color:var(--color-gold-100)]">{v.revenue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-xs text-[color:var(--color-text-muted)]">
        Demo data — wire <code>/api/v1/admin/dashboard</code> in CI3 to populate live KPIs.
      </p>
    </>
  );
}
