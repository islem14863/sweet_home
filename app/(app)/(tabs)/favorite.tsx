import React, { useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import HomeCard from "../components/HomeCard";
import { Home } from "@/app/api/homes";
import { useSession } from "@/app/ctx";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

export default function FavoritesScreen() {
  const { session } = useSession();
  const [favorites, setFavorites] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        if (!session) return;
        setLoading(true);
        try {
          const ref = collection(db, `users/${session}/favorites`);
          const snap = await getDocs(ref);
          const data = snap.docs.map((doc) => doc.data() as Home);
          setFavorites(data);
        } catch (err) {
          console.error("Error fetching favorites:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }, [session])
  );
  const styles = StyleSheet.create({
    topBar: {
      height: 80,
      backgroundColor: "#C4A2A8",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    topBarText: {
      color: "#f5e6e8",
      fontSize: 20,
      padding: 29,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5e6e8",
    },
  });
  if (!session) return null;
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../../../assets/lottie/loading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
  <View style={{ flex: 1, backgroundColor: "#f5e6e8" }}>
    <View style={styles.topBar}>
      <Text style={styles.topBarText}>Favorites</Text>
    </View>
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HomeCard
          home={item}
          onPress={() =>
            router.push({
              pathname: `/homeDetails/[id]`,
              params: { id: item.id, fromTab: "favorite" },
            })
          }
        />
      )}
      ListEmptyComponent={
        <Text style={{ padding: 50 }}>No favorites yet 💔</Text>
      }
      contentContainerStyle={{ padding: 10, paddingBottom: "26%" }}
    />
  </View>
);}