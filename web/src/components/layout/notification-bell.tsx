"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { isAuthed } from "@/lib/auth";
import { MOCK_NOTIFICATIONS, type Notification } from "@/lib/mock-account";

// TODO: replace with apiUser('user').get<Envelope<Notification[]>>('/notifications')
// and apiUser('user').get<Envelope<{unread_count: number}>>('/notifications/unread-count')
function useNotifications(): { items: Notification[]; unread: number } {
  const items = MOCK_NOTIFICATIONS;
  const unread = items.filter((n) => !n.read_at).length;
  return { items, unread };
}

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { items, unread } = useNotifications();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Only show the bell if a user is signed in. Hydration-safe: starts hidden,
  // appears after mount so the SSR HTML doesn't include it.
  if (!mounted) return null;
  if (!isAuthed("user")) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-md p-2 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface)]/60 hover:text-[color:var(--color-gold-100)]"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-medium text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-[color:var(--color-border)]/60 px-4 py-3">
            <p className="font-medium text-[color:var(--color-text)]">Notifications</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-[color:var(--color-gold-100)] hover:underline"
            >
              <Check className="h-3 w-3" aria-hidden /> Mark all read
            </button>
          </div>
          <ul className="max-h-[60vh] divide-y divide-[color:var(--color-border)]/40 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-[color:var(--color-text-muted)]">
                No notifications yet
              </li>
            )}
            {items.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.cta_url ?? "#"}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 px-4 py-3 hover:bg-[color:var(--color-bg)]/60 ${
                    n.read_at ? "opacity-70" : ""
                  }`}
                >
                  <div
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.read_at ? "bg-transparent" : "bg-[color:var(--color-gold-300)]"
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[color:var(--color-text)]">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--color-text-muted)]">{n.body}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-[color:var(--color-border)]/60 px-4 py-2 text-center">
            <Link
              href="/account/notifications"
              onClick={() => setOpen(false)}
              className="text-xs text-[color:var(--color-gold-100)] hover:underline"
            >
              See all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
