import { ScrollView, Text, View } from "react-native";
import { Wallet, TrendingUp, Download } from "lucide-react-native";
import { formatINR } from "@/lib/format";

// TODO: api.get<Envelope<EarningsDto>>('/guide/earnings')
const PAYOUTS = [
  { id: "PO-2026-15", period: "5–11 Mar",   amount: 1840000, status: "scheduled", date: "12 Mar" },
  { id: "PO-2026-14", period: "26 Feb–4 Mar", amount: 2115000, status: "paid",      date: "5 Mar" },
  { id: "PO-2026-13", period: "19–25 Feb",  amount: 1780000, status: "paid",      date: "26 Feb" },
  { id: "PO-2026-12", period: "12–18 Feb",  amount: 1960000, status: "paid",      date: "19 Feb" },
  { id: "PO-2026-11", period: "5–11 Feb",   amount: 1640000, status: "paid",      date: "12 Feb" },
];

export default function GuideEarnings() {
  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View className="rounded-2xl bg-surface border border-gold-500/30 p-5">
        <View className="flex-row items-center gap-2">
          <Wallet color="#f1cb5b" size={14} />
          <Text className="text-gold-300 text-[10px] uppercase tracking-widest">Next payout</Text>
        </View>
        <Text className="text-text text-4xl mt-2 font-serif">{formatINR(1840000)}</Text>
        <Text className="text-muted text-xs mt-1">scheduled 12 Mar 2026 · UPI</Text>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-surface border border-border p-4">
          <View className="flex-row items-center gap-1.5">
            <TrendingUp color="#a9a3b8" size={13} />
            <Text className="text-muted text-[11px] uppercase tracking-widest">This month</Text>
          </View>
          <Text className="text-text text-2xl mt-2 font-serif">{formatINR(4695000)}</Text>
        </View>
        <View className="flex-1 rounded-2xl bg-surface border border-border p-4">
          <View className="flex-row items-center gap-1.5">
            <Wallet color="#a9a3b8" size={13} />
            <Text className="text-muted text-[11px] uppercase tracking-widest">Lifetime</Text>
          </View>
          <Text className="text-text text-2xl mt-2 font-serif">{formatINR(48230000)}</Text>
        </View>
      </View>

      <Text className="text-text text-lg mt-2 font-serif px-1">Payout history</Text>

      <View className="rounded-2xl bg-surface border border-border overflow-hidden">
        {PAYOUTS.map((p, i) => (
          <View key={p.id} className={`px-4 py-3 flex-row items-center justify-between ${i > 0 ? "border-t border-border/60" : ""}`}>
            <View>
              <Text className="text-text font-mono text-xs">{p.id}</Text>
              <Text className="text-muted text-[11px] mt-0.5">{p.period}</Text>
            </View>
            <View className="items-end">
              <Text className="text-text">{formatINR(p.amount)}</Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <Text className="text-muted text-[11px]">{p.date}</Text>
                <View className={`rounded-full px-2 py-0.5 ${
                  p.status === "paid" ? "bg-emerald-400/10" : "bg-gold-500/10"
                }`}>
                  <Text className={`text-[10px] uppercase ${
                    p.status === "paid" ? "text-emerald-200" : "text-gold-100"
                  }`}>{p.status}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="rounded-2xl bg-surface border border-border p-5 mt-2">
        <View className="flex-row items-center gap-2">
          <Download color="#f1cb5b" size={14} />
          <Text className="text-text font-medium">Tax-ready invoices</Text>
        </View>
        <Text className="text-muted text-xs mt-1">
          Download CSV of all payouts for FY 2025-26. Includes Mileora fees + applicable TDS.
        </Text>
        <Text className="text-gold-100 text-xs mt-3">Download CSV →</Text>
      </View>

      <Text className="text-muted text-[10px] text-center mt-4">
        Mileora fee: 15% · TDS applicable per IT Act, Section 194-O
      </Text>
    </ScrollView>
  );
}
