import React, { useState, useMemo, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../../components/Header";
import SummaryCard from "./SubComponent/SummaryCard";
import TaskCard from "./SubComponent/TaskCard";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { ComplaintService } from "../../services/ComplaintService";
import { setComplaints } from "../../redux/slices/complaintSlice";

const TechnicianDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const complaints = useSelector((state) => state.complaints.data || []);
  console.log("complains", complaints);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  // 🔹 Fetch Complaints
  const fetchComplaints = useCallback(async () => {
    try {
      const data = await ComplaintService.getAllComplaints();
      dispatch(setComplaints(data));
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // 🔹 Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  }, [fetchComplaints]);

  // 🔹 Accept Task
  const handleAcceptTask = async (task) => {
    if (task.status !== "pending") {
      Alert.alert("Not Allowed", "Only pending tasks can be accepted.");
      return;
    }

    try {
      setAcceptingId(task._id);
      await ComplaintService.updateComplaintStatus(
        task._id,
        "in-progress",
        "Technician started working"
      );
      fetchComplaints();
    } catch (err) {
      Alert.alert("Error", "Unable to accept task");
    } finally {
      setAcceptingId(null);
    }
  };

  // 🔹 Categories
  const categories = [
    { id: "all", label: "All", icon: "menu" },
    { id: "IT", label: "IT", icon: "hardware-chip-outline" },
    { id: "Exhibits", label: "Exhibits", icon: "business-outline" },
    { id: "Design", label: "Design", icon: "construct-outline" },
  ];

  // 🔹 Filtered Tasks (ONLY pending for technician)
  const filteredTasks = useMemo(() => {
    return complaints.filter(
      (task) =>
        task.status === "pending" &&
        (activeTab === "all" || task.category === activeTab)
    );
  }, [complaints, activeTab]);

  // 🔹 Summary Counts
  const pendingCount = complaints.filter((t) => t.status === "pending").length;
  const inProgressCount = complaints.filter(
    (t) => t.status === "in-progress"
  ).length;
  const resolvedCount = complaints.filter(
    (t) => t.status === "resolved"
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Technician Portal" showBack={false} />

      <ScrollView
        style={styles.body}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 Summary */}
        <Text style={styles.sectionTitle}>My Tasks Summary</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0C4C79" />
        ) : (
          <View style={styles.summaryRow}>
            <SummaryCard label="Pending" value={pendingCount} color="#FFDA0B" />
            <SummaryCard
              label="In Progress"
              value={inProgressCount}
              color="#0C4C79"
            />
            <SummaryCard
              label="Resolved"
              value={resolvedCount}
              color="#0C7913"
            />
          </View>
        )}

        {/* 🔹 Task Queue */}
        <Text style={styles.sectionTitle}>
          Task Queue ({filteredTasks.length})
        </Text>

        {/* 🔹 Tabs */}
        <View style={styles.tabsContainer}>
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isActive ? "#fff" : "#000"}
                />
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 🔹 Task List */}
        {loading ? (
          <ActivityIndicator size="large" color="#0C4C79" />
        ) : filteredTasks.length === 0 ? (
          <Text style={styles.emptyText}>No pending tasks</Text>
        ) : (
          filteredTasks.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              image={item.photo}
              description={item.description}
              reportedBy={item.createdBy?.name || "Unknown"}
              location={item.location || "N/A"}
              time={new Date(item.createdAt).toLocaleString()}
              category={item.category}
              buttonLabel={
                acceptingId === item._id ? "Accepting..." : "Accept Task"
              }
              disabled={acceptingId === item._id}
              onPress={() => handleAcceptTask(item)}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TechnicianDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  activeTab: {
    backgroundColor: "#0C4C79",
    borderColor: "#0C4C79",
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  activeLabel: {
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
});
