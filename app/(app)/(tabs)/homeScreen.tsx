import React, {useState } from "react";
import {   
  View,
  StyleSheet,   
  TouchableOpacity,   
  FlatList,   
  ImageBackground,   
  Text,   
  ScrollView, } 
from "react-native"; 
import { useRouter } from "expo-router"; 
import { BlurView } from "expo-blur"; 
import { LinearGradient } from "expo-linear-gradient"; 
import { Ionicons } from "@expo/vector-icons"; 
import { Picker } from "@react-native-picker/picker"; 
import { User } from "lucide-react-native";  

import SearchBar from "../components/SearchBar"; 
import HomeCard from "../components/HomeCard"; 
import { Filters } from "../filteredHomes";  
import searching from "../searching";

type Home = {   
  id: string;   
  title: string;   
  address: string;   
  city: string;   
  state: string;   
  zipCode: string;   
  price: number;   
  propertyType: string;   
  bedrooms: number;   
  bathrooms: number;   
  squareFootage: number;   
  yearBuilt: number;   
  description: string;   
  amenities: string[];   
  images: string[];   
  coordinates: {     
    latitude: number;     
    longitude: number;   
  };   
  isAvailable: boolean;   
  listingDate: string;   
  agentName: string;   
  agentPhone: string;   
  agentEmail: string; 
}; 
const PROPERTY_TYPES = [   
  "Apartment",   
  "Penthouse",   
  "Studio",   
  "Townhouse",   
  "Home",   
  "Urban",   
  "Loft",   
  "Suburban",   
  "Beachfront",   
  "Smart",   
  "Cottage",   
  "Cabin" 
]; 
const PRICE_RANGES = [   
  {label: "None", value: null},   
  { label: "Under $2000", value: "under2000" },   
  { label: "$2000 - $3500", value: "2000to3500" },   
  { label: "$3000 - $5000", value: "3500to5000" },   
  { label: "Above $5000", value: "above5000" }, 
]; 
const BEDROOM_OPTIONS = [   
  { label: "Any", value: null },   
  { label: "0", value: 0 },   
  { label: "1", value: 1 },   
  { label: "2", value: 2 },   
  { label: "3", value: 3 },   
  { label: "4+", value: 4 }, 
];  
export default function HomeScreen() {

      const [filters, setFilters] = useState<Filters>({
        search: "",
        selectedTypes: [],
        selectedPriceRange: null,
        selectedBedrooms: null,
      });
      const [showFilters, setShowFilters] = useState(false);
      const [search, setSearch] = useState("");
      const [showMenu, setShowMenu] = useState(false);
      const router = useRouter();
      const {
        homes,
        filteredHomes,
        loadHomes,
        loading,
        error,
        page,
        totalPages,
      } = searching(search, filters);
 
    const toggleType = (type: string) => {     
      setFilters((f) => {       
    const selected = f.selectedTypes.includes(type)? f.selectedTypes.filter((t) => t !== type): [...f.selectedTypes, type];
      return { 
        ...f, selectedTypes: selected 
      };       
    });   
  };     
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../assets/images/bg1.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.75)"]}
          style={StyleSheet.absoluteFill}
        >
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        </LinearGradient>
      </ImageBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace("/profile")}>
            <View
              style={{
                backgroundColor: "#f5e6e8",
                padding: 12,
                marginRight: 10,
                marginLeft: 0,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <User size={30} color="#C4A2A8" />
            </View>
          </TouchableOpacity>
          <SearchBar value={search} onChange={setSearch} />
          <TouchableOpacity
            onPress={() => setShowFilters((prev) => !prev)}
            style={styles.filterButton}
          >
            <Ionicons
              name={showFilters ? "close" : "filter"}
              size={24}
              color="#8A2F4B"
            />
          </TouchableOpacity>
        </View>
        {showFilters && (
          <View style={styles.filterPanel}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PROPERTY_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => toggleType(type)}
                  style={[
                    styles.typeOption,
                    filters.selectedTypes.includes(type) &&
                      styles.typeOptionSelected,
                  ]}
                >
                  <Text
                    style={{
                      color: filters.selectedTypes.includes(type)
                        ? "white"
                        : "black",
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.pickerContainer}>
              <Text>Price Range:</Text>
              <Picker
                selectedValue={filters.selectedPriceRange}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, selectedPriceRange: value }))
                }
                style={styles.picker}
              >
                {PRICE_RANGES.map(({ label, value }) => (
                  <Picker.Item key={label} label={label} value={value} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text>Bedrooms:</Text>
              <Picker
                selectedValue={filters.selectedBedrooms}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, selectedBedrooms: value }))
                }
                style={styles.picker}
              >
                {BEDROOM_OPTIONS.map(({ label, value }) => (
                  <Picker.Item key={label} label={label} value={value} />
                ))}
              </Picker>
            </View>
          </View>
        )}
        {error ? (
          <Text style={{ textAlign: "center", color: "red" }}>
            Failed to load homes. Please try again later.
          </Text>
        ) : (
          <View style={{ borderRadius: 16, overflow: "hidden", flex: 1 }}>
            <FlatList
              data={filteredHomes}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <HomeCard
                  home={{
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    images: item.images?.length
                      ? item.images
                      : ["https://via.placeholder.com/300x200?text=No+Image"],
                    address: `${item.city}, ${item.state}`,
                    description: item.description,
                  }}
                  onPress={() => router.push({
                          pathname: `/homeDetails/[id]`,
                          params: { id: item.id, fromTab: "homeScreen" },
                        })}
                />
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No homes found
                </Text>
              }
              onEndReached={()=>loadHomes(page)}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                loading ? (
                  <Text
                    style={{
                      textAlign: "center",
                      marginVertical: 10,
                      marginBottom: 100,
                    }}
                  >
                    Loading...
                  </Text>
                ) : page > totalPages && filteredHomes.length > 0 ? (
                  <Text
                    style={{
                      textAlign: "center",
                      marginVertical: 10,
                      color: "gray",
                    }}
                  >
                    No more homes to load
                  </Text>
                ) : null
              }
            />
          </View>
        )}
      </View>
    </View>
  ); 
  }  
  const styles = StyleSheet.create({   
    container: {     
      flex: 1,     
      paddingHorizontal: 16,     
      paddingTop: 50,   
    },   
    topBar: {     
      flexDirection: "row",     
      alignItems: "center",     
      marginBottom: "10%",     
      marginTop: "3%",   
    },   
    profile: {     
      width: 40,     
      height: 40,     
      borderRadius: 20,     
      marginRight: 10,   
    },   
    filterButton: {     
      marginLeft: 10,     
      backgroundColor: "#C4A2A8",     
      paddingVertical: 6,     
      paddingHorizontal: 12,     
      borderRadius: 8,     
      height: 40,     
      justifyContent: "center",   
    },   
    filterPanel: {     
      backgroundColor: "white",     
      padding: 10,     
      borderRadius: 12,     
      marginBottom: 20,   
    },   
    typeOption: {     
      paddingHorizontal: 12,     
      paddingVertical: 6,     
      borderRadius: 16,     
      borderWidth: 1,     
      borderColor: "#888",     
      marginRight: 10,   },   
    typeOptionSelected: {     
      backgroundColor: "#C4A2A8",     
      borderColor: "#C4A2A8",   },   
    pickerContainer: {     
      marginTop: 10,   },   
    picker: {
      width: 180,   },
    }); 