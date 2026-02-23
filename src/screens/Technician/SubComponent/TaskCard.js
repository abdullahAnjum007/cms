import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TaskCard = ({
  title,
  description,
  image,
  reportedBy,
  location,
  time,
  category,
  onPress,
  buttonLabel = "Accept Task",
}) => {
  const navigation = useNavigation(); // ✅ get navigation

  return (
    <View style={styles.card}>
      {/* 🔹 Title */}
      <Text style={styles.title}>{title}</Text>

      {/* 🔹 Description */}
      <Text style={styles.description}>{description}</Text>

      {/* 🔹 Image */}
      {image && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("ImagePreviewScreen", { image })
          }
        >
          <Image source={{ uri: image }} style={styles.image} />
        </TouchableOpacity>
      )}

      {!image && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("ImagePreviewScreen", {
              image: Image.resolveAssetSource(
                require("../../../../assets/ComplainPic.png")
              ).uri,
            })
          }
        >
          <Image
            source={require("../../../../assets/ComplainPic.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      )}

      {/* 🔹 Details */}
      {reportedBy && (
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={18} color="#444" />
          <Text style={styles.detailText}>Reported by: {reportedBy}</Text>
        </View>
      )}

      {location && (
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color="#444" />
          <Text style={styles.detailText}>{location}</Text>
        </View>
      )}

      {time && (
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={18} color="#444" />
          <Text style={styles.detailText}>{time}</Text>
        </View>
      )}

      {category && (
        <View style={styles.detailRow}>
          <Ionicons name="bookmark-outline" size={18} color="#444" />
          <Text style={styles.detailText}>{category}</Text>
        </View>
      )}

      {/* 🔹 Button */}
      {onPress && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 20,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
  },
  button: {
    backgroundColor: "#0C4C79",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
