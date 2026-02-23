import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

const ComplaintFormScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  /* ---------- THEME COLORS ---------- */
  const bgColor = "#F5F5F7";
  const cardBg = "#fff";
  const inputBg = "#F2F2F2";
  const textColor = "#000";
  const subText = "#444";
  const borderColor = "#e3e3e3";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [floor, setFloor] = useState("");
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ["IT", "Exhibits", "Design"];
  const priorities = ["High", "Medium", "Low"];

  /* ---------- IMAGE HANDLERS ---------- */

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

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const openGallery = async () => {
    setImageModalVisible(false);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  /* ---------- FORM ---------- */

  const validateForm = () => {
    if (!title || !category || !priority || !floor || !description) {
      Alert.alert("Error", "Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      let imageUrl = null;

      if (photo) {
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
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
          Alert.alert("Error", "Image upload failed");
          setLoading(false);
          return;
        }

        imageUrl = uploadJson.secure_url;
      }

      const body = {
        title,
        category,
        priority,
        floor,
        theme,
        description,
        location: "Default Location",
        photo: imageUrl,
      };

      const res = await fetch(
        // "https://cms-backend-lake-theta.vercel.app/api/complaints",
        `${BASE_URL}/complaints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        Alert.alert("Success", "Complaint submitted!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to submit complaint");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <Header
        title="Report new Issue"
        showBack
        onBackPress={navigation.goBack}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* TITLE */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.label, { color: textColor }]}>
            Issue Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, color: textColor },
            ]}
            placeholder="Brief description of the issue"
            placeholderTextColor={subText}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* IMAGE PICKER */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.label, { color: textColor }]}>Upload Photo</Text>

          <TouchableOpacity
            style={[styles.uploadBox, { borderColor }]}
            onPress={() => setImageModalVisible(true)}
          >
            {photo ? (
              <Image
                source={{ uri: photo.uri }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            ) : (
              <>
                <Ionicons name="camera-outline" size={32} color={subText} />
                <Text style={[styles.uploadText, { color: subText }]}>
                  Take photo or choose from gallery
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send-outline" size={20} color="#fff" />
              <Text style={styles.submitText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* CAMERA / GALLERY MODAL */}
      <Modal visible={imageModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setImageModalVisible(false)}
        >
          <View style={[styles.modalBox, { backgroundColor: cardBg }]}>
            <TouchableOpacity style={styles.modalAction} onPress={openCamera}>
              <Ionicons name="camera" size={22} color={textColor} />
              <Text style={{ color: textColor }}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalAction} onPress={openGallery}>
              <Ionicons name="images" size={22} color={textColor} />
              <Text style={{ color: textColor }}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ComplaintFormScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },

  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },

  uploadBox: {
    height: 140,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 5,
  },

  submitBtn: {
    backgroundColor: "#0F60A3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    borderRadius: 12,
    padding: 10,
  },

  modalAction: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    alignItems: "center",
  },
});
