import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { BASE_URL } from "../../services/apiHelper";

const DetailedComplain = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskData } = route.params;
  const item = taskData;

  const [repairedImage, setRepairedImage] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setRepairedImage(result.assets[0].uri);
    }
  };

  // Handle marking complaint as resolved
  const handleResolve = async () => {
    if (!repairedImage) {
      alert("Please upload a repaired image before marking resolved.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      // Upload image to Cloudinary
      const base64 = await FileSystem.readAsStringAsync(repairedImage, {
        encoding: "base64",
      });

      const formData = new FormData();
      formData.append("file", `data:image/jpeg;base64,${base64}`);
      formData.append("upload_preset", "cms_upload_photo");

      const uploadRes = await fetch(
        "https://api.cloudinary.com/v1_1/dm7yhi5sk/image/upload",
        { method: "POST", body: formData },
      );

      const uploadJson = await uploadRes.json();

      if (!uploadJson.secure_url) {
        alert("Image upload failed!");
        setLoading(false);
        return;
      }

      const repairedImageUrl = uploadJson.secure_url;

      // Update complaint status
      const res = await fetch(
        // `https://cms-backend-lake-theta.vercel.app/api/complaints/${item._id}/status`,
        `${BASE_URL}/complaints/${item._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "resolved",
            resolvedPhoto: repairedImageUrl,
            resolvedComment: comment || "",
          }),
        },
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Task marked as resolved!");
        navigation.goBack();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      setLoading(false);
      console.log("Resolve Error:", error);
      alert("Something went wrong!");
    }
  };

  // Image to display in preview/upload box
  const displayImageUri =
    repairedImage || (item.status === "resolved" && item.resolvedPhoto);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#EF4444";
      case "in-progress":
        return "#F59E0B";
      case "resolved":
        return "#22C55E";
      default:
        return "#3B82F6";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header
        title="Task Details"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: 12 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* MAIN CARD */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={{ alignItems: "flex-end" }}>
              <View style={[styles.badge, { backgroundColor: "#E0E7FF" }]}>
                <Text style={[styles.badgeText, { color: "#1E40AF" }]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.priority === "High"
                        ? "#FFCDD2"
                        : item.priority === "Medium"
                          ? "#FFE0B2"
                          : "#C8E6C9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        item.priority === "High"
                          ? "#D32F2F"
                          : item.priority === "Medium"
                            ? "#E65100"
                            : "#388E3C",
                    },
                  ]}
                >
                  {item.priority}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {/* Reported Image */}
          {item.photo && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setPreviewImage(item.photo);
                setPreviewVisible(true);
              }}
            >
              <Image source={{ uri: item.photo }} style={styles.image} />
            </TouchableOpacity>
          )}

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={18} color="#444" />
              <Text style={styles.detailLabel}>Reported by</Text>
            </View>
            <Text style={styles.detailValue}>{item.createdBy?.name}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color="#444" />
              <Text style={styles.detailLabel}>Location</Text>
            </View>
            <Text style={styles.detailValue}>{item.location}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="folder-open-outline" size={18} color="#444" />
              <Text style={styles.detailLabel}>Category</Text>
            </View>
            <Text style={styles.detailValue}>{item.category}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#444" />
              <Text style={styles.detailLabel}>Reported on</Text>
            </View>
            <Text style={styles.detailValue}>
              {moment(item.createdAt).format("MMM DD, hh:mm A")}
            </Text>
          </View>

          {/* MARK AS RESOLVED BUTTON */}
          {/* <TouchableOpacity
            style={[
              styles.resolveBtn,
              (loading || item.status === "resolved") && {
                backgroundColor: "#A5D6A7",
              },
            ]}
            disabled={loading || item.status === "resolved"}
            onPress={handleResolve}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resolveText}>
                {item.status === "resolved"
                  ? "Already Resolved"
                  : "Mark as Resolved"}
              </Text>
            )}
          </TouchableOpacity> */}
        </View>

        {/* UPLOAD / RESOLVED IMAGE CARD */}
        <View style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Repaired / Resolved Image</Text>

          <TouchableOpacity
            disabled={loading}
            activeOpacity={displayImageUri ? 0 : 1}
            style={[
              styles.uploadBox,
              displayImageUri && { height: 220, borderStyle: "solid" },
            ]}
            onPress={() => {
              if (displayImageUri) {
                setPreviewImage(displayImageUri);
                setPreviewVisible(true);
              }
            }}
          >
            {displayImageUri ? (
              <Image
                source={{ uri: displayImageUri }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
                resizeMode="cover"
              />
            ) : (
              <>
                {/* <Ionicons name="camera-outline" size={28} color="#555" /> */}
                <Text style={styles.uploadText}>
                  The Issue has not been resolved yet.
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* {!displayImageUri && (
            <TouchableOpacity
              style={styles.pickBtn}
              onPress={pickImage}
              disabled={loading || item.status === "resolved"}
            >
              <Text style={styles.pickBtnText}>Pick Image</Text>
            </TouchableOpacity>
          )} */}
        </View>
        {/* timeline */}
        {/* TIMELINE CARD */}
        <View style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Task Timeline</Text>

          {item.history?.length === 0 && (
            <Text style={{ color: "#777", marginTop: 8 }}>
              No timeline data
            </Text>
          )}

          {item.history?.map((h, index) => (
            <View key={index} style={styles.timelineRow}>
              {/* Left Line + Dot */}
              <View style={styles.timelineLeft}>
                {index !== item.history.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
                <View
                  style={[
                    styles.timelineDot,
                    { backgroundColor: getStatusColor(h.status) },
                  ]}
                />
              </View>

              {/* Content */}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>
                  {h.status.toUpperCase()}
                </Text>

                {h.message && (
                  <Text style={styles.timelineMessage}>{h.message}</Text>
                )}

                {h.updatedBy?.name && (
                  <Text style={styles.timelineBy}>By: {h.updatedBy.name}</Text>
                )}

                <Text style={styles.timelineTime}>
                  {moment(h.createdAt).format("MMM DD, hh:mm A")}
                </Text>
              </View>
            </View>
          ))}
        </View>
        {/* IMAGE PREVIEW MODAL */}
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setPreviewVisible(false)}
            >
              <Ionicons name="close-circle" size={36} color="#fff" />
            </TouchableOpacity>
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailedComplain;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", width: "70%" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  description: { marginTop: 8, fontSize: 14, color: "#444", lineHeight: 20 },
  image: { width: "100%", height: 180, marginTop: 12, borderRadius: 10 },
  detailsSection: { marginTop: 16 },
  detailRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  detailLabel: { marginLeft: 8, fontSize: 13, color: "#777" },
  detailValue: {
    marginLeft: 26,
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginTop: 2,
  },
  resolveBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  resolveText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  uploadCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 20,
  },
  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: "#DDD",
    borderStyle: "dashed",
    borderRadius: 10,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  uploadText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
  pickBtn: {
    marginTop: 12,
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  pickBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: { width: "90%", height: "70%" },
  modalCloseBtn: { position: "absolute", top: 40, right: 20 },
  timelineRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  timelineLeft: {
    width: 20,
    alignItems: "center",
  },
  timelineLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#ddd",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 10,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: "700",
  },
  timelineMessage: {
    fontSize: 13,
    color: "#555",
  },
  timelineBy: {
    fontSize: 12,
    color: "#2563EB",
  },
  timelineTime: {
    fontSize: 11,
    color: "#888",
  },
});
