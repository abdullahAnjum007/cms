import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  useColorScheme,
} from "react-native";
import Header from "../../components/Header";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComplaintService } from "../../services/ComplaintService";
import { useFocusEffect } from "@react-navigation/native";

export default function DashboardScreen({ navigation }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      console.log("📌 Dashboard Screen Focused - Fetching Complaints...");
      fetchComplaints();

      return () => {
        console.log("📌 Dashboard Screen Unfocused");
      };
    }, []),
  );

  const fetchComplaints = async () => {
    try {
      const data = await ComplaintService.getComplaintOfMy();
      setComplaints(data || []);
    } catch (error) {
      console.log("❌ API Fetch Error:", error.message);
    }
  };
  console.log("complains", complaints);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };

  /* SUMMARY COUNTS */
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const inProgress = complaints.filter(
    (c) => c.status === "in-progress",
  ).length;
  const pending = complaints.filter((c) => c.status === "pending").length;

  const renderStatusBadge = (status) => {
    let bg = "#FFE082";
    let color = "#6B4E00";

    if (status === "pending") {
      bg = "#F8D7DA";
      color = "#842029";
    } else if (status === "resolved") {
      bg = "#D1E7DD";
      color = "#0F5132";
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color }]}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: "#F5F6FA" }]}
      edges={["top", "bottom"]}
    >
      <Header title="Complainer Portal" showBack={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#000"}
          />
        }
      >
        {/* SUMMARY CARD */}
        <View style={[styles.summaryCard, { backgroundColor: "#fff" }]}>
          <Text style={[styles.summaryTitle, { color: "#000" }]}>
            My Report Summary
          </Text>

          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={[styles.number, { color: "#3B82F6" }]}>{total}</Text>
              <Text style={{ color: "#555" }}>Total Issues</Text>
            </View>

            <View style={styles.item}>
              <Text style={[styles.number, { color: "#22C55E" }]}>
                {resolved}
              </Text>
              <Text style={{ color: "#555" }}>Resolved</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: "#ddd" }]} />

          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={[styles.number, { color: "#F59E0B" }]}>
                {inProgress} 
              </Text>
              <Text style={{ color: "#555" }}>In Progress</Text>
            </View>

            <View style={styles.item}>
              <Text style={[styles.number, { color: "#EF4444" }]}>
                {pending}
              </Text>
              <Text style={{ color: "#555" }}>Pending</Text>
            </View>
          </View>
        </View>

        {/* RECENT REPORTS */}
        <View style={styles.reportsHeader}>
          <Text style={[styles.recentReports, { color: "#000" }]}>
            Recent Reports
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation
                .getParent()
                ?.navigate("ComplainerTabs", { screen: "Reports" })
            }
          >
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {complaints.slice(0, 3).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.reportCard, { backgroundColor: "#fff" }]}
            onPress={() =>
              navigation.navigate("ComplaintDetailScreen", { complaint: item })
            }
          >
            <View style={styles.reportCardHeader}>
              <Text style={[styles.reportTitle, { color: "#000" }]}>
                {item.title}
              </Text>
              {renderStatusBadge(item.status)}
            </View>

            <Text style={{ color: "#444", marginTop: 6 }}>
              {item.location} • {item.category}
            </Text>

            <Text style={styles.reportDate}>
              Reported {moment(item.createdAt).format("MMM DD, hh:mm A")}
            </Text>
          </TouchableOpacity>
        ))}

        {/* NEW ISSUE BUTTON */}
        <TouchableOpacity
          style={styles.newIssueBtn}
          onPress={() => navigation.navigate("ComplaintFormScreen")}
        >
          <Text style={styles.newIssueText}>＋ Report New Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },

  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },

  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  item: {
    width: "45%",
    alignItems: "center",
  },

  number: {
    fontSize: 22,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    marginVertical: 15,
  },

  reportsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  recentReports: {
    fontSize: 16,
    fontWeight: "600",
  },

  viewAll: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },

  reportCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  reportCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  reportTitle: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },

  reportDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  newIssueBtn: {
    backgroundColor: "#0A4D8C",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  newIssueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
