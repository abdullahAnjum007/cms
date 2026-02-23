import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import AuthService from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { BASE_URL } from "../../services/apiHelper";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await AuthService.login(email, password);

      if (!result || !result.token) {
        throw new Error("Invalid response from server.");
      }

      await AsyncStorage.multiSet([
        ["token", result.token],
        ["role", result.role?.toLowerCase() ?? ""],
        ["user", JSON.stringify(result)],
      ]);

      const expoPushToken = await AsyncStorage.getItem("expoPushToken");

      if (expoPushToken) {
        await fetch(
          // "https://cms-backend-lake-theta.vercel.app/api/auth/save-token",
          `${BASE_URL}/auth/save-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.token}`,
            },
            body: JSON.stringify({ token: expoPushToken }),
          }
        );
      }

      /* ---------------- ROLE ROUTING ---------------- */
      const role = result.role?.toLowerCase();

      let targetRoute = "AuthNavigator";

      if (role === "admin" || role === "floormanager") {
        targetRoute = "AdminNavigator";
      } else if (role === "complainer") {
        targetRoute = "ComplainerNavigator";
      } else if (role === "technician") {
        targetRoute = "TechnicianNavigator";
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: targetRoute }],
        })
      );
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Login Failed", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* TOP IMAGE */}
      <View style={styles.topImage}>
        <Image
          source={require("../../../assets/admin_login_1.png")}
          style={styles.imageLarge}
        />
      </View>

      {/* BOTTOM IMAGE */}
      <View style={styles.bottomImage}>
        <Image
          source={require("../../../assets/admin_login_2.png")}
          style={styles.imageLarge}
        />
      </View>

      <Text style={styles.title}>Login to your Account</Text>

      <CustomTextInput
        placeholder="Number or Email"
        value={email}
        onChangeText={setEmail}
        textColor="#000"
        backgroundColor="#F5F5F5"
        placeholderTextColor="#000"
      />

      <CustomTextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        textColor="#000"
        backgroundColor="#F5F5F5"
        placeholderTextColor="#000"
      />

      <CustomButton
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
        backgroundColor="#000"
        textColor="#fff"
        style={{ opacity: loading ? 0.7 : 1 }}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#000",
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
