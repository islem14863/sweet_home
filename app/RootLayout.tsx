import { Stack } from "expo-router";
import { SessionProvider, useSession } from "./ctx";
import { useEffect } from "react";
import AppLayout from "./(app)/_layout";
import AuthLayout from "./(auth)/_layout";

export default function RootLayout() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    console.log("session", session);
  }, [session]);

  if (session) {
    return <AppLayout />;
  } else {
    return <AuthLayout />;
  }
}
