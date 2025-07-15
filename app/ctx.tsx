import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "./firebaseConfig";
import { useStorageState } from "./useStorageState";

type AuthContextType = {
  session: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setSession(user ? user.uid : null);
  //   });
  //   return unsubscribe;
  // }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("response", response);
      setSession(email);
      return true;
    } catch (error) {
      console.error(error);
      Alert.alert("Sign-in failed", "Invalid email or password");
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Email already in use", "Try signing in instead.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert(
          "Weak Password",
          "Password should be at least 6 characters."
        );
      } else {
        Alert.alert("Sign up error", error.message);
      }
      console.error("Sign-up error:", error);
      return false;
    }
  };

  const signOut = async () => {
    setSession(null);
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ session, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
