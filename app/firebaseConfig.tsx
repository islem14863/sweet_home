import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { isSupported, getAnalytics } from "firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUrWE6hItn14M8q8kBXgTRPsdIeJ7-QvE",
  authDomain: "sweet-home-37de9.firebaseapp.com",
  projectId: "sweet-home-37de9",
  storageBucket: "sweet-home-37de9.appspot.com",
  messagingSenderId: "609285148726",
  appId: "1:609285148726:web:227a6b17b96f772230c897",
  measurementId: "G-2X0ZK5MGZ8",
};

const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  isSupported().then((ok) => {
    if (ok) getAnalytics(app);
  });
}

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export default auth;