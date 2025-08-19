import {
  createContext,
  useContext,
  useEffect,
  type PropsWithChildren,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { Alert } from "react-native";
import auth from "./firebaseConfig";
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
  const [[storageIsLoading, session], setSession] = useStorageState("session");
  const [authIsLoading, setAuthIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;
      setSession(user ? user.uid : null);
      setAuthIsLoading(false);
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [setSession]);

  const isLoading = storageIsLoading || authIsLoading;

  const signIn = async (email: string, password: string) => {
    try {
      setAuthIsLoading(true);
      const response = await signInWithEmailAndPassword(auth, email, password);
      setSession(response.user.uid);
      setAuthIsLoading(false);
      return true;
    } catch (error) {
      console.error(error);
      setAuthIsLoading(false);
      Alert.alert("Sign-in failed", "Invalid email or password");
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setAuthIsLoading(true);
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSession(response.user.uid);
      setAuthIsLoading(false);
      return true;
    } catch (error: any) {
      setAuthIsLoading(true);
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
      setAuthIsLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      setAuthIsLoading(true);
      await firebaseSignOut(auth);
      setSession(null);
      setAuthIsLoading(false);
    } catch (error) {
      setAuthIsLoading(false);
      console.error("Sign-out error:", error);
      Alert.alert("Error signing out", "Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}