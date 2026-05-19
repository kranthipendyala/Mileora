"use client";

const ROWS = [
  { id: "MIL-1042", customer: "Anitha R.", service: "Vedic consultation", date: "2026-05-16 16:30", amount: "₹999", status: "confirmed" },
  { id: "MIL-1041", customer: "Ravi K.", service: "Tamil jothisyam", date: "2026-05-16 18:00", amount: "₹999", status: "confirmed" },
  { id: "MIL-1040", customer: "Meera S.", service: "Marriage porutham", date: "2026-05-17 10:30", amount: "₹1,499", status: "confirmed" },
  { id: "MIL-1039", customer: "Vikram T.", service: "Annual forecast", date: "2026-05-17 14:00", amount: "₹2,499", status: "confirmed" },
  { id: "MIL-1038", customer: "Sandhya R.", service: "Vedic consultation", date: "2026-05-15 11:00", amount: "₹999", status: "completed" },
  { id: "MIL-1037", customer: "Naveen P.", service: "Vedic consultation", date: "2026-05-14 19:00", amount: "₹999", status: "completed" },
];

export default function GuideBookings() {
  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Bookings</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">All consultations across past, today, and upcoming.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {ROWS.map((r) => (
              <tr key={r.id} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-gold-100)]">{r.id}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">{r.customer}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{r.service}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{r.date}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">{r.amount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${r.status === "confirmed" ? "bg-emerald-400/10 text-emerald-200" : "bg-[color:var(--color-bg)] text-[color:var(--color-text-muted)]"}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
