import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SummaryCard = ({ label, value, color }) => {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#c0bfbf",
    borderRadius: 10,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
});
