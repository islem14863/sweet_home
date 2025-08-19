import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";

import { useSession } from "@/app/ctx";
import { Home } from "@/app/api/homes";
import { toggleFavorite, isHomeFavorited } from "../utils";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app//store";
import { addFavorite, removeFavorite } from "../../favoriteSlice";


type Props = {
  home: Pick<
    Home,
    "id" | "title" | "price" | "images" | "address" | "description"
  >;
  onPress: () => void;
};

function HomeCard({ home, onPress }: Props) {
  
  const { session } = useSession();
  const userId = session;

  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const liked = favorites.some((f) => f.id === home.id);

  useEffect(() => {
    const syncFavorite = async () => {
      if (!userId) return;
      try {
        const confirmed = await isHomeFavorited(userId, home.id);

        if (confirmed && !liked) {
          dispatch(addFavorite(home as Home));
        } else if (!confirmed && liked) {
          dispatch(removeFavorite(home.id));
        }
      } catch (err) {
        console.error("Error syncing favorite status:", err);
      }
    };
    syncFavorite();
  }, [userId, home.id]);

  const handleLike = async () => {
    if (!userId) return;

    const prevLiked = liked;
    try {

      if (liked) {
        dispatch(removeFavorite(home.id));
      } else {
        dispatch(addFavorite(home as Home));
      }

      await toggleFavorite(userId, home as Home);
    } catch (err) {
      console.error("Favorite toggle failed:", err);

      if (prevLiked) {
        dispatch(addFavorite(home as Home));
      } else {
        dispatch(removeFavorite(home.id));
      }
    }
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View>
        <Image
          source={{
            uri: home.images[0]
              ? home.images[0].replace(/^\/+/, "")
              : "https://via.placeholder.com/300x200?text=No+Image",
          }}
          style={styles.image}
        />
        <TouchableOpacity onPress={handleLike} style={styles.heartIcon}>
          {liked ? <Heart fill="red" color="red" /> : <Heart />}
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{home.title}</Text>
        <Text style={styles.price}>${home.price}</Text>
        <Text style={styles.location}>{home.address}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  image: {
    height: 150,
    width: "100%",
    resizeMode: "cover",
    zIndex: 2,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    color: "green",
  },
  location: {
    color: "#777",
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    zIndex: 5,
  },
});
export default React.memo(HomeCard);