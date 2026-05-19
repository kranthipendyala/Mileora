"use client";

import Link from "next/link";
import Image from "next/image";
import { MOCK_THREADS } from "@/lib/mock-account";

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function ChatsList() {
  // TODO: apiUser('user').get<Envelope<ChatThread[]>>('/chat/threads')
  const threads = MOCK_THREADS;

  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Conversations with your guides.</p>

      <ul className="mt-8 divide-y divide-[color:var(--color-border)]/60 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        {threads.length === 0 && (
          <li className="px-5 py-16 text-center text-sm text-[color:var(--color-text-muted)]">
            No conversations yet. Book a consultation to chat with a guide.
          </li>
        )}
        {threads.map((t) => (
          <li key={t.id}>
            <Link href={`/account/chats/${t.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-[color:var(--color-bg)]/40">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-[color:var(--color-gold-500)]/20">
                <Image src={t.guide_photo} alt={t.guide_name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-[color:var(--color-text)]">{t.guide_name}</p>
                  <span className="text-xs text-[color:var(--color-text-muted)]">{timeAgo(t.last_message_at)}</span>
                </div>
                <p className="truncate text-sm text-[color:var(--color-text-muted)]">{t.last_message_preview}</p>
              </div>
              {t.unread > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--color-gold-500)] px-1.5 text-[11px] font-medium text-[color:var(--color-bg)]">
                  {t.unread}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
