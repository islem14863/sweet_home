import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Brightness from "expo-brightness";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useSession } from "../../ctx";
import { BlurView } from "expo-blur"; 
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileMenu() {
  const router = useRouter();
  const { signOut } = useSession();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email ?? "");
        setName(user.displayName ?? "");
        setProfilePic(user.photoURL);
      } else {
        setEmail("");
        setName("");
        setProfilePic(null);
      }
    });

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "We need camera roll permissions to change your profile picture."
        );
      }
    })();

    return unsubscribe;
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setProfilePic(uri);

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: uri });
        }
      }
    } catch {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const onChangeName = async (text: string) => {
    setName(text);
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: text });
      } catch {
        Alert.alert("Error", "Failed to update name");
      }
    }
  };

const [savedBrightness, setSavedBrightness] = useState<number | null>(null);

const toggleBrightness = async () => {
  try {
    if (!isDarkMode) {
      const currentBrightness = await Brightness.getBrightnessAsync();
      setSavedBrightness(currentBrightness);
      await Brightness.setBrightnessAsync(0.1);
      setIsDarkMode(true);
    } else {
      await Brightness.setBrightnessAsync(savedBrightness ?? 1);
      setIsDarkMode(false);
    }
  } catch {
    Alert.alert("Error", "Failed to change brightness.");
  }
};
  return (
    <View style={styles.container}>
      <View style={styles.menu}>
      <View style={styles.bgimage}>
        <ImageBackground
            source={require("../../../assets/images/bg1.png")}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.8)"]}
              style={StyleSheet.absoluteFill}
            >
              <BlurView
                intensity={60}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
            </LinearGradient>
          </ImageBackground>   
        </View> 
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <User color="#8A2F4B" size={120} strokeWidth={1.5} />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={onChangeName}
          placeholder="Your Name"
          placeholderTextColor="#888"
        />
        <Text style={styles.email}>{email}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            {isDarkMode ? "Day Mode" : "Night Mode"}
          </Text>
          <Switch value={isDarkMode} onValueChange={toggleBrightness} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.signOutButton, loading && styles.buttonDisabled]}
            onPress={handleSignOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#C4A2A8" />
            ) : (
              <Text style={styles.signOutText}>Sign Out</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.aboutButton}
          onPress={() => router.push("/about")}
        >
          <Text style={styles.aboutText}>About Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5e6e8",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#f5e6e8",
    borderColor: "#C4A2A8",
    borderWidth: 2,
    margin: 40,
    padding: 20,
    borderRadius: 25,
    shadowColor: "#8A2F4B",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.5,
    elevation: 20,
    width: "100%",
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#8A2F4B",
  },
  nameInput: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: "#8A2F4B",
    color: "#000",
    width: 200,
    textAlign: "center",
  },
  email: {
    marginTop: "5%",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
  aboutButton: {
    marginTop: "30%",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 16,
  },
  aboutText: {
    color: "#8A2F4B",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#8A2F4B",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signOutText: {
    color: "#f5e6e8",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  ImageBackground: {
    flex: 1,
  },
  bgimage: {
    borderRadius: 23,
    overflow: "hidden",
    ...StyleSheet.absoluteFillObject,
  },
});