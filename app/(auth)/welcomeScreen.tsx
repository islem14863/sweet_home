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
} from "react-native";
import { BlurView } from "expo-blur";
import { useSession } from "../ctx";
import { router } from "expo-router";
import BackgroundVideo from "../bg";

export default function welcomeScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    const success = await signIn(email, password);
    if (!success) {
      Alert.alert("Sign-in failed!");
    }
  };

  return (
    <BackgroundVideo>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <BlurView intensity={70} tint="light" style={styles.glassBox}>
          <Text style={styles.title}>welcome to sweet_home</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}> don't have an account ? </Text>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.replace("./sign-up")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
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
        borderWidth: 3,
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
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,
    borderColor: "transparent",
    borderWidth: 3,
  },
  button: {
    backgroundColor: "#7F7AC4",
    paddingVertical: 10,
    paddingHorizontal: "40%",
    borderRadius: 10,
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#4B3D61",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    justifyContent: "center",
  },
});
