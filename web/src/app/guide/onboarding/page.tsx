"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, FileText, Landmark, Clock, Upload } from "lucide-react";

type Step = 1 | 2 | 3;

const docSchema = z.object({
  doc_type: z.enum(["pan", "aadhaar", "certificate", "gst", "other"]),
  doc_number: z.string().optional().or(z.literal("")),
  file_url: z.string().min(1, "Please upload a file"),
});

const bankSchema = z.object({
  account_name:   z.string().min(2, "Required"),
  account_number: z.string().regex(/^\d{6,18}$/, "6-18 digits"),
  ifsc:           z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Format: ABCD0EFGH12"),
  bank_name:      z.string().optional().or(z.literal("")),
});

type DocValues = z.infer<typeof docSchema>;
type BankValues = z.infer<typeof bankSchema>;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function GuideOnboarding() {
  const [step, setStep] = useState<Step>(1);
  const [doneSteps, setDoneSteps] = useState<Record<Step, boolean>>({ 1: false, 2: false, 3: false });

  function markDone(s: Step, next?: Step) {
    setDoneSteps((d) => ({ ...d, [s]: true }));
    if (next) setStep(next);
  }

  const allDone = doneSteps[1] && doneSteps[2] && doneSteps[3];

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">
          Guide onboarding
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
          Three steps to <span className="text-gradient-gold">go live</span>
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
          Submit your KYC, bank details, and weekly availability. Our team reviews within 48 hours.
        </p>
      </div>

      {/* Stepper */}
      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        <StepCard n={1} active={step === 1} done={doneSteps[1]} Icon={FileText} label="Documents (KYC)" onClick={() => setStep(1)} />
        <StepCard n={2} active={step === 2} done={doneSteps[2]} Icon={Landmark} label="Bank account" onClick={() => setStep(2)} />
        <StepCard n={3} active={step === 3} done={doneSteps[3]} Icon={Clock} label="Availability" onClick={() => setStep(3)} />
      </ol>

      <div className="mt-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6 sm:p-8">
        {step === 1 && <StepDocuments onDone={() => markDone(1, 2)} />}
        {step === 2 && <StepBank onDone={() => markDone(2, 3)} />}
        {step === 3 && <StepAvailability onDone={() => markDone(3)} />}
      </div>

      {allDone && (
        <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center text-emerald-200">
          🙏 Onboarding submitted. Our team will review your KYC + bank details within 48 hours. You'll get an email + WhatsApp once approved.
        </div>
      )}
    </>
  );
}

function StepCard({
  n, active, done, Icon, label, onClick,
}: {
  n: number; active: boolean; done: boolean;
  Icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
        active
          ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]/10"
          : done
            ? "border-emerald-400/30 bg-emerald-400/5"
            : "border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40"
      }`}
    >
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
        done ? "bg-emerald-400/20 text-emerald-200" :
        active ? "bg-[color:var(--color-gold-500)] text-[color:var(--color-bg)]" :
        "bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]"
      }`}>
        {done ? <Check className="h-4 w-4" aria-hidden /> : <span className="font-mono text-sm">{n}</span>}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">Step {n}</p>
        <p className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-text)]">
          <Icon className="h-3.5 w-3.5 text-[color:var(--color-gold-300)]" /> {label}
        </p>
      </div>
    </button>
  );
}

