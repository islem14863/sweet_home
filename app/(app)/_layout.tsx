import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { useSession } from "../ctx";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    console.log("session frpm AppLayout", session);
  }, [session]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
        <Stack.Screen name="about" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
