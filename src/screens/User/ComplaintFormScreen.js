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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { BASE_URL } from "../../services/apiHelper";

/* 🔒 FORCE LIGHT MODE COLORS */
const COLORS = {
  bg: "#F5F5F7",
  card: "#FFFFFF",
  input: "#F2F2F2",
  text: "#000",
  subText: "#444",
  border: "#E3E3E3",
  primary: "#0F60A3",
};

const ComplaintFormScreen = ({ navigation }) => {
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

    if (!result.canceled) setPhoto(result.assets[0]);
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

    if (!result.canceled) setPhoto(result.assets[0]);
  };

  /* ---------- VALIDATION ---------- */
  const validateForm = () => {
    if (!title || !category || !priority || !floor || !description) {
      Alert.alert("Error", "Please fill all required fields");
      return false;
    }
    return true;
  };

  /* ---------- SUBMIT ---------- */
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
        imageUrl = uploadJson.secure_url;
      }

      const body = {
        title,
        category,
        priority,
        floor,
        theme,
        description,
        location: floor,
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
        Alert.alert("Success", "Complaint submitted");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to submit complaint");
      }
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header
        title="Report New Issue"
        showBack
        onBackPress={navigation.goBack}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* TITLE */}
        <InputCard label="Issue Title *">
          <TextInput
            style={styles.input}
            placeholder="Brief description"
            placeholderTextColor={COLORS.subText}
            value={title}
            onChangeText={setTitle}
          />
        </InputCard>

        {/* CATEGORY */}
        <DropdownCard
          label="Category *"
          value={category}
          placeholder="Select category"
          onPress={() => setOpenDropdown("category")}
        />

        {/* PRIORITY */}
        <DropdownCard
          label="Priority *"
          value={priority}
          placeholder="Select priority"
          onPress={() => setOpenDropdown("priority")}
        />

        {/* LOCATION */}
        <InputCard label="Location *">
          <TextInput
            style={styles.input}
            placeholder="ex: 1st Floor near Lobby"
            placeholderTextColor={COLORS.subText}
            value={floor}
            onChangeText={setFloor}
          />
        </InputCard>

        {/* THEME */}
        <InputCard label="Theme ">
          <TextInput
            style={styles.input}
            placeholder="Maintenance, Cleaning..."
            placeholderTextColor={COLORS.subText}
            value={theme}
            onChangeText={setTheme}
          />
        </InputCard>

        {/* DESCRIPTION */}
        <InputCard label="Description *">
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe the issue"
            placeholderTextColor={COLORS.subText}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </InputCard>

        {/* IMAGE */}
        <InputCard label="Upload Photo">
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() => setImageModalVisible(true)}
          >
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.previewImage} />
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={32}
                  color={COLORS.subText}
                />
                <Text style={styles.uploadText}>
                  Take photo or choose from gallery
                </Text>
              </>
            )}
          </TouchableOpacity>
        </InputCard>

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

      {/* IMAGE MODAL */}
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

      {/* DROPDOWN MODAL */}
      <Modal transparent visible={!!openDropdown} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenDropdown(null)}
        >
          <View style={styles.modalBox}>
            {(openDropdown === "category" ? categories : priorities).map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    openDropdown === "category"
                      ? setCategory(item)
                      : setPriority(item);
                    setOpenDropdown(null);
                  }}
                >
                  <Text style={{ color: COLORS.text }}>{item}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ComplaintFormScreen;

/* ---------- SMALL REUSABLE COMPONENTS ---------- */

const InputCard = ({ label, children }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const DropdownCard = ({ label, value, placeholder, onPress }) => (
  <InputCard label={label}>
    <TouchableOpacity style={styles.dropdown} onPress={onPress}>
      <Text style={{ color: value ? COLORS.text : COLORS.subText }}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={20} color={COLORS.subText} />
    </TouchableOpacity>
  </InputCard>
);

const ModalItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.modalItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={COLORS.text} />
    <Text style={{ color: COLORS.text }}>{text}</Text>
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: 12 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  textarea: { height: 100, textAlignVertical: "top" },
  dropdown: {
    backgroundColor: COLORS.input,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadBox: {
    height: 140,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 10 },
  uploadText: { marginTop: 6, fontSize: 12, color: COLORS.subText },
  submitBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
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
