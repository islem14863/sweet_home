import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { useSession } from "./ctx";

SplashScreen.preventAutoHideAsync().catch((e) =>
  console.warn("Failed to prevent auto hide:", e)
);

export default function SplashScreenController() {
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch((e) =>
        console.warn("Failed to hide splash screen:", e)
      );
    }
  }, [isLoading]);

  return null;
}
