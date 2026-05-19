"use client";

const PAYOUTS = [
  { id: "PO-2026-15", period: "5 Mar – 11 Mar", amount: "₹18,400", status: "scheduled", date: "12 Mar" },
  { id: "PO-2026-14", period: "26 Feb – 4 Mar",  amount: "₹21,150", status: "paid",      date: "5 Mar" },
  { id: "PO-2026-13", period: "19 Feb – 25 Feb", amount: "₹17,800", status: "paid",      date: "26 Feb" },
  { id: "PO-2026-12", period: "12 Feb – 18 Feb", amount: "₹19,600", status: "paid",      date: "19 Feb" },
];

export default function GuidePayouts() {
  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Payouts</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Weekly settlements via UPI / NEFT. Mileora fee: 15% (transparent, no surprises).</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--color-gold-500)]/40 bg-[color:var(--color-surface)] p-5">
          <p className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">Next payout</p>
          <p className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-gradient-gold">₹18,400</p>
          <p className="text-xs text-[color:var(--color-text-muted)]">scheduled 12 Mar 2026</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
          <p className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">This month</p>
          <p className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl">₹46,950</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
          <p className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">Lifetime</p>
          <p className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl">₹4,82,300</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Payout</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {PAYOUTS.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-gold-100)]">{p.id}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{p.period}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">{p.amount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.status === "paid" ? "bg-emerald-400/10 text-emerald-200" : "bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-100)]"}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
