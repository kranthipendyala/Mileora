"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LayoutDashboard, Calendar, Tag, Wallet, User, LogOut, Menu, X } from "lucide-react";
import { isAuthed, getProfile, clearSession } from "@/lib/auth";

const NAV = [
  { href: "/guide", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/guide/bookings", label: "Bookings", Icon: Calendar },
  { href: "/guide/services", label: "Services", Icon: Tag },
  { href: "/guide/payouts", label: "Payouts", Icon: Wallet },
  { href: "/guide/profile", label: "Profile", Icon: User },
];

const PUBLIC_GUIDE_ROUTES = ["/guide/login", "/guide/register"];

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname() ?? "/guide";
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [open, setOpen] = useState(false);

  const isPublic = PUBLIC_GUIDE_ROUTES.includes(path);

  useEffect(() => {
    if (isPublic) {
      setReady(true);
      return;
    }
    if (!isAuthed("guide")) {
      router.replace("/guide/login");
      return;
    }
    setProfile(getProfile("guide"));
    setReady(true);
  }, [path, isPublic, router]);

  function logout() {
    clearSession("guide");
    router.replace("/guide/login");
  }

  if (isPublic) {
    return <div className="min-h-dvh bg-cosmic">{children}</div>;
  }

  if (!ready) {
    return (
      <div className="min-h-dvh bg-cosmic grid place-items-center">
        <div className="text-[color:var(--color-text-muted)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cosmic">
      {/* Portal topbar */}
      <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)]/60 bg-[color:var(--color-bg-elev)]/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/guide" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[color:var(--color-gold-300)]" aria-hidden />
            <span className="font-[family-name:var(--font-cormorant)] text-xl text-gradient-gold">Mileora</span>
            <span className="ml-2 rounded-full border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[color:var(--color-gold-100)]">
              Guide portal
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden rounded-md border border-[color:var(--color-border)] p-2 text-[color:var(--color-text)]"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-sm text-[color:var(--color-text-muted)]">Hi, {profile?.name ?? "guide"}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1.5 text-sm text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + content */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside
          className={`${
            open ? "block" : "hidden"
          } absolute inset-x-0 top-14 z-20 mx-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 p-3 lg:static lg:mx-0 lg:block lg:w-56 lg:rounded-2xl lg:p-4`}
        >
          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, Icon }) => {
              const active = path === href || (href !== "/guide" && path.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-100)]"
                      : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="mt-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)] lg:hidden"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
