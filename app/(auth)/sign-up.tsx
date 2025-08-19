import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSession } from "../ctx";
import { router } from "expo-router";
import BackgroundVideo from "../bg";

export default function SignUpScreen() {
  const { signUp } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const success = await signUp(email.trim(), password.trim());
    setLoading(false);

    if (!success) {
      Alert.alert("Sign-up failed", "Please check your details and try again.");
      return;
    }

  };

  return (
    <BackgroundVideo>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <BlurView intensity={70} tint="light" style={styles.glassBox}>
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#ffffff"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#ffffff"
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={() => router.replace("./welcomeScreen")}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </BackgroundVideo>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassBox: {
    padding: 25,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "white",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    borderColor: "transparent",
    borderWidth: 3,
    backgroundColor: "#C4A2A8",
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 120,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    backgroundColor: "#8A2F4B",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});