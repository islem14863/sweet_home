import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
