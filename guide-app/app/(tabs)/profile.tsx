import { ScrollView, Text, View, Pressable, Switch, Alert } from "react-native";
import { useState } from "react";
import { Star, Check, Shield, LogOut, ChevronRight } from "lucide-react-native";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function GuideProfile() {
  // TODO: api.get<Envelope<GuideProfile>>('/guide/me')
  const [availability, setAvailability] = useState<Record<number, boolean>>({
    0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false,
  });
  const [pauseBookings, setPauseBookings] = useState(false);

  function logout() {
    Alert.alert("Sign out?", "You'll need your phone to sign back in.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive" },
    ]);
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* Identity */}
      <View className="rounded-2xl bg-surface border border-gold-500/30 p-5">
        <Text className="text-gold-300 text-[10px] uppercase tracking-widest">Profile</Text>
        <Text className="text-text text-2xl mt-2 font-serif">Pandit Suresh Iyer</Text>
        <Text className="text-muted text-sm">Vedic + Tamil Jothisyam · 25 years</Text>
        <View className="flex-row items-center gap-3 mt-3">
          <View className="flex-row items-center gap-1">
            <Star color="#f1cb5b" fill="#f1cb5b" size={12} />
            <Text className="text-gold-100 text-xs">4.92 (1,248 reviews)</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Shield color="#86efac" size={12} />
            <Text className="text-emerald-300 text-xs">KYC verified</Text>
          </View>
        </View>
      </View>

      {/* Quick toggles */}
      <View className="rounded-2xl bg-surface border border-border p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-text">Pause new bookings</Text>
            <Text className="text-muted text-xs mt-1">
              Existing bookings stay — only new ones are blocked.
            </Text>
          </View>
          <Switch
            value={pauseBookings}
            onValueChange={setPauseBookings}
            trackColor={{ false: "#2a2745", true: "#9b7000" }}
            thumbColor={pauseBookings ? "#f1cb5b" : "#a9a3b8"}
          />
        </View>
      </View>

      {/* Availability */}
      <View className="rounded-2xl bg-surface border border-border p-5">
        <Text className="text-text font-medium">Weekly availability</Text>
        <Text className="text-muted text-xs mt-1">Tap a day to toggle. Bookings only land in your open windows.</Text>
        <View className="mt-4 gap-2">
          {DAYS.map((d, i) => (
            <Pressable
              key={d}
              onPress={() => setAvailability((a) => ({ ...a, [i]: !a[i] }))}
              className={`flex-row items-center justify-between rounded-lg px-3 py-2.5 ${
                availability[i] ? "bg-gold-500/10 border border-gold-500/30" : "bg-bg/40 border border-border"
              }`}
            >
              <View className="flex-row items-center gap-3">
                {availability[i] ? <Check color="#f1cb5b" size={14} /> : <View className="w-3.5 h-3.5" />}
                <Text className={availability[i] ? "text-gold-100" : "text-muted"}>{d}</Text>
              </View>
              <Text className={`text-xs ${availability[i] ? "text-text" : "text-muted"}`}>
                {availability[i] ? "10:00 – 18:00" : "Off"}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable className="mt-4 rounded-md bg-gold-500 py-2.5">
          <Text className="text-bg text-center font-semibold text-sm">Save availability</Text>
        </Pressable>
      </View>

      {/* Menu rows */}
      <View className="rounded-2xl bg-surface border border-border overflow-hidden">
        <MenuRow label="Edit public profile" />
        <Divider />
        <MenuRow label="Bank account" sub="HDFC ••••4521" />
        <Divider />
        <MenuRow label="KYC documents" sub="3 verified" />
        <Divider />
        <MenuRow label="Notification settings" />
        <Divider />
        <MenuRow label="Support" sub="info@magnusconference.com" />
      </View>

      <Pressable onPress={logout} className="flex-row items-center justify-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-400/5 py-3 mt-2">
        <LogOut color="#fda4af" size={16} />
        <Text className="text-rose-200 font-medium">Sign out</Text>
      </Pressable>

      <Text className="text-muted text-[10px] text-center mt-2">
        Mileora Guide v0.1.0
      </Text>
    </ScrollView>
  );
}

function MenuRow({ label, sub }: { label: string; sub?: string }) {
  return (
    <Pressable className="px-4 py-3 flex-row items-center justify-between">
      <View>
        <Text className="text-text">{label}</Text>
        {sub && <Text className="text-muted text-xs mt-0.5">{sub}</Text>}
      </View>
      <ChevronRight color="#a9a3b8" size={16} />
    </Pressable>
  );
}
function Divider() {
  return <View className="h-px bg-border/60 mx-4" />;
}
