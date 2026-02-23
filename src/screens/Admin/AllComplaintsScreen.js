import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComplaintService } from "../../services/ComplaintService";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [role, setRole] = useState("admin");

  const navigation = useNavigation();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setRefreshing(true);
    const role = await AsyncStorage.getItem("role");
    setRole(role);
    try {
      const data = await ComplaintService.getAllComplaints();
      console.log("Fetched complaints:", data);
      setComplaints(data || []);
    } catch (error) {
      console.log("❌ API Error:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteComplaint = async (id) => {
    Alert.alert(
      "Delete Complaint",
      "Are you sure you want to delete this complaint?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await ComplaintService.deleteComplaint(id);

              // Remove from UI instantly (no reload needed)
              setComplaints((prev) => prev.filter((c) => c._id !== id));

              console.log("✅ Complaint deleted");
            } catch (error) {
              console.log("❌ Delete error:", error.message);
            }
          },
        },
      ],
    );
  };

  const normalizeStatus = (status = "") => status.toLowerCase();

  /* ---------------- TABS DATA ---------------- */
  const tabs = useMemo(() => {
    return [
      { key: "All", label: "All", count: complaints.length },
      {
        key: "pending",
        label: "Pending",
        count: complaints.filter((c) => normalizeStatus(c.status) === "pending")
          .length,
      },
      {
        key: "in-progress",
        label: "In Progress",
        count: complaints.filter(
          (c) => normalizeStatus(c.status) === "in-progress",
        ).length,
      },
      {
        key: "resolved",
        label: "Resolved",
        count: complaints.filter(
          (c) => normalizeStatus(c.status) === "resolved",
        ).length,
      },
    ];
  }, [complaints]);

  /* ---------------- FILTERED LIST ---------------- */
  const filteredComplaints = useMemo(() => {
    if (selectedTab === "All") return complaints;
    return complaints.filter((c) => normalizeStatus(c.status) === selectedTab);
  }, [complaints, selectedTab]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header
        title={
          role === "floormanager" ? "Floor Manager Portal" : "Admin Portal"
        }
      />

      {/* ----------- TABS ----------- */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            <Text
              style={[
                styles.tabCount,
                selectedTab === tab.key && styles.activeTabText,
              ]}
            >
              ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ----------- LIST ----------- */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchComplaints} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredComplaints.length === 0 && !refreshing && (
          <Text style={styles.emptyText}>No complaints found.</Text>
        )}

        {filteredComplaints.map((item) => (
          // <View
          //   style={{ alignItems:'center', marginVertical: 16 }}
          // >
          //   <TouchableOpacity onPress={() => handleDeleteComplaint(item._id)}>
          //     <Text style={{ color: "red", fontWeight: "700" }}>Delete</Text>
          //   </TouchableOpacity>
          //   <TouchableOpacity
          //     key={item._id}
          //     style={styles.issueCard}
          //     onPress={
          //       () =>
          //         navigation.navigate("TaskDetailScreen", {
          //           taskData: item,
          //           from: "TaskScreen",
          //         })
          //       // handleDeleteComplaint(item._id)
          //     }
          //     activeOpacity={0.85}
          //   >
          //     {/* HEADER */}
          //     <View style={styles.issueCardHeader}>
          //       <Text style={styles.issueTitle}>{item.title}</Text>

          //       <View
          //         style={[
          //           styles.priorityBadge,
          //           {
          //             backgroundColor:
          //               item.priority === "High"
          //                 ? "#FDE68A"
          //                 : item.priority === "Medium"
          //                   ? "#BFDBFE"
          //                   : "#D1FAE5",
          //           },
          //         ]}
          //       >
          //         <Text style={styles.priorityText}>
          //           {item.priority || "-"}
          //         </Text>
          //       </View>
          //     </View>

          //     {/* INFO */}
          //     <Text style={styles.issueInfo}>{item.floor || "-"}</Text>
          //     <Text style={styles.issueInfo}>
          //       Reported by {item.createdBy?.name || "Unknown"} • Assigned to:{" "}
          //       {item.resolvedBy?.name || "-"}
          //     </Text>

          //     {/* STATUS */}
          //     <View
          //       style={[
          //         styles.statusBadge,
          //         {
          //           backgroundColor:
          //             normalizeStatus(item.status) === "resolved"
          //               ? "#E8FFF2"
          //               : normalizeStatus(item.status) === "in progress"
          //                 ? "#E0E7FF"
          //                 : "#FEE2E2",
          //         },
          //       ]}
          //     >
          //       <Text
          //         style={{
          //           color:
          //             normalizeStatus(item.status) === "resolved"
          //               ? "#16A34A"
          //               : normalizeStatus(item.status) === "in progress"
          //                 ? "#2563EB"
          //                 : "#DC2626",
          //           fontWeight: "600",
          //         }}
          //       >
          //         {item.status}
          //       </Text>
          //     </View>
          //   </TouchableOpacity>
          // </View>
          <TouchableOpacity
            key={item._id}
            style={styles.issueCard}
            onPress={
              () =>
                navigation.navigate("TaskDetailScreen", {
                  taskData: item,
                  from: "TaskScreen",
                })
              // handleDeleteComplaint(item._id)
            }
            activeOpacity={0.85}
          >
            {/* HEADER */}
            <View style={styles.issueCardHeader}>
              <Text style={styles.issueTitle}>{item.title}</Text>

              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor:
                      item.priority === "High"
                        ? "#FDE68A"
                        : item.priority === "Medium"
                          ? "#BFDBFE"
                          : "#D1FAE5",
                  },
                ]}
              >
                <Text style={styles.priorityText}>{item.priority || "-"}</Text>
              </View>
            </View>

            {/* INFO */}
            <Text style={styles.issueInfo}>{item.floor || "-"}</Text>
            <Text style={styles.issueInfo}>
              Reported by {item.createdBy?.name || "Unknown"} • Assigned to:{" "}
              {item.resolvedBy?.name || "-"}
            </Text>

            {/* STATUS */}
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    normalizeStatus(item.status) === "resolved"
                      ? "#E8FFF2"
                      : normalizeStatus(item.status) === "in progress"
                        ? "#E0E7FF"
                        : "#FEE2E2",
                },
              ]}
            >
              <Text
                style={{
                  color:
                    normalizeStatus(item.status) === "resolved"
                      ? "#16A34A"
                      : normalizeStatus(item.status) === "in progress"
                        ? "#2563EB"
                        : "#DC2626",
                  fontWeight: "600",
                }}
              >
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllComplaintsScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#F5F6FA",
  },

  /* TABS */
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#0A4D8C",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },
  tabCount: {
    fontSize: 12,
    color: "#444",
  },
  activeTabText: {
    color: "#fff",
  },

  /* LIST */
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
    fontSize: 14,
  },
  issueCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 10,
    width: "95%",
    marginTop: 12,
    elevation: 3,
  },
  issueCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  issueInfo: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
