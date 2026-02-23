import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import Header from "../../components/Header";
import { ComplaintService } from "../../services/ComplaintService";

const screenWidth = Dimensions.get("window").width;

const AnalyticsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await ComplaintService.getAllComplaints();
      setComplaints(data || []);
    } catch (error) {
      console.log("❌ API Error:", error.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Status calculations
  const total = complaints.length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "resolved"
  ).length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "in-progress"
  ).length;

  const statusData = [
    { label: "Resolved", count: resolvedCount, color: "#4ADE80" },
    { label: "In Progress", count: inProgressCount, color: "#FDBA74" },
    { label: "Pending", count: pendingCount, color: "#EF4444" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Admin Portal" />
      <ScrollView
        style={{ padding: 10 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchComplaints} />
        }
      >
        {/* Status Breakdown */}
        <Text style={styles.sectionTitle}>Status Breakdown</Text>
        <View style={styles.statusCard}>
          {statusData.map((status, index) => {
            const percent = total ? (status.count / total) * 100 : 0;
            return (
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
                      { width: `${percent}%`, backgroundColor: status.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Performance Trends Chart */}
        <Text style={styles.sectionTitle}>Performance Trends</Text>
        <View style={styles.trendCard}>
          <PieChart
            data={[
              { name: "Resolved", population: resolvedCount, color: "#4ADE80" },
              {
                name: "In Progress",
                population: inProgressCount,
                color: "#FDBA74",
              },
              { name: "Pending", population: pendingCount, color: "#EF4444" },
            ]}
            width={screenWidth - 60}
            height={200}
            chartConfig={{
              decimalPlaces: 0,
              color: () => "#000",
              labelColor: () => "#333",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="20"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginTop: 20,
  },
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
});
