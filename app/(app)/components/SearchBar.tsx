import React from "react";
import { TextInput, StyleSheet } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <TextInput
      placeholder="Search homes..."
      style={styles.input}
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
});
