import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Astrologer } from "@shared/types";

export default function AstrologerDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const q = useQuery({
    queryKey: ["astrologer", slug],
    queryFn: () => api.get<{ data: Astrologer }>(`/astrologers/${slug}`),
    enabled: !!slug,
  });

  if (q.isLoading) return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator color="#f1cb5b" /></View>;
  if (q.isError || !q.data) return <View className="flex-1 bg-bg p-6"><Text className="text-text">Could not load.</Text></View>;

  const a = q.data.data;
  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-text text-3xl">{a.name}</Text>
      <View className="flex-row gap-4 mt-2">
        <Text className="text-gold-300">★ {a.rating} ({a.reviews_count})</Text>
        <Text className="text-muted">{a.experience_years} yrs experience</Text>
      </View>
      <Text className="text-text mt-4 leading-relaxed">{a.bio}</Text>
      <View className="mt-8 rounded-2xl bg-surface border border-border p-5">
        <Text className="text-muted text-xs uppercase tracking-widest">Session</Text>
        <Text className="text-text text-2xl mt-1">₹{Math.round(a.price_per_session_paise / 100)}</Text>
        <Text className="text-muted">{a.session_minutes} minutes · video / phone</Text>
        <Pressable className="mt-4 rounded-lg bg-gold-500 px-5 py-3">
          <Text className="text-bg font-semibold text-center">Book a session</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
