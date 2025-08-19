import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSession } from "./ctx";
import SplashScreenController from "./splash";
import AppLayout from "./(app)/_layout";
import AuthLayout from "./(auth)/_layout";
export default function RootLayout() {
  const { session, isLoading } = useSession();


  useEffect(() => {
    console.log("session from RootLayout", session);
  }, [session]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session == null) {
    return (
      <>
        <SplashScreenController />
        <AuthLayout />
        <StatusBar style="light" />
      </>
    );
  } else {
    return (
      <>
        <SplashScreenController />
        <AppLayout />
        <StatusBar style="light" />
      </>
    );
  }
}
