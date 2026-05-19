"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, Users, UserCog, Flame, FileText, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { isAuthed, getProfile, clearSession } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", Icon: Users },
  { href: "/admin/guides", label: "Guides", Icon: UserCog },
  { href: "/admin/pujas", label: "Pujas", Icon: Flame },
  { href: "/admin/leads", label: "Leads", Icon: ClipboardList },
  { href: "/admin/articles", label: "Articles", Icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname() ?? "/admin";
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [open, setOpen] = useState(false);

  const isPublic = path === "/admin/login";

  useEffect(() => {
    if (isPublic) {
      setReady(true);
      return;
    }
    if (!isAuthed("admin")) {
      router.replace("/admin/login");
      return;
    }
    setProfile(getProfile("admin"));
    setReady(true);
  }, [path, isPublic, router]);

  function logout() {
    clearSession("admin");
    router.replace("/admin/login");
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
      <header className="sticky top-0 z-30 border-b border-rose-400/20 bg-[color:var(--color-bg-elev)]/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-rose-300" aria-hidden />
            <span className="font-[family-name:var(--font-cormorant)] text-xl text-gradient-gold">Mileora</span>
            <span className="ml-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-rose-200">
              Admin
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
            <span className="text-sm text-[color:var(--color-text-muted)]">{profile?.name ?? "admin"}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1.5 text-sm text-[color:var(--color-text)] hover:border-rose-400/40"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside
          className={`${
            open ? "block" : "hidden"
          } absolute inset-x-0 top-14 z-20 mx-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 p-3 lg:static lg:mx-0 lg:block lg:w-56 lg:rounded-2xl lg:p-4`}
        >
          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, Icon }) => {
              const active = path === href || (href !== "/admin" && path.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-rose-400/10 text-rose-200"
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
