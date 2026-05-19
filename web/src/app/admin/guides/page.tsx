"use client";

const GUIDES = [
  { id: 101, name: "Pandit Suresh Iyer",       specialty: "Vedic, Jothisyam", status: "active",  rating: 4.92, kyc: "verified" },
  { id: 102, name: "Dr. Meera Shastri",        specialty: "Numerology, KP",   status: "active",  rating: 4.86, kyc: "verified" },
  { id: 103, name: "Acharya Rajesh Kumar",     specialty: "Vasthu",           status: "active",  rating: 4.95, kyc: "verified" },
  { id: 104, name: "Smt. Lakshmi Narayanan",   specialty: "Jothisyam",        status: "active",  rating: 4.85, kyc: "verified" },
  { id: 105, name: "Application: G. Ramaswamy", specialty: "Vedic",           status: "pending", rating: 0,    kyc: "pending"  },
];

export default function AdminGuides() {
  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Guides</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">All guides and pending applications. Approve, suspend, or audit KYC.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Guide</th>
              <th className="px-4 py-3">Specialty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">KYC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {GUIDES.map((v) => (
              <tr key={v.id} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-muted)]">{v.id}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">{v.name}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{v.specialty}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${v.status === "active" ? "bg-emerald-400/10 text-emerald-200" : "bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-100)]"}`}>{v.status}</span>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-gold-100)]">{v.rating > 0 ? v.rating.toFixed(2) : "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${v.kyc === "verified" ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"}`}>{v.kyc}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
