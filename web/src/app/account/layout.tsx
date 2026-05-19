"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, MapPin, Bell, MessageCircle, User, LogOut,
} from "lucide-react";
import { isAuthed, getProfile, clearSession } from "@/lib/auth";

const NAV = [
  { href: "/account",              label: "Overview",       Icon: LayoutDashboard },
  { href: "/account/bookings",     label: "My Bookings",    Icon: Calendar },
  { href: "/account/notifications", label: "Notifications", Icon: Bell },
  { href: "/account/chats",        label: "Messages",       Icon: MessageCircle },
  { href: "/account/addresses",    label: "Addresses",      Icon: MapPin },
  { href: "/account/profile",      label: "Profile",        Icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname() ?? "/account";
  const [ready, setReady] = useState(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!isAuthed("user")) {
      router.replace("/login?next=" + encodeURIComponent(path));
      return;
    }
    const p = getProfile("user");
    setName(p?.name ?? "you");
    setReady(true);
  }, [path, router]);

  function logout() {
    clearSession("user");
    router.replace("/");
  }

  if (!ready) {
    return (
      <div className="min-h-[60dvh] grid place-items-center">
        <div className="text-[color:var(--color-text-muted)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <p className="px-3 text-xs uppercase tracking-[0.2em] text-[color:var(--color-gold-300)]">My account</p>
          <p className="mt-1 px-3 text-sm text-[color:var(--color-text)]">{name}</p>
          <nav className="mt-5 flex flex-col gap-1">
            {NAV.map(({ href, label, Icon }) => {
              const active = path === href || (href !== "/account" && path.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-100)]"
                      : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface)]/60 hover:text-[color:var(--color-text)]"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface)]/60 hover:text-[color:var(--color-text)]"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 backdrop-blur lg:hidden">
        <nav className="flex justify-around">
          {NAV.slice(0, 5).map(({ href, label, Icon }) => {
            const active = path === href || (href !== "/account" && path.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] ${
                  active ? "text-[color:var(--color-gold-100)]" : "text-[color:var(--color-text-muted)]"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</div>
    </div>
  );
}
