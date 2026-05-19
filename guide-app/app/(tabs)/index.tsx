import { ScrollView, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { Calendar, TrendingUp, Star, Wallet, MessageCircle, Sparkles } from "lucide-react-native";
import { formatINR } from "@/lib/format";

// TODO: api.get<Envelope<DashboardDto>>('/guide/dashboard')
const KPIS = [
  { Icon: Calendar,    label: "Bookings this month", value: "47",        trend: "+12%" },
  { Icon: TrendingUp,  label: "Revenue",             value: formatINR(4695000), trend: "+8%" },
  { Icon: Star,        label: "Avg rating",          value: "4.92",      trend: "+0.04" },
  { Icon: Wallet,      label: "Pending payout",      value: formatINR(1840000), trend: "5 Mar" },
] as const;

const UPCOMING = [
  { id: "MIL-1042", customer: "Anitha R.", service: "Vedic consultation",  at: "Today, 4:30 PM",     mins: 30 },
  { id: "MIL-1041", customer: "Ravi K.",   service: "Tamil jothisyam",     at: "Today, 6:00 PM",     mins: 30 },
  { id: "MIL-1040", customer: "Meera S.",  service: "Marriage porutham",   at: "Tomorrow, 10:30 AM", mins: 45 },
];

export default function GuideDashboard() {
  return (
    <ScrollView className="flex-1 bg-bg">
      <View className="px-5 pt-6 pb-3">
        <View className="flex-row items-center gap-2">
          <Sparkles color="#f1cb5b" size={16} />
          <Text className="text-gold-300 uppercase tracking-widest text-[10px]">Mileora Guide</Text>
        </View>
        <Text className="text-text text-3xl mt-2 font-serif">Namaste, <Text className="text-gold-300">Suresh</Text></Text>
        <Text className="text-muted text-sm mt-1">Here's your day at a glance.</Text>
      </View>

      {/* KPI grid */}
      <View className="px-5 mt-3">
        <View className="flex-row flex-wrap -mx-2">
          {KPIS.map(({ Icon, label, value, trend }) => (
            <View key={label} className="w-1/2 px-2 mb-3">
              <View className="rounded-2xl bg-surface border border-border p-4">
                <View className="flex-row items-center justify-between">
                  <Icon color="#f1cb5b" size={18} />
                  <Text className="text-muted text-[11px]">{trend}</Text>
                </View>
                <Text className="text-text text-2xl mt-3 font-serif">{value}</Text>
                <Text className="text-muted text-[11px] mt-1">{label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming */}
      <View className="px-5 mt-3">
        <View className="flex-row items-end justify-between mb-3">
          <Text className="text-text text-xl font-serif">Upcoming consultations</Text>
          <Link href="/(tabs)/bookings" className="text-gold-100 text-xs">All →</Link>
        </View>
        <View className="rounded-2xl bg-surface border border-border overflow-hidden">
          {UPCOMING.map((b, i) => (
            <Link key={b.id} href={`/booking/${b.id}` as any} asChild>
              <Pressable className={`px-4 py-4 flex-row items-center justify-between ${i > 0 ? "border-t border-border/60" : ""}`}>
                <View className="flex-1 min-w-0">
                  <Text className="text-text" numberOfLines={1}>{b.customer} · {b.service}</Text>
                  <Text className="text-muted text-xs mt-0.5">{b.mins} min</Text>
                </View>
                <View className="items-end">
                  <Text className="text-gold-100 text-sm">{b.at}</Text>
                  <Text className="text-muted text-[11px] mt-0.5">{b.id}</Text>
                </View>
              </Pressable>
            </Link>
          ))}
          {UPCOMING.length === 0 && (
            <Text className="text-muted text-center py-10 px-4">No upcoming consultations.</Text>
          )}
        </View>
      </View>

      {/* Quick actions */}
      <View className="px-5 mt-6 flex-row gap-3">
        <Link href="/(tabs)/earnings" asChild>
          <Pressable className="flex-1 rounded-2xl bg-surface border border-border p-4">
            <Wallet color="#f1cb5b" size={16} />
            <Text className="text-text mt-3 font-serif text-lg">Next payout</Text>
            <Text className="text-muted text-xs">12 Mar — {formatINR(1840000)}</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/profile" asChild>
          <Pressable className="flex-1 rounded-2xl bg-surface border border-border p-4">
            <MessageCircle color="#f1cb5b" size={16} />
            <Text className="text-text mt-3 font-serif text-lg">Edit availability</Text>
            <Text className="text-muted text-xs">Update weekly hours</Text>
          </Pressable>
        </Link>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
