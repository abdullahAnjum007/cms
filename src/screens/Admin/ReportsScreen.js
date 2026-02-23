import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../services/apiHelper";

const ReportsScreen = () => {
  const navigation = useNavigation();
  // const [role, setRole] = useState("admin");

  const downloadExcelReport = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
     
    

      if (!token) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const url =
        // "https://cms-backend-lake-theta.vercel.app/api/reports/complaints/excel";
        `${BASE_URL}/reports/complaints/excel`;

      const fileUri = FileSystem.documentDirectory + "complaints-report.xlsx";

      const result = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Saved at:", result.uri);

      // 🔥 OPEN / SHARE FILE
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri);
      } else {
        Alert.alert(
          "Downloaded",
          "File downloaded, but sharing is not available on this device.",
        );
      }
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Error", "Failed to download report");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Admin Portal" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Cards */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.smallCard}
            onPress={() => {
              navigation.navigate("SignUpScreen");
            }}
          >
            <Text style={styles.smallCardText}>Register{"\n"} New User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallCard}
            onPress={() => {
              navigation.navigate("AUAScreen");
            }}
            // onPress={downloadExcelReport}
          >
            <Text style={styles.smallCardText}>
              Currently Registered{"\n"}Users
            </Text>
          </TouchableOpacity>
        </View>

        {/* Export Reports */}
        <Text style={styles.sectionTitle}>Export Reports</Text>

        <View style={styles.exportCard}>
          {/* PDF */}
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.exportItem, { backgroundColor: "#FFE4DC" }]}
          >
            <View style={styles.exportLeft}>
              <Ionicons
                name="document-text-outline"
                size={26}
                color="#FF3B30"
              />
              <Text style={styles.exportText}>Monthly Report PDF</Text>
            </View>

            <Ionicons name="download-outline" size={24} color="#FF3B30" />
          </TouchableOpacity> */}

          {/* Excel */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={downloadExcelReport}
            style={[styles.exportItem, { backgroundColor: "#D9FFD9" }]}
          >
            <View style={styles.exportLeft}>
              <Ionicons name="grid-outline" size={26} color="#22C55E" />
              <Text style={styles.exportText}>Data Export Excel</Text>
            </View>

            <Ionicons name="download-outline" size={24} color="#22C55E" />
          </TouchableOpacity>

          {/* Word */}
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.exportItem, { backgroundColor: "#DAD9FF" }]}
          >
            <View style={styles.exportLeft}>
              <Ionicons name="document-outline" size={26} color="#4F46E5" />
              <Text style={styles.exportText}>Report MS Word</Text>
            </View>

            <Ionicons name="download-outline" size={24} color="#4F46E5" />
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },

  scroll: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Top Cards */
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  smallCardText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },

  /* Section Title */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginTop: 24,
    marginBottom: 12,
  },

  /* Export Card */
  exportCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  exportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },

  exportLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  exportText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
