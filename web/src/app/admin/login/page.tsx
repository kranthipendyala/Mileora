import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = buildMetadata({
  title: "Admin Sign In",
  description: "Mileora admin console.",
  path: "/admin/login",
  noindex: true,
});

export default function AdminLogin() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-surface)] ring-1 ring-rose-400/30">
            <ShieldCheck className="h-7 w-7 text-rose-300" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-200">Admin console</p>
          <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
            Sign in to <span className="text-gradient-gold">Mileora Admin</span>
          </h1>
          <p className="mt-2 text-[color:var(--color-text-muted)]">For platform operators only.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-card)]">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
