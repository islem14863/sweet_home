import { useEffect } from "react";
import { SessionProvider } from "./ctx";
import RootLayout from "./RootLayout";
import SplashScreenController from "./splash";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./store";

export default function Layout() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(console.warn);
  }, []);

  return (
    <>
      <Provider store={store}>
        <SessionProvider>
          <SplashScreenController />
          <RootLayout />
        </SessionProvider>
        <StatusBar style="light" />
      </Provider>
    </>
  );
}