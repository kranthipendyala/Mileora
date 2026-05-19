"use client";

import { useState } from "react";
import { Save, Lock, Globe } from "lucide-react";

type Setting = { key: string; value: string; is_public: boolean; description: string };

const INITIAL: Setting[] = [
  { key: "geo_scope",              value: "india",                      is_public: true,  description: "Geographic scope of the platform (india, telangana, etc.)" },
  { key: "support_email",          value: "info@magnusconference.com",  is_public: true,  description: "Public support email" },
  { key: "support_phone",          value: "+91 98XXX XXXXX",            is_public: true,  description: "Public support phone" },
  { key: "support_whatsapp",       value: "+91 98XXX XXXXX",            is_public: true,  description: "WhatsApp number for chat support" },
  { key: "platform_fee_percent",   value: "15",                         is_public: false, description: "Mileora's cut of each booking (%)" },
  { key: "payout_min_paise",       value: "100000",                     is_public: false, description: "Minimum payout amount in paise (₹1000 default)" },
  { key: "payout_day",             value: "friday",                     is_public: false, description: "Day of week for weekly guide payouts" },
  { key: "razorpay_mode",          value: "test",                       is_public: false, description: "test or live" },
  { key: "free_kundli_enabled",    value: "1",                          is_public: true,  description: "Show /free/kundli on home" },
  { key: "show_horoscope_widget",  value: "1",                          is_public: true,  description: "Daily horoscope strip on home" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>(INITIAL);
  const [saved, setSaved] = useState(false);

  function setValue(key: string, value: string) {
    setSettings((all) => all.map((s) => (s.key === key ? { ...s, value } : s)));
    setSaved(false);
  }

  function save() {
    // TODO: apiUser('admin').put('/admin/platform/config', Object.fromEntries(settings.map(s => [s.key, { value: s.value, is_public: s.is_public }])))
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Platform-wide configuration. Public values are exposed to the web client.</p>
        </div>
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-1.5 rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400"
        >
          <Save className="h-3.5 w-3.5" aria-hidden /> Save all
        </button>
      </div>

      {saved && <p className="mt-4 text-sm text-emerald-300">Settings saved ✓</p>}

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {settings.map((s) => (
              <tr key={s.key}>
                <td className="px-4 py-3 align-top">
                  <p className="font-mono text-xs text-[color:var(--color-gold-100)]">{s.key}</p>
                  <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{s.description}</p>
                </td>
                <td className="px-4 py-3 align-top">
                  <input
                    value={s.value}
                    onChange={(e) => setValue(s.key, e.target.value)}
                    className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2 text-sm text-[color:var(--color-text)] outline-none focus:border-rose-400/60"
                  />
                </td>
                <td className="px-4 py-3 align-top text-xs">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
                    s.is_public ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"
                  }`}>
                    {s.is_public
                      ? <><Globe className="h-3 w-3" aria-hidden /> public</>
                      : <><Lock className="h-3 w-3" aria-hidden /> private</>
                    }
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
