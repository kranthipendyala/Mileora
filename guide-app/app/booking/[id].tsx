import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, Clock, User, Phone, MessageCircle, Video, XCircle } from "lucide-react-native";
import { formatINR } from "@/lib/format";

// TODO: api.get<Envelope<BookingDetail>>(`/guide/bookings/${id}`)
const MOCK_BOOKING = {
  id: "MIL-1042",
  customer: { id: 4821, name: "Anitha Ramaswamy", phone: "+91 98XXX 12340" },
  service: "Vedic consultation",
  type: "consultation" as const,
  at: "Today, 4:30 PM (IST)",
  duration_minutes: 30,
  amount_paise: 99900,
  status: "confirmed" as const,
  thread_id: 101,
  birth_details: {
    dob: "12 Apr 1992",
    tob: "14:35",
    pob: "Chennai, Tamil Nadu",
  },
  question: "I've been considering a job change to Bengaluru — what does my chart say?",
};

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const b = { ...MOCK_BOOKING, id: id ?? MOCK_BOOKING.id };

  function startCall() {
    Alert.alert("Open call", "Would launch the Zoom / Daily / Twilio video call. Wire to deep link or in-app video SDK.");
  }
  function cancel() {
    Alert.alert("Cancel booking?", "The customer will be notified and refunded.", [
      { text: "Keep", style: "cancel" },
      { text: "Cancel booking", style: "destructive", onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* Header card */}
      <View className="rounded-2xl bg-surface border border-gold-500/30 p-5">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-gold-300 text-[10px] uppercase tracking-widest">{b.type}</Text>
            <Text className="text-text text-xl mt-1 font-serif">{b.service}</Text>
          </View>
          <Text className="text-gold-100 font-mono text-xs">{b.id}</Text>
        </View>
        <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-1">
          <View className="flex-row items-center gap-1.5">
            <Calendar color="#a9a3b8" size={13} />
            <Text className="text-muted text-xs">{b.at}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Clock color="#a9a3b8" size={13} />
            <Text className="text-muted text-xs">{b.duration_minutes} min</Text>
          </View>
        </View>
        <Text className="mt-3 text-text font-serif text-2xl">{formatINR(b.amount_paise)}</Text>
      </View>

      {/* Customer */}
      <View className="rounded-2xl bg-surface border border-border p-5">
        <View className="flex-row items-center gap-2 mb-3">
          <User color="#f1cb5b" size={14} />
          <Text className="text-text font-medium">Customer</Text>
        </View>
        <Text className="text-text text-lg">{b.customer.name}</Text>
        <Text className="text-muted text-sm mt-0.5">{b.customer.phone}</Text>
      </View>

      {/* Birth details */}
      <View className="rounded-2xl bg-surface border border-border p-5">
        <Text className="text-gold-300 text-[10px] uppercase tracking-widest">Birth details (sankalpam)</Text>
        <View className="mt-3 gap-1">
          <Row label="Date" value={b.birth_details.dob} />
          <Row label="Time" value={b.birth_details.tob + " IST"} />
          <Row label="Place" value={b.birth_details.pob} />
        </View>
      </View>

      {/* Question */}
      {b.question && (
        <View className="rounded-2xl bg-surface border border-border p-5">
          <Text className="text-gold-300 text-[10px] uppercase tracking-widest">Question</Text>
          <Text className="text-text mt-2 leading-relaxed">"{b.question}"</Text>
        </View>
      )}

      {/* Action stack */}
      <View className="gap-2 mt-2">
        <Pressable onPress={startCall} className="flex-row items-center justify-center gap-2 rounded-md bg-gold-500 py-3">
          <Video color="#0b0a14" size={16} />
          <Text className="text-bg font-semibold">Start video call</Text>
        </Pressable>
        <Link href={`/chat/${b.thread_id}` as any} asChild>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-md border border-border bg-surface/60 py-3">
            <MessageCircle color="#f1cb5b" size={16} />
            <Text className="text-text font-medium">Open chat</Text>
          </Pressable>
        </Link>
        <Pressable className="flex-row items-center justify-center gap-2 rounded-md border border-border bg-surface/60 py-3">
          <Phone color="#f1cb5b" size={16} />
          <Text className="text-text font-medium">Call customer</Text>
        </Pressable>
        <Pressable onPress={cancel} className="flex-row items-center justify-center gap-2 rounded-md border border-rose-400/30 bg-rose-400/5 py-3">
          <XCircle color="#fda4af" size={16} />
          <Text className="text-rose-200 font-medium">Cancel booking</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-muted text-sm">{label}</Text>
      <Text className="text-text text-sm">{value}</Text>
    </View>
  );
}
