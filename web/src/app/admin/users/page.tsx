"use client";

const USERS = [
  { id: 4821, name: "Anitha Ramaswamy", phone: "+91 98XXX 12340", joined: "2026-04-22", bookings: 3 },
  { id: 4820, name: "Ravi Krishnan",     phone: "+91 98XXX 12341", joined: "2026-04-21", bookings: 1 },
  { id: 4819, name: "Meera Sharma",      phone: "+91 98XXX 12342", joined: "2026-04-20", bookings: 2 },
  { id: 4818, name: "Vikram Tiwari",     phone: "+91 98XXX 12343", joined: "2026-04-19", bookings: 5 },
  { id: 4817, name: "Sandhya Reddy",     phone: "+91 98XXX 12344", joined: "2026-04-18", bookings: 1 },
];

export default function AdminUsers() {
  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Users</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">All registered customers — search, filter, and inspect.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Bookings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {USERS.map((u) => (
              <tr key={u.id} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-muted)]">{u.id}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">{u.name}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{u.phone}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{u.joined}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">{u.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
