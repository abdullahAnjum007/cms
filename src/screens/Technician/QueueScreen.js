import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import TaskCard from "./SubComponent/TaskCard";
import { useDispatch, useSelector } from "react-redux";
import { ComplaintService } from "../../services/ComplaintService";
import { setComplaints } from "../../redux/slices/complaintSlice";

const QueueScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState(null);
  const dispatch = useDispatch();
  const complaintsFromRedux = useSelector((state) => state.complaints.data);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await ComplaintService.getAllComplaints();
      dispatch(setComplaints(data));
    } catch (error) {
      console.log("❌ API Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  }, []);

  const handleAcceptTask = async (task) => {
    if (task.status !== "pending") {
      return alert("Only pending tasks can be accepted.");
    }

    try {
      await ComplaintService.updateComplaintStatus(
        task._id,
        "in-progress",
        "Task accepted by technician"
      );
      // Refresh tasks
      fetchComplaints();
    } catch (err) {
      console.log("Error accepting task:", err);
      alert("Unable to accept task.");
    }
  };

  const categories = [
    { id: "all", label: "All", icon: "menu" },
    { id: "IT", label: "IT", icon: "hardware-chip-outline" },
    { id: "Exhibits", label: "Exhibits", icon: "business-outline" },
    { id: "Design", label: "Design", icon: "color-palette-outline" },
  ];

  const priorities = [
    { id: "High", label: "High Priority" },
    { id: "Medium", label: "Medium Priority" },
    { id: "Low", label: "Low Priority" },
  ];

  const filteredTasks = useMemo(() => {
    return complaintsFromRedux.filter((task) => {
      const matchCategory =
        selectedCategory === "all" || task.category === selectedCategory;
      const matchPriority =
        !selectedPriority || task.priority === selectedPriority;
      return matchCategory && matchPriority && task.status === "pending";
    });
  }, [selectedCategory, selectedPriority, complaintsFromRedux]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header title="Task Queue" showBack={false} />

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filter by Category */}
        <Text style={styles.sectionTitle}>Filter by Category</Text>
        <View style={styles.filterRow}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterButton, isActive && styles.activeButton]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isActive ? "#fff" : "#000"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[styles.filterText, isActive && styles.activeText]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filter by Priority */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
          Filter by Priority
        </Text>
        <View style={styles.filterRow}>
          {priorities.map((pri) => {
            const isActive = selectedPriority === pri.id;
            return (
              <TouchableOpacity
                key={pri.id}
                style={[styles.filterButton, isActive && styles.activeOutline]}
                onPress={() => setSelectedPriority(isActive ? null : pri.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeOutlineText,
                  ]}
                >
                  {pri.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Task List */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Showing {filteredTasks.length} of {complaintsFromRedux.length} tasks
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0C4C79"
            style={{ marginVertical: 20 }}
          />
        ) : (
          filteredTasks.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              image={item.photo}
              description={item.description}
              reportedBy={item.createdBy?.name || "Unknown"}
              location={item.location || "Default Location"}
              time={new Date(item.createdAt).toLocaleString()}
              category={item.category}
              buttonLabel="Accept Task"
              onPress={() => handleAcceptTask(item)}
              onImagePress={() => {
                if (item.photo) {
                  navigation.navigate("ImagePreviewScreen", {
                    image: item.photo,
                  });
                }
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QueueScreen;

const styles = StyleSheet.create({
  container: {
    height: "103%",
    backgroundColor: "#fff",
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  activeButton: {
    backgroundColor: "#0C4C79",
    borderColor: "#0C4C79",
  },
  activeText: {
    color: "#fff",
  },
  activeOutline: {
    borderColor: "#0C4C79",
    backgroundColor: "#E7F1F9",
  },
  activeOutlineText: {
    color: "#0C4C79",
    fontWeight: "600",
  },
  filterText: {
    fontSize: 13,
    color: "#000",
  },
});
