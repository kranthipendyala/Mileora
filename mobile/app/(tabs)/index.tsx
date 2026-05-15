import { ScrollView, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { Sparkles, Calculator, Home, Sun, Flame, Heart } from "lucide-react-native";

const SERVICES = [
  { href: "/astrologers?category=astrology", title: "Vedic Astrology",  icon: Sparkles },
  { href: "/astrologers?category=numerology", title: "Numerology",      icon: Calculator },
  { href: "/astrologers?category=vasthu",     title: "Vasthu",          icon: Home },
  { href: "/astrologers?category=jothisyam",  title: "Jothisyam",       icon: Sun },
  { href: "/puja",                            title: "Puja Booking",    icon: Flame },
  { href: "/free/compatibility",              title: "Compatibility",   icon: Heart },
] as const;

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-bg">
      {/* Hero */}
      <View className="px-6 pt-12 pb-10">
        <Text className="text-gold-300 uppercase tracking-widest text-xs">Trusted by 1,00,000+ seekers</Text>
        <Text className="text-text mt-3 text-4xl leading-tight">
          The cosmos has answers.{"\n"}
          <Text className="text-gold-300">Mileora connects you to them.</Text>
        </Text>
        <Text className="text-muted mt-4 leading-relaxed">
          Vedic astrology, numerology, vasthu, jothisyam and online puja — guided by handpicked experts.
        </Text>
        <View className="mt-6 flex-row gap-3">
          <Link href="/free/kundli" asChild>
            <Pressable className="rounded-lg bg-gold-500 px-5 py-3">
              <Text className="text-bg font-semibold">Free Kundli</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/astrologers" asChild>
            <Pressable className="rounded-lg border border-border px-5 py-3">
              <Text className="text-text font-semibold">Talk to expert</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Services grid */}
      <View className="px-6">
        <Text className="text-muted text-xs uppercase tracking-widest">What we offer</Text>
        <Text className="text-text text-2xl mt-2 mb-5">Six paths to clarity</Text>
        <View className="flex-row flex-wrap -mx-2">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <View key={s.title} className="w-1/2 px-2 mb-4">
                <Link href={s.href as any} asChild>
                  <Pressable className="rounded-2xl bg-surface border border-border p-5">
                    <View className="h-10 w-10 rounded-xl bg-bg items-center justify-center mb-3">
                      <Icon color="#f1cb5b" size={20} />
                    </View>
                    <Text className="text-text font-semibold">{s.title}</Text>
                  </Pressable>
                </Link>
              </View>
            );
          })}
        </View>
      </View>

      <View className="h-16" />
    </ScrollView>
  );
}
