import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { BASE_URL } from "../../services/apiHelper";

/* 🔒 FORCE LIGHT MODE COLORS */
const COLORS = {
  bg: "#F7F7F7",
  card: "#FFFFFF",
  text: "#1A1A1A",
  subText: "#555",
  border: "#DDD",
  primary: "#2E7D32",
};

const TaskDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskData } = route.params;
  const item = taskData;

  const [repairedImage, setRepairedImage] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  /* ---------- IMAGE PICK ---------- */
  const openCamera = async () => {
    setImageModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) setRepairedImage(result.assets[0].uri);
  };

  const openGallery = async () => {
    setImageModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) setRepairedImage(result.assets[0].uri);
  };

  /* ---------- RESOLVE ---------- */
  const handleResolve = async () => {
    if (!repairedImage) {
      Alert.alert(
        "Missing Image",
        "Please upload a repaired image before resolving."
      );
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const base64 = await FileSystem.readAsStringAsync(repairedImage, {
        encoding: "base64",
      });

      const formData = new FormData();
      formData.append("file", `data:image/jpeg;base64,${base64}`);
      formData.append("upload_preset", "cms_upload_photo");

      const uploadRes = await fetch(
        "https://api.cloudinary.com/v1_1/dm7yhi5sk/image/upload",
        { method: "POST", body: formData }
      );

      const uploadJson = await uploadRes.json();
      if (!uploadJson.secure_url) {
        Alert.alert("Upload Failed", "Image upload failed");
        return;
      }

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
            resolvedPhoto: uploadJson.secure_url,
            resolvedComment: comment || "",
          }),
        }
      );

      if (res.ok) {
        Alert.alert("Success", "Task marked as resolved");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update task");
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header title="Task Details" showBack onBackPress={navigation.goBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
      >
        {/* MAIN CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          {/* TASK IMAGE PREVIEW */}
          {item.photo && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("ImagePreviewScreen", {
                  image: item.photo,
                })
              }
            >
              <Image source={{ uri: item.photo }} style={styles.image} />
            </TouchableOpacity>
          )}

          <Text style={styles.meta}>
            {moment(item.createdAt).format("MMM DD, hh:mm A")}
          </Text>

          <TouchableOpacity
            style={[
              styles.resolveBtn,
              (loading || item.status === "resolved") && { opacity: 0.6 },
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
          </TouchableOpacity>
        </View>

        {/* UPLOAD IMAGE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Repaired Image</Text>

          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() => {
              if (item.status === "resolved") {
                navigation.navigate("ImagePreviewScreen", {
                  image: item.resolvedPhoto,
                });
              } else if (repairedImage) {
                navigation.navigate("ImagePreviewScreen", {
                  image: repairedImage,
                });
              } else {
                setImageModalVisible(true);
              }
            }}
          >
            {item.status === "resolved" ? (
              <Image
                source={{ uri: item.resolvedPhoto }}
                style={styles.previewImage}
              />
            ) : repairedImage ? (
              <Image
                source={{ uri: repairedImage }}
                style={styles.previewImage}
              />
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={28}
                  color={COLORS.subText}
                />
                <Text style={styles.uploadText}>
                  Take photo or choose from gallery
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* COMMENT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Comment</Text>
          <TextInput
            placeholder="Comment here"
            style={styles.commentInput}
            multiline
            value={comment}
            onChangeText={setComment}
          />
        </View>
      </ScrollView>

      {/* IMAGE PICK MODAL */}
      <Modal transparent visible={imageModalVisible} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setImageModalVisible(false)}
        >
          <View style={styles.modalBox}>
            <ModalItem icon="camera" text="Take Photo" onPress={openCamera} />
            <ModalItem
              icon="images"
              text="Choose from Gallery"
              onPress={openGallery}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default TaskDetailScreen;

/* ---------- SMALL COMPONENT ---------- */
const ModalItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.modalItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={COLORS.text} />
    <Text style={{ color: COLORS.text }}>{text}</Text>
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  description: { marginTop: 6, color: COLORS.subText },
  meta: { marginTop: 10, fontSize: 12, color: COLORS.subText },
  image: { width: "100%", height: 180, borderRadius: 10, marginTop: 12 },
  resolveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  resolveText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  uploadBox: {
    height: 160,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 10 },
  uploadText: { marginTop: 6, fontSize: 12, color: COLORS.subText },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  commentInput: {
    marginTop: 10,
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalItem: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
