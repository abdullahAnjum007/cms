import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions, useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  // 🔹 Load user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(["token", "role", "user"]);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "AuthNavigator" }],
                })
              );
            } catch (err) {
              Alert.alert("Error", "Failed to logout.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔹 Dark Status Bar (icons dark on white bg) */}
     

      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔹 Profile Header */}
        <View style={styles.profileSection}>
          <Image
            source={
              user.profileImage
                ? { uri: user.profileImage }
                : require("../../../assets/i.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.name}>
            {user.fullName || user.name || "N/A"}
          </Text>
          <Text style={styles.role}>
            {user.role ? user.role.toUpperCase() : "USER"}
          </Text>
        </View>

        {/* 🔹 User Information */}
        <View style={styles.infoSection}>
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Phone" value={user.phone || user.mobile} />
          <InfoItem label="Username" value={user.username} />
          <InfoItem label="CNIC" value={user.cnic} />
          <InfoItem label="Address" value={user.address} />
          <InfoItem label="City" value={user.city} />
          <InfoItem label="Status" value={user.status} />
          {/* <InfoItem label="Account ID" value={user._id} /> */}
          <InfoItem
            label="Created At"
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : null
            }
          />
        </View>

        {/* 🔹 Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🔹 Reusable Info Row */
const InfoItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <View style={styles.infoItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "#0C4C79",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  role: {
    fontSize: 14,
    color: "#0C4C79",
    marginTop: 4,
    fontWeight: "600",
  },
  infoSection: {
    width: "90%",
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 3,
  },
  infoItem: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: "#777",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#E63946",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
