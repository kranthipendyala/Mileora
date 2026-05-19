"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { isAuthed } from "@/lib/auth";
import { NotificationBell } from "./notification-bell";

/**
 * Right-hand cluster of the header: changes shape based on auth state.
 * Client-side because it reads localStorage. Renders nothing until mount
 * to avoid SSR/CSR hydration mismatch.
 */
export function HeaderActions() {
  const [mounted, setMounted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSignedIn(isAuthed("user"));
  }, []);

  if (!mounted) {
    // Server-rendered placeholder — matches the signed-out layout so layout
    // shift on hydration is minimal.
    return (
      <div className="flex items-center gap-3">
        <span className="hidden h-9 w-16 rounded-md sm:block" aria-hidden />
        <Link
          href="/book"
          className="rounded-md bg-[color:var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] transition-colors"
        >
          Book Now
        </Link>
      </div>
    );
  }

  if (signedIn) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <NotificationBell />
        <Link
          href="/account"
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold-100)]"
        >
          <User className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Account</span>
        </Link>
        <Link
          href="/book"
          className="rounded-md bg-[color:var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] transition-colors"
        >
          Book
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden rounded-md px-3 py-2 text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] sm:block"
      >
        Sign in
      </Link>
      <Link
        href="/book"
        className="rounded-md bg-[color:var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] transition-colors"
      >
        Book Now
      </Link>
    </div>
  );
}
