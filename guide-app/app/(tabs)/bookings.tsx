import { FlatList, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { formatINR } from "@/lib/format";

type Status = "upcoming" | "completed" | "cancelled";
type Booking = {
  id: string; customer: string; service: string; at: string; amount: number; status: Status;
};

// TODO: api.get<Envelope<Booking[]>>('/guide/dashboard') and extract bookings
const BOOKINGS: Booking[] = [
  { id: "MIL-1042", customer: "Anitha R.",  service: "Vedic consultation",    at: "Today, 4:30 PM",     amount: 99900,  status: "upcoming" },
  { id: "MIL-1041", customer: "Ravi K.",    service: "Tamil jothisyam",       at: "Today, 6:00 PM",     amount: 99900,  status: "upcoming" },
  { id: "MIL-1040", customer: "Meera S.",   service: "Marriage porutham",     at: "Tomorrow, 10:30 AM", amount: 149900, status: "upcoming" },
  { id: "MIL-1039", customer: "Vikram T.",  service: "Annual forecast",       at: "Tomorrow, 2:00 PM",  amount: 249900, status: "upcoming" },
  { id: "MIL-1038", customer: "Sandhya R.", service: "Vedic consultation",    at: "12 May, 11:00 AM",   amount: 99900,  status: "completed" },
  { id: "MIL-1037", customer: "Naveen P.",  service: "Vedic consultation",    at: "10 May, 7:00 PM",    amount: 99900,  status: "completed" },
  { id: "MIL-1034", customer: "Kishore S.", service: "Vedic consultation",    at: "5 May, 8:00 PM",     amount: 99900,  status: "cancelled" },
];

const FILTERS: { key: Status | "all"; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "upcoming",  label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function GuideBookings() {
  const [filter, setFilter] = useState<Status | "all">("upcoming");
  const items = filter === "all" ? BOOKINGS : BOOKINGS.filter((b) => b.status === filter);

  return (
    <View className="flex-1 bg-bg">
      {/* Filter chips */}
      <View className="px-4 pt-3 pb-2 flex-row gap-2">
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full border ${
              filter === f.key
                ? "border-gold-500 bg-gold-500/10"
                : "border-border bg-surface/60"
            }`}
          >
            <Text className={`text-xs ${filter === f.key ? "text-gold-100" : "text-muted"}`}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, gap: 10 }}
        data={items}
        keyExtractor={(b) => b.id}
        renderItem={({ item: b }) => (
          <Link href={`/booking/${b.id}` as any} asChild>
            <Pressable className="rounded-2xl bg-surface border border-border p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 min-w-0">
                  <Text className="text-text font-medium">{b.customer}</Text>
                  <Text className="text-muted text-xs mt-0.5">{b.service}</Text>
                </View>
                <Text className="text-gold-100 text-xs font-mono">{b.id}</Text>
              </View>
              <View className="flex-row items-end justify-between mt-3">
                <Text className="text-muted text-xs">{b.at}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-text">{formatINR(b.amount)}</Text>
                  <View className={`rounded-full px-2 py-0.5 ${
                    b.status === "upcoming" ? "bg-gold-500/10" :
                    b.status === "completed" ? "bg-emerald-400/10" :
                    "bg-rose-400/10"
                  }`}>
                    <Text className={`text-[10px] uppercase tracking-wider ${
                      b.status === "upcoming" ? "text-gold-100" :
                      b.status === "completed" ? "text-emerald-200" :
                      "text-rose-200"
                    }`}>{b.status}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <Text className="text-muted text-center mt-10">No bookings in this view.</Text>
        }
      />
    </View>
  );
}
