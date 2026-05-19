"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { MOCK_NOTIFICATIONS, type Notification } from "@/lib/mock-account";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
}

export default function AccountNotifications() {
  // TODO: replace with apiUser('user').get<Envelope<Notification[]>>('/notifications')
  const [items, setItems] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  function markRead(id: number) {
    setItems((all) => all.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    // TODO: apiUser('user').post(`/notifications/${id}/read`)
  }
  function markAllRead() {
    setItems((all) => all.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })));
    // TODO: apiUser('user').post('/notifications/read-all')
  }

  const unread = items.filter((n) => !n.read_at).length;

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1.5 text-xs text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]"
          >
            <Check className="h-3.5 w-3.5" aria-hidden /> Mark all read
          </button>
        )}
      </div>

      <ul className="mt-8 divide-y divide-[color:var(--color-border)]/60 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        {items.length === 0 && (
          <li className="px-5 py-16 text-center text-sm text-[color:var(--color-text-muted)]">
            You have no notifications yet.
          </li>
        )}
        {items.map((n) => (
          <li key={n.id} className={`flex gap-3 px-5 py-4 ${n.read_at ? "opacity-70" : ""}`}>
            <span
              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                n.read_at ? "bg-transparent" : "bg-[color:var(--color-gold-300)]"
              }`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <Link
                href={n.cta_url ?? "#"}
                onClick={() => markRead(n.id)}
                className="block"
              >
                <p className="font-medium text-[color:var(--color-text)]">{n.title}</p>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{n.body}</p>
              </Link>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                {fmtDate(n.created_at)}
              </p>
            </div>
            {!n.read_at && (
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className="self-start text-xs text-[color:var(--color-gold-100)] hover:underline"
              >
                Mark read
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
