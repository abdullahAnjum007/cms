import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

const ImagePreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { image } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 🖼 Full Image */}
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default ImagePreviewScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
});
