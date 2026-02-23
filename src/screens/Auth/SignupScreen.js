import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import CustomPickerInput from "../../components/CustomPickerInput";
import AuthService from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";

const SignupScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // detect light/dark mode
  const isDarkMode = false;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await AuthService.signup({ name, email, password, role });

      Alert.alert("Success", "User created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#fff" },
      ]}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color={isDarkMode ? "#fff" : "#000"}
        />
      </TouchableOpacity>

      {/* Top Decoration */}
      <View style={styles.topImage}>
        <Image
          source={require("../../../assets/admin_login_1.png")}
          style={styles.imageLarge}
        />
      </View>

      {/* Bottom Decoration */}
      <View style={styles.bottomImage}>
        <Image
          source={require("../../../assets/admin_login_2.png")}
          style={styles.imageLarge}
        />
      </View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: isDarkMode ? "#fff" : "#000" },
        ]}
      >
        Make New User
      </Text>

      {/* Name */}
      <CustomTextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={{ backgroundColor: isDarkMode ? "#1E1E1E" : "#F7F7F7" }}
      />

      {/* Email */}
      <CustomTextInput
        placeholder="Email or Phone Number"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={{ backgroundColor: isDarkMode ? "#1E1E1E" : "#F7F7F7" }}
      />

      {/* Role Dropdown */}
      <CustomPickerInput
        value={role}
        onValueChange={setRole}
        items={[
          { label: "Technician", value: "technician" },
          { label: "Complainer", value: "complainer" },
          { label: "Floor Manager", value: "floorManager" },
        ]}
        style={{ backgroundColor: isDarkMode ? "#1E1E1E" : "#F7F7F7" }}
      />

      {/* Password */}
      <CustomTextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={{ backgroundColor: isDarkMode ? "#1E1E1E" : "#F7F7F7" }}
      />

      {/* Confirm Password */}
      <CustomTextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        style={{ backgroundColor: isDarkMode ? "#1E1E1E" : "#F7F7F7" }}
      />

      {/* Button */}
      <CustomButton
        title={loading ? "Creating User..." : "Create User"}
        onPress={handleSignup}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      />
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  topImage: {
    position: "absolute",
    top: -50,
    right: -50,
  },
  bottomImage: {
    position: "absolute",
    bottom: -80,
    left: -140,
  },
  imageLarge: {
    width: 350,
    height: 350,
  },
});
