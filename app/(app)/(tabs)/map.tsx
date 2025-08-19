import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker, Region, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import fetchHomes from "../../api/homes";
import { Home } from "../searching";
import { useRouter } from "expo-router";

export default function HomeMap() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const [userRegion, setUserRegion] = useState<Region | null>(null);
  const [allHomes, setAllHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState("10");
  const [filteredHomes, setFilteredHomes] = useState<Home[]>([]);

  function getDistanceFromLatLonInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const loadAllHomes = async () => {
    setLoading(true);
    let page = 1;
    let totalPages = Infinity;
    let homesAccum: Home[] = [];

    try {
      while (page <= totalPages) {
        const data = await fetchHomes(page, 5);

        if (!Array.isArray(data.items) || data.items.length === 0) break;

        homesAccum = [...homesAccum, ...data.items];

        if (data.totalPages) {
          totalPages = data.totalPages;
        } else {
          if (data.items.length < 5) break;
        }

        page++;
      }

      setAllHomes(homesAccum);
    } catch (error) {
      console.error("Error loading homes:", error);
      Alert.alert("Error", "Failed to load homes");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to use the map."
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setUserRegion(region);
    mapRef.current?.animateToRegion(region, 1000);
  };

  // Filter homes within radius
  useEffect(() => {
    if (!userRegion) return;

    const radiusMeters = Number(radiusKm) * 1000;
    if (isNaN(radiusMeters) || radiusMeters <= 0) {
      setFilteredHomes(allHomes);
      return;
    }

    const filtered = allHomes.filter((home) => {
      const dist = getDistanceFromLatLonInMeters(
        userRegion.latitude,
        userRegion.longitude,
        home.coordinates.latitude,
        home.coordinates.longitude
      );
      return dist <= radiusMeters;
    });

    setFilteredHomes(filtered);
  }, [allHomes, radiusKm, userRegion]);

  useEffect(() => {
    loadAllHomes();
    getUserLocation();
  }, []);

  if (!userRegion) {
    return <View style={styles.loadingContainer}></View>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={userRegion}
            showsUserLocation={true}
          >
            <UrlTile
              urlTemplate="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              maximumZ={19}
              flipY={false}
            />

            <Marker coordinate={userRegion} title="You are here" />

            {filteredHomes.map((home) => (
              <Marker
                key={home.id}
                coordinate={{
                  latitude: home.coordinates.latitude,
                  longitude: home.coordinates.longitude,
                }}
                title={home.title}
                description={home.description}
                onPress={() =>
                  router.push({
                    pathname: `/homeDetails/[id]`,
                    params: { id: home.id, fromTab: "map" },
                  })
                }
              />
            ))}
          </MapView>

          <View style={styles.radiusInputContainer}>
            <Text>Radius (km): </Text>
            <TextInput
              style={styles.radiusInput}
              keyboardType="numeric"
              value={radiusKm}
              onChangeText={setRadiusKm}
              placeholder="Enter radius in km"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#eee",
  },
  radiusInputContainer: {
    position: "absolute",
    top: 35,
    left: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 6,
  },
  radiusInput: {
    width: 150,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#888",
    textAlign: "center",
    fontSize: 16,
    marginLeft: 6,
  },
});