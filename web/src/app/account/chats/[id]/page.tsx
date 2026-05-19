"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Send, Paperclip } from "lucide-react";
import { MOCK_THREADS, MOCK_MESSAGES, type ChatMessage } from "@/lib/mock-account";

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}
function fmtDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const CURRENT_USER_ID = 4821; // matches login-form demo

export default function ChatThread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const threadId = Number(id);
  const thread = MOCK_THREADS.find((t) => t.id === threadId);

  // TODO: apiUser('user').get<Envelope<ChatMessage[]>>(`/chat/threads/${threadId}/messages`)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES[threadId] ?? []);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (!thread) {
    return (
      <div className="grid min-h-[40dvh] place-items-center">
        <p className="text-[color:var(--color-text-muted)]">Conversation not found.</p>
      </div>
    );
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    // TODO: apiUser('user').post(`/chat/threads/${threadId}/messages`, { body })
    const optimistic: ChatMessage = {
      id: Date.now(),
      thread_id: threadId,
      sender_id: CURRENT_USER_ID,
      sender_role: "user",
      body,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((m) => [...m, optimistic]);
    setDraft("");
    setSending(false);
  }

  // Group messages by day for divider rendering
  const grouped: { day: string; items: ChatMessage[] }[] = [];
  for (const m of [...messages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())) {
    const day = fmtDay(m.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) last.items.push(m);
    else grouped.push({ day, items: [m] });
  }

  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
      {/* Thread header */}
      <div className="flex items-center gap-3 border-b border-[color:var(--color-border)]/60 px-4 py-3">
        <Link href="/account/chats" className="rounded-md p-1 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]">
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Link>
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-[color:var(--color-gold-500)]/20">
          <Image src={thread.guide_photo} alt={thread.guide_name} fill sizes="40px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[color:var(--color-text)]">{thread.guide_name}</p>
          <p className="text-xs text-[color:var(--color-text-muted)]">Mileora guide · usually replies within an hour</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {grouped.length === 0 && (
          <p className="grid h-full place-items-center text-sm text-[color:var(--color-text-muted)]">
            No messages yet. Say namaste 🙏
          </p>
        )}
        {grouped.map((g) => (
          <div key={g.day}>
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[color:var(--color-border)]/60" />
              <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">{g.day}</span>
              <div className="h-px flex-1 bg-[color:var(--color-border)]/60" />
            </div>
            <ul className="space-y-2">
              {g.items.map((m) => {
                const mine = m.sender_id === CURRENT_USER_ID;
                return (
                  <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        mine
                          ? "bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-text)] rounded-br-sm"
                          : "bg-[color:var(--color-bg)]/80 text-[color:var(--color-text)] rounded-bl-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{m.body}</p>
                      <p className="mt-1 text-[10px] text-[color:var(--color-text-muted)] text-right">{fmtTime(m.created_at)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form onSubmit={send} className="flex items-center gap-2 border-t border-[color:var(--color-border)]/60 px-3 py-3">
        <button type="button" className="rounded-md p-2 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]" aria-label="Attach">
          <Paperclip className="h-4 w-4" aria-hidden />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="inline-flex items-center gap-1 rounded-md bg-[color:var(--color-gold-500)] px-3 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" aria-hidden /> Send
        </button>
      </form>
    </div>
  );
}
