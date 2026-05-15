import { Tabs } from "expo-router";
import { Sparkles, Home, Calendar, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0b0a14" },
        headerTitleStyle: { color: "#f5f1e8" },
        headerTintColor: "#f1cb5b",
        tabBarStyle: { backgroundColor: "#14132a", borderTopColor: "#2a2745" },
        tabBarActiveTintColor: "#f1cb5b",
        tabBarInactiveTintColor: "#a9a3b8",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tabs.Screen name="astrologers" options={{ title: "Astrologers", tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} /> }} />
      <Tabs.Screen name="bookings" options={{ title: "My Bookings", tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tabs>
  );
}
