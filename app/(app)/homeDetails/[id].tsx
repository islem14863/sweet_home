import { useLocalSearchParams, useRouter, } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { BaseUrl } from "@/app/api/homes";
import type { Home } from "@/app/api/homes";
import {
  Home as HomeIcon,
  BedDouble,
  Bath,
  Ruler,
  Calendar,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  User,
  ArrowLeft,
} from "lucide-react-native";
import { current } from "@reduxjs/toolkit";

const { width } = Dimensions.get("window");

export default function HomeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const params = useLocalSearchParams();
  const fromTab = params.fromTab as
    | "homeScreen"
    | "map"
    | "favorite"
    | undefined;

  const handleBack = () => {
    if (!fromTab) {
      router.back();
      return;
    }

    router.replace(`/${fromTab}`);
  };


  useEffect(() => {
    if (!id) return;

    fetch(`${BaseUrl}/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHome(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching home details:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  if (error || !home) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Failed to load home.</Text>
      </View>
    );
  }

  const handleScroll = (event: any) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    );
    setActiveImage(slide);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
      >
        <ArrowLeft size={30} color="#8A2F4B" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <FlatList
          data={
            home.images?.length
              ? home.images
              : ["https://via.placeholder.com/300x200?text=No+Image"]
          }
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Image
              source={{
                uri: item.startsWith("http")
                  ? item
                  : `${BaseUrl}/${item.replace(/^\/+/, "")}`,
              }}
              style={styles.image}
            />
          )}
          style={{ width, height: 250, borderRadius: 12, borderColor: "#8A2F4B", borderWidth: 0.5, shadowColor: "#8A2F4B", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 20 }}
        />
        <View style={styles.dotsContainer}>
          {(home.images || []).map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, { opacity: idx === activeImage ? 1 : 0.3 }]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.title}>{home.title}</Text>
      <Text style={styles.description}>{home.description}</Text>

      <View style={styles.row}>
        <DollarSign size={18} color="green" />
        <Text style={styles.label}>
          {" "}
          Price:{" "}
          <Text style={styles.value}>${home.price.toLocaleString()}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <MapPin size={18} color="black" />
        <Text style={styles.label}>
          {" "}
          Location:{" "}
          <Text style={styles.value}>
            {home.address}, {home.city}, {home.state} {home.zipCode}
          </Text>
        </Text>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.row}>
          <HomeIcon size={18} />
          <Text style={styles.detail}>{home.propertyType}</Text>
        </View>
        <View style={styles.row}>
          <BedDouble size={18} />
          <Text style={styles.detail}>{home.bedrooms} Bedrooms</Text>
        </View>
        <View style={styles.row}>
          <Bath size={18} />
          <Text style={styles.detail}>{home.bathrooms} Bathrooms</Text>
        </View>
        <View style={styles.row}>
          <Ruler size={18} />
          <Text style={styles.detail}>{home.squareFootage} sq.ft</Text>
        </View>
        <View style={styles.row}>
          <Calendar size={18} />
          <Text style={styles.detail}>Built in {home.yearBuilt}</Text>
        </View>
        <Text
          style={[styles.detail, { color: home.isAvailable ? "green" : "red" }]}
        >
          {home.isAvailable ? "Available" : "Not Available"}
        </Text>
        <Text style={styles.detail}>
          Listed: {new Date(home.listingDate).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Amenities</Text>
      <View style={styles.amenitiesContainer}>
        {home.amenities?.length ? (
          home.amenities.map((a, i) => (
            <Text key={i} style={styles.amenity}>
              • {a}
            </Text>
          ))
        ) : (
          <Text style={styles.value}>No amenities listed</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Agent Info</Text>
      <View style={styles.row}>
        <User size={18} />
        <Text style={styles.detail}>{home.agentName}</Text>
      </View>
      <View style={styles.row}>
        <Phone size={18} />
        <Text style={styles.detail}>{home.agentPhone}</Text>
      </View>
      <View style={styles.row}>
        <Mail size={18} />
        <Text style={styles.detail}>{home.agentEmail}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: "15%",
    backgroundColor: "#f5e6e8",
    justifyContent: "center",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: "10%",
  },
  backText: {
    color: "#8A2F4B",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  image: { width, height: 250, borderRadius: 12, },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8A2F4B",
    marginHorizontal: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#8A2F4B",
  },
  description: { fontSize: 16, marginBottom: 10, color: "#333" },
  label: { fontSize: 16, fontWeight: "600", marginLeft: 6, color: "#8A2F4B" },
  value: { fontWeight: "normal", color: "#444" },
  error: { color: "red", textAlign: "center", fontSize: 18 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailsBox: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#C4A2A8",
    padding: 12,
    borderRadius: 12,
    borderColor: "#8A2F4B",
    borderWidth: 1.1,
    shadowColor: "#8A2F4B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 20,
  },
  detail: { fontSize: 15, marginLeft: 6, marginBottom: 3, color: "#8A2F4B" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#8A2F4B",
  },
  amenitiesContainer: { marginBottom: 10 },
  amenity: { fontSize: 14, marginBottom: 3, color: "#8A2F4B" },
});