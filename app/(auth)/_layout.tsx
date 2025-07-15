import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="welcomeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <StatusBar style="light" />
    </Stack>
  );
};

export default AuthLayout;
