import { FlatList, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { api } from "@/lib/api";
import type { Astrologer } from "@shared/types";

export default function AstrologersScreen() {
  const q = useQuery({
    queryKey: ["astrologers"],
    queryFn: () => api.get<{ data: Astrologer[] }>("/astrologers?perPage=20"),
  });

  if (q.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color="#f1cb5b" />
      </View>
    );
  }
  if (q.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-bg p-6">
        <Text className="text-text text-center">Could not load astrologers.{"\n"}Check your API URL in .env.</Text>
      </View>
    );
  }

  return (
    <FlatList
      className="bg-bg"
      contentContainerStyle={{ padding: 16, gap: 12 }}
      data={q.data?.data ?? []}
      keyExtractor={(it) => String(it.id)}
      renderItem={({ item }) => (
        <Link href={`/astrologer/${item.slug}` as any} asChild>
          <Pressable className="rounded-2xl bg-surface border border-border p-4 flex-row gap-4">
            <View className="h-16 w-16 rounded-full bg-bg" />
            <View className="flex-1">
              <Text className="text-text text-lg font-semibold">{item.name}</Text>
              <Text className="text-muted text-sm mt-1" numberOfLines={2}>{item.bio}</Text>
              <View className="flex-row gap-3 mt-2">
                <Text className="text-gold-300 text-sm">★ {item.rating}</Text>
                <Text className="text-muted text-sm">{item.experience_years} yrs</Text>
                <Text className="text-text text-sm">₹{Math.round(item.price_per_session_paise / 100)}/session</Text>
              </View>
            </View>
          </Pressable>
        </Link>
      )}
      ListEmptyComponent={<Text className="text-muted text-center mt-10">No astrologers found.</Text>}
    />
  );
}
