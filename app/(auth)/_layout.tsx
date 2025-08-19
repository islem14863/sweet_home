import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout (){
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcomeScreen" />
        <Stack.Screen name="sign-up" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
};