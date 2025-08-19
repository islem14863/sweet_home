import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AboutUsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sweet Home</Text>
      <Text style={styles.subtitle}>Property Finder App</Text>
      <Text style={styles.body}>
        Sweet Home is your reliable property finder app helping you discover
        your dream home easily and quickly. Explore apartments, townhouses,
        studios, and much more — all in one place.
        {"\n\n"}
        Developed with passion and care to make your home search effortless.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "white",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8A2F4B",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
    textAlign: "center",
  },
});
