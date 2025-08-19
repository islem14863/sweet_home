import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type LoadingState<T> = [isLoading: boolean, value: T | null];
type UseStateHook<T> = [LoadingState<T>, (value: T | null) => void];

function useAsyncState<T>(
  initialValue: LoadingState<T> = [true, null]
): UseStateHook<T> {
  return useReducer(
    (_: LoadingState<T>, action: T | null = null) => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(
  key: string,
  value: string | null
): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) {
      console.error("Web: LocalStorage error:", e);
    }
  } else {
    try {
      if (value === null) await SecureStore.deleteItemAsync(key);
      else await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.error("Mobile: SecureStore error:", e);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();
  const [, value] = state;

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const stored =
          Platform.OS === "web"
            ? localStorage.getItem(key)
            : await SecureStore.getItemAsync(key);
        if (mounted) setState(stored);
      } catch (e) {
        console.error("Storage read error:", e);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [key]);

  const setValue = useCallback(
    async (newValue: string | null) => {
      // 1) update state immediately
      setState(newValue);
      // 2) wait for storage write to finish (so you can catch errors)
      await setStorageItemAsync(key, newValue);
    },
    [key]
  );

  return [state, setValue];
}