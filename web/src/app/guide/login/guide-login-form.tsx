"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSession } from "@/lib/auth";

export function GuideLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setSubmitting(true);
    // TODO: POST /api/auth/guide/send-otp -> CI3
    setTimeout(() => {
      setSubmitting(false);
      setStep("otp");
    }, 700);
  }

  function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{4,6}$/.test(otp)) {
      setError("Enter the OTP sent to your phone");
      return;
    }
    setSubmitting(true);
    // TODO: POST /api/auth/guide/verify -> get { token, profile, role: 'guide' }
    // For now, simulate a successful login so the rest of the portal is walkable.
    setTimeout(() => {
      setSession("guide", "demo-guide-jwt", {
        id: 101,
        name: "Pandit Suresh Iyer",
        phone,
        role: "guide",
      });
      setSubmitting(false);
      router.push("/guide");
    }, 700);
  }

  if (step === "phone") {
    return (
      <form onSubmit={onSendOtp} className="space-y-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Guide mobile number</span>
          <div className="mt-1.5 flex items-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 focus-within:border-[color:var(--color-gold-500)]">
            <span className="px-3 text-[color:var(--color-text-muted)]">+91</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputMode="numeric"
              placeholder="98XXXXXXXX"
              className="flex-1 bg-transparent py-2.5 pr-3 text-sm text-[color:var(--color-text)] outline-none"
              autoComplete="tel"
              autoFocus
            />
          </div>
        </label>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-[color:var(--color-gold-500)] px-4 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
        >
          {submitting ? "Sending OTP…" : "Send OTP"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onVerifyOtp} className="space-y-4">
      <p className="text-sm text-[color:var(--color-text-muted)]">
        OTP sent to <strong className="text-[color:var(--color-text)]">+91 {phone}</strong>{" "}
        <button type="button" onClick={() => setStep("phone")} className="text-xs text-[color:var(--color-gold-100)] underline">
          change
        </button>
      </p>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Enter OTP</span>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          placeholder="• • • •"
          className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-3 text-center text-xl tracking-[0.5em] text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
        />
      </label>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-[color:var(--color-gold-500)] px-4 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
      >
        {submitting ? "Verifying…" : "Sign in to guide portal"}
      </button>
      <p className="text-xs text-[color:var(--color-text-muted)] text-center">
        Demo mode — any 4-digit OTP signs you in. Wire up <code>/api/auth/guide/verify</code> to enable real OTPs.
      </p>
    </form>
  );
}
