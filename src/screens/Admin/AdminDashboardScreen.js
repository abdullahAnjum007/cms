import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import Header from "../../components/Header";
import { ComplaintService } from "../../services/ComplaintService";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const role = await AsyncStorage.getItem("role");
    setRole(role);
    setLoading(true);
    try {
      const data = await ComplaintService.getAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.log("❌ API Fetch Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // return role;
  };
  console.log("📊 role", role);
  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const totalIssues = complaints.length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "resolved",
  ).length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "in-progress",
  ).length;

  const resolvedPercent = totalIssues ? (resolvedCount / totalIssues) * 100 : 0;
  const pendingPercent = totalIssues ? (pendingCount / totalIssues) * 100 : 0;
  const inProgressPercent = totalIssues
    ? (inProgressCount / totalIssues) * 100
    : 0;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <Header
        title={
          role === "floormanager" ? "Floor Manager Portal" : "Admin Portal"
        }
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* System Overview */}
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.cardRow}>
          <View style={[styles.overviewCard, { backgroundColor: "#FFF5F5" }]}>
            <Text style={styles.cardLabel}>Total Issues</Text>
            <Text style={[styles.cardValue, { color: "#EF2121" }]}>
              {totalIssues}
            </Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: "#E8FFF2" }]}>
            <Text style={styles.cardLabel}>Resolved</Text>
            <Text style={[styles.cardValue, { color: "#69E678" }]}>
              {resolvedCount}
            </Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <View style={[styles.overviewCard, { backgroundColor: "#FFF7E6" }]}>
            <Text style={styles.cardLabel}>Pending</Text>
            <Text style={[styles.cardValue, { color: "#FDBB51" }]}>
              {pendingCount}
            </Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: "#F0E8FF" }]}>
            <Text style={styles.cardLabel}>In Progress</Text>
            <Text style={[styles.cardValue, { color: "#6C5CE7" }]}>
              {inProgressCount}
            </Text>
          </View>
        </View>

        {/* Status Breakdown */}
        <Text style={styles.sectionTitle}>Status Breakdown</Text>
        <View style={styles.statusCard}>
          {[
            {
              label: "Resolved",
              color: "#4ADE80",
              count: resolvedCount,
              percent: resolvedPercent,
            },
            {
              label: "In Progress",
              color: "#FDBA74",
              count: inProgressCount,
              percent: inProgressPercent,
            },
            {
              label: "Pending",
              color: "#EF4444",
              count: pendingCount,
              percent: pendingPercent,
            },
          ].map((status, index) => (
            <View key={index} style={{ marginTop: index === 0 ? 0 : 14 }}>
              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View
                    style={[styles.dot, { backgroundColor: status.color }]}
                  />
                  <Text style={styles.statusLabel}>{status.label}</Text>
                </View>
                <Text style={styles.statusNumber}>{status.count}</Text>
              </View>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${status.percent}%`,
                      backgroundColor: status.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Performance Trends Chart */}
        <Text style={styles.sectionTitle}>Performance Trends</Text>
        <View style={styles.trendCard}>
          <PieChart
            data={[
              { name: "Resolved", population: resolvedCount, color: "#69E678" },
              { name: "Pending", population: pendingCount, color: "#FDBB51" },
              {
                name: "In Progress",
                population: inProgressCount,
                color: "#6C5CE7",
              },
            ]}
            width={screenWidth - 60}
            height={200}
            chartConfig={{
              decimalPlaces: 0,
              color: () => `black`,
              labelColor: () => "#333",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="20"
          />
        </View>

        {/* Recent Issues */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Issues</Text>
          <TouchableOpacity
            onPress={() =>
              navigation
                .getParent()
                ?.navigate("AdminTabs", { screen: "Issues" })
            }
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {complaints.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={styles.issueCardTouchable}
            onPress={() =>
              navigation.navigate("TaskDetailScreen", { taskData: item })
            }
            activeOpacity={0.8}
          >
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
                <Text style={styles.priorityText}>{item.priority}</Text>
              </View>
            </View>

            <Text style={styles.issueInfo}>{item.floor || "-"}</Text>
            <Text style={styles.issueInfo}>
              Reported by {item.createdBy?.name || "Unknown"} • Assigned to:{" "}
              {item.resolvedBy?.name || "-"}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === "resolved"
                      ? "#E8FFF2"
                      : item.status === "in-progress"
                        ? "#BFDBFE"
                        : "#FEE2E2",
                },
              ]}
            >
              <Text
                style={{
                  color:
                    item.status === "resolved"
                      ? "#22C55E"
                      : item.status === "in-progress"
                        ? "#2563EB"
                        : "#EF4444",
                  fontWeight: "600",
                }}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: "#ffffffff" },
  scrollView: { padding: 10, marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginTop: 20,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  overviewCard: { width: "48%", padding: 14, borderRadius: 12, marginTop: 10 },
  cardLabel: { fontSize: 13, color: "#444" },
  cardValue: { marginTop: 6, fontSize: 22, fontWeight: "700" },
  statusCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  statusLeft: { flexDirection: "row", alignItems: "center" },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  statusLabel: { fontSize: 15, fontWeight: "500", color: "#333" },
  statusNumber: { fontSize: 15, fontWeight: "600", color: "#222" },
  barBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 6,
  },
  barFill: { height: 10, borderRadius: 10 },
  trendCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  viewAllText: { color: "#007BFF", fontSize: 14 },
  issueCardTouchable: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  issueCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  issueTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priorityText: { fontSize: 12, fontWeight: "600", color: "#92400E" },
  issueInfo: { fontSize: 13, color: "#444", marginTop: 4 },
  statusBadge: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
