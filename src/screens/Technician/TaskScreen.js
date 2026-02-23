import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { ComplaintService } from "../../services/ComplaintService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { setComplaints } from "../../redux/slices/complaintSlice";

const TaskScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState("in-progress");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const complaints = useSelector((state) => state.complaints.data);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await ComplaintService.getAllComplaints();
      dispatch(setComplaints(data)); // uncomment if needed
    } catch (err) {
      console.log("❌ Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const filteredTasks = complaints?.filter(
    (task) => task.status === selectedTab
  );

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("TaskDetailScreen", {
          taskData: item,
          from: "TaskScreen",
        })
      }
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status}</Text>

          <Text
            style={[
              styles.priority,
              {
                backgroundColor:
                  item.priority === "high"
                    ? "#FFCDD2"
                    : item.priority === "medium"
                    ? "#FFE0B2"
                    : "#C8E6C9",
                color:
                  item.priority === "high"
                    ? "#D32F2F"
                    : item.priority === "medium"
                    ? "#E65100"
                    : "#388E3C",
              },
            ]}
          >
            {item.priority}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {item.description?.substring(0, 70)}...
      </Text>

      {/* Image with preview */}
      {item.photo && (
        // <TouchableOpacity
        //   activeOpacity={0.9}
        //   onPress={() =>
        //     navigation.navigate("ImagePreviewScreen", { image: item.photo })
        //   }
        // >
        //   <Image source={{ uri: item.photo }} style={styles.image} />
        // </TouchableOpacity>
        <Image source={{ uri: item.photo }} style={styles.image} />
      )}

      {/* Details */}
      <View style={styles.detailsContainer}>
        {item.reportedBy && (
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color="#555" />
            <Text style={styles.detailText}>
              Reported by: {item.reportedBy}
            </Text>
          </View>
        )}
        {item.location && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        )}
        {item.createdAt && (
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{item.createdAt}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.category}>{item.category}</Text>
        <Ionicons name="chevron-forward" size={18} color="#777" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C4C79" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header title="My Tasks" showBack={false} />

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { id: "in-progress", label: "In Progress" },
          { id: "resolved", label: "Resolved" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.activeTabText,
              ]}
            >
              {complaints?.filter((t) => t.status === tab.id).length}{" "}
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks found</Text>
        }
      />
    </SafeAreaView>
  );
};

export default TaskScreen;

// Styles remain the same

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#0C4C79",
    borderColor: "#0C4C79",
  },
  tabText: { fontSize: 15, fontWeight: "600", color: "#333" },
  activeTabText: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 16, fontWeight: "700", flex: 1, color: "#111" },
  statusContainer: { alignItems: "flex-end" },
  statusText: { fontSize: 12, fontWeight: "600", color: "#0A84FF" },
  priority: {
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  description: { color: "#555", fontSize: 13, marginVertical: 6 },
  image: { width: "100%", height: 110, borderRadius: 10, marginVertical: 8 },
  detailsContainer: { marginVertical: 4 },
  detailRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  detailText: { marginLeft: 6, color: "#555", fontSize: 13 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },
  category: { fontSize: 13, color: "#444" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 14,
  },
});