function StepDocuments({ onDone }: { onDone: () => void }) {
  const [uploads, setUploads] = useState<DocValues[]>([]);
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<DocValues>({
    resolver: zodResolver(docSchema),
    defaultValues: { doc_type: "pan", file_url: "" },
  });

  async function submit(v: DocValues) {
    setBusy(true);
    // TODO: real file upload -> S3 presigned URL -> apiUser('guide').post('/guide/onboarding/document', { ...v, file_url })
    await new Promise((r) => setTimeout(r, 400));
    setUploads((u) => [...u, v]);
    reset({ doc_type: "pan", file_url: "" });
    setBusy(false);
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Documents (KYC)</h2>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
        Upload PAN, Aadhaar, and any certificates (jyotisha diploma, gurukul attestation).
      </p>

      <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Document type</span>
          <select {...register("doc_type")} className="input mt-1.5">
            <option value="pan">PAN</option>
            <option value="aadhaar">Aadhaar</option>
            <option value="certificate">Certificate</option>
            <option value="gst">GST</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Document number (optional)</span>
          <input {...register("doc_number")} placeholder="ABCDE1234F" className="input mt-1.5" />
        </label>
        <div className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">File</span>
          <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-4 py-2.5 text-sm text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]">
            <Upload className="h-4 w-4" aria-hidden /> Upload
            <input
              type="file"
              className="sr-only"
              accept="image/*,.pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setValue("file_url", `mock://uploads/${f.name}`, { shouldValidate: true });
              }}
            />
          </label>
        </div>
        {errors.file_url && <p className="sm:col-span-3 text-xs text-rose-300">{errors.file_url.message}</p>}
        <button
          type="submit"
          disabled={busy}
          className="sm:col-span-3 rounded-md border border-[color:var(--color-gold-500)]/40 bg-[color:var(--color-gold-500)]/10 px-4 py-2.5 text-sm font-medium text-[color:var(--color-gold-100)] hover:bg-[color:var(--color-gold-500)]/20 disabled:opacity-60"
        >
          {busy ? "Adding…" : "+ Add document"}
        </button>
      </form>

      <ul className="mt-5 space-y-2">
        {uploads.map((u, i) => (
          <li key={i} className="flex items-center justify-between rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 px-3 py-2 text-sm">
            <span className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[color:var(--color-gold-300)]" aria-hidden />
              <span className="uppercase tracking-wider text-[color:var(--color-text-muted)]">{u.doc_type}</span>
              <span className="text-[color:var(--color-text)]">{u.doc_number || "—"}</span>
            </span>
            <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-200">uploaded</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={uploads.length === 0}
          onClick={onDone}
          className="rounded-md bg-[color:var(--color-gold-500)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-40"
        >
          Continue → Bank account
        </button>
      </div>

      <style>{`
        .input { width:100%; background:rgba(11,10,20,.6); border:1px solid var(--color-border); color:var(--color-text); border-radius:.5rem; padding:.55rem .85rem; font-size:.9rem; outline:none; }
        .input:focus { border-color:var(--color-gold-500); box-shadow:0 0 0 3px rgba(212,160,23,.15); }
      `}</style>
    </div>
  );
}

function StepBank({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BankValues>({
    resolver: zodResolver(bankSchema),
  });

  async function submit(_v: BankValues) {
    setBusy(true);
    // TODO: apiUser('guide').post('/guide/onboarding/bank-account', v)
    await new Promise((r) => setTimeout(r, 500));
    setBusy(false);
    setSaved(true);
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Bank account</h2>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
        Weekly payouts go to this account. Mileora fee is 15% — payouts are net of fee + applicable taxes.
      </p>

      <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Account holder name</span>
          <input {...register("account_name")} placeholder="As per bank records" className="input mt-1.5" />
          {errors.account_name && <p className="mt-1 text-xs text-rose-300">{errors.account_name.message}</p>}
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Account number</span>
          <input {...register("account_number")} inputMode="numeric" className="input mt-1.5" />
          {errors.account_number && <p className="mt-1 text-xs text-rose-300">{errors.account_number.message}</p>}
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">IFSC</span>
          <input {...register("ifsc")} className="input mt-1.5 uppercase" />
          {errors.ifsc && <p className="mt-1 text-xs text-rose-300">{errors.ifsc.message}</p>}
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Bank name (optional — auto-filled from IFSC)</span>
          <input {...register("bank_name")} className="input mt-1.5" />
        </label>

        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          {saved
            ? <span className="text-sm text-emerald-300">Bank account saved ✓</span>
            : <span />}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md border border-[color:var(--color-gold-500)]/40 bg-[color:var(--color-gold-500)]/10 px-4 py-2.5 text-sm font-medium text-[color:var(--color-gold-100)] hover:bg-[color:var(--color-gold-500)]/20 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save bank details"}
            </button>
            <button
              type="button"
              disabled={!saved}
              onClick={onDone}
              className="rounded-md bg-[color:var(--color-gold-500)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-40"
            >
              Continue → Availability
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .input { width:100%; background:rgba(11,10,20,.6); border:1px solid var(--color-border); color:var(--color-text); border-radius:.5rem; padding:.55rem .85rem; font-size:.9rem; outline:none; }
        .input:focus { border-color:var(--color-gold-500); box-shadow:0 0 0 3px rgba(212,160,23,.15); }
      `}</style>
    </div>
  );
}

function StepAvailability({ onDone }: { onDone: () => void }) {
  const [windows, setWindows] = useState<Record<number, { start: string; end: string } | null>>(() => {
    const o: Record<number, { start: string; end: string } | null> = {};
    for (let i = 0; i < 7; i++) o[i] = i === 0 || i === 6 ? null : { start: "10:00", end: "20:00" };
    return o;
  });
  const [busy, setBusy] = useState(false);

  function toggle(day: number) {
    setWindows((w) => ({ ...w, [day]: w[day] ? null : { start: "10:00", end: "18:00" } }));
  }

  async function submit() {
    setBusy(true);
    const arr = Object.entries(windows)
      .filter(([, v]) => v)
      .map(([d, v]) => ({ day_of_week: Number(d), start_time: v!.start + ":00", end_time: v!.end + ":00" }));
    // TODO: apiUser('guide').post('/guide/onboarding/availability', { windows: arr })
    await new Promise((r) => setTimeout(r, 500));
    setBusy(false);
    onDone();
  }

  const anyActive = Object.values(windows).some(Boolean);

  return (
    <div>
      <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Weekly availability</h2>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
        When can seekers book a consultation with you? You can adjust this anytime from your profile.
      </p>

      <ul className="mt-5 space-y-2">
        {DAYS.map((day, i) => {
          const w = windows[i];
          return (
            <li key={day} className={`flex items-center gap-4 rounded-lg border px-4 py-3 ${
              w ? "border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-gold-500)]/5" : "border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40"
            }`}>
              <label className="flex w-28 items-center gap-2 text-sm font-medium text-[color:var(--color-text)]">
                <input
                  type="checkbox"
                  checked={!!w}
                  onChange={() => toggle(i)}
                />
                {day}
              </label>
              {w ? (
                <div className="flex flex-1 items-center gap-2 text-sm">
                  <input
                    type="time"
                    value={w.start}
                    onChange={(e) => setWindows((all) => ({ ...all, [i]: { ...all[i]!, start: e.target.value } }))}
                    className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-2 py-1 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
                  />
                  <span className="text-[color:var(--color-text-muted)]">to</span>
                  <input
                    type="time"
                    value={w.end}
                    onChange={(e) => setWindows((all) => ({ ...all, [i]: { ...all[i]!, end: e.target.value } }))}
                    className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-2 py-1 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
                  />
                </div>
              ) : (
                <span className="flex-1 text-sm text-[color:var(--color-text-muted)]">Off</span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!anyActive || busy}
          onClick={submit}
          className="rounded-md bg-[color:var(--color-gold-500)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-40"
        >
          {busy ? "Saving…" : "Finish onboarding"}
        </button>
      </div>
    </div>
  );
}
