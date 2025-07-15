import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

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
const analytics = getAnalytics(app);
 export const auth = getAuth(app);
if (typeof window !== "undefined") {
  isSupported().then((ok) => {
    if (ok) getAnalytics(app);
  });
}
