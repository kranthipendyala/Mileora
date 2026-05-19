"use client";

const LEADS = [
  { id: 9214, name: "Priya M.",    phone: "+91 98XXX 22001", interest: "astrology",  source: "free_kundli",       status: "new",       at: "2 min ago" },
  { id: 9213, name: "Karthik S.",  phone: "+91 98XXX 22002", interest: "puja",       source: "home_lead_form",    status: "contacted", at: "14 min ago" },
  { id: 9212, name: "Anand R.",    phone: "+91 98XXX 22003", interest: "vasthu",     source: "guide_application",status: "new",       at: "32 min ago" },
  { id: 9211, name: "Bharati K.",  phone: "+91 98XXX 22004", interest: "numerology", source: "free_numerology",   status: "converted", at: "1 hr ago" },
  { id: 9210, name: "Selvam P.",   phone: "+91 98XXX 22005", interest: "jothisyam",  source: "free_compatibility",status: "contacted", at: "2 hr ago" },
];

export default function AdminLeads() {
  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Leads</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Form submissions across the site — assign, contact, convert.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {LEADS.map((l) => (
              <tr key={l.id} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-muted)]">{l.id}</td>
                <td className="px-4 py-3">
                  <p className="text-[color:var(--color-text)]">{l.name}</p>
                  <p className="text-xs text-[color:var(--color-text-muted)]">{l.phone}</p>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{l.interest}</td>
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-muted)]">{l.source}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    l.status === "new" ? "bg-rose-400/10 text-rose-200" :
                    l.status === "contacted" ? "bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-100)]" :
                    "bg-emerald-400/10 text-emerald-200"
                  }`}>{l.status}</span>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{l.at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
