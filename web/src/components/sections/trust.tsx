import { ShieldCheck, Award, Lock, MessageCircle } from "lucide-react";

const POINTS = [
  { icon: ShieldCheck, title: "Verified astrologers", desc: "Background-checked, scripture-trained, rated by real users." },
  { icon: Award, title: "Satisfaction guarantee", desc: "Not happy with your reading? Free re-do or full refund." },
  { icon: Lock, title: "100% confidential", desc: "End-to-end encrypted chats. Your kundli stays yours." },
  { icon: MessageCircle, title: "24×7 support", desc: "Real humans on chat & WhatsApp, not bots." },
];

export function Trust() {
  return (
    <section className="border-y border-[color:var(--color-border)]/60 bg-[color:var(--color-bg-elev)]/40 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-bg)]/80 ring-1 ring-[color:var(--color-gold-500)]/30">
                <Icon className="h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
              </div>
              <div>
                <h3 className="font-medium text-[color:var(--color-text)]">{p.title}</h3>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
