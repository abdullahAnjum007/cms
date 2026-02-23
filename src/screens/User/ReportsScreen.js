import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { ComplaintService } from "../../services/ComplaintService";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const ReportsScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [selectedTab, setSelectedTab] = useState("All");
  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await ComplaintService.getComplaintOfMy();
      setComplaints(data || []);
    } catch (error) {
      console.log("❌ API Fetch Error:", error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };

  const normalizeStatus = (status = "") => status.toLowerCase();

  const tabs = [
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
        (c) => normalizeStatus(c.status) === "in-progress"
      ).length,
    },
    {
      key: "resolved",
      label: "Resolved",
      count: complaints.filter((c) => normalizeStatus(c.status) === "resolved")
        .length,
    },
  ];

  const filtered =
    selectedTab === "All"
      ? complaints
      : complaints.filter(
          (item) => normalizeStatus(item.status) === selectedTab
        );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#F5F5F7" }]}
      edges={["top", "bottom"]}
    >
     

      <Header title="Complainer Portal" showBack={false} />

      {/* TABS */}
      <View style={[styles.tabsContainer, { backgroundColor: "#fff" }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedTab === tab.key ? "#fff" : "#444",
                },
              ]}
            >
              {tab.label}
            </Text>
            <Text
              style={[
                styles.tabText,
                {
                  color: selectedTab === tab.key ? "#fff" : "#444",
                },
              ]}
            >
              ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#000"}
          />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => (
          <ComplaintCard item={item} navigation={navigation} isDark={isDark} />
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 60,
              color: "#666",
            }}
          >
            No complaints found.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

/* ---------------- CARD ---------------- */

const ComplaintCard = ({ item, navigation, isDark }) => {
  const statusColors = {
    pending: "#EF4444",
    "in-progress": "#F59E0B",
    resolved: "#22C55E",
  };

  const statusKey = item.status?.toLowerCase();

  return (
    <View style={[styles.card, { backgroundColor: "#fff" }]}>
      <View style={styles.row}>
        <Text style={[styles.cardTitle, { color: "#151515" }]}>
          {item.title}
        </Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: `${statusColors[statusKey]}20`,
              borderColor: statusColors[statusKey],
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: statusColors[statusKey] }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Ionicons name="pricetag-outline" size={15} color={"#555"} />
        <Text style={[styles.infoText, { color: "#555" }]}>
          Category: {item.category} • {item.priority}
        </Text>
      </View>

      <Text style={[styles.desc, { color: "#444" }]}>{item.description}</Text>

      <Text style={styles.dateText}>
        Reported {moment(item.createdAt).format("MMM DD, hh:mm A")}
      </Text>

      <View style={[styles.separator, { backgroundColor: "#E6E6E6" }]} />

      <TouchableOpacity
        style={styles.footerRow}
        onPress={() =>
          navigation.navigate("ComplaintDetailScreen", { complaint: item })
        }
      >
        <View style={styles.row}>
          <Ionicons name="refresh-outline" size={16} color={"#555"} />
          <Text style={[styles.updateText, { color: "#555" }]}>
            View Details
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={"#555"} />
      </TouchableOpacity>
    </View>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  tabsContainer: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 10,
    margin: 12,
    justifyContent: "space-between",
    elevation: 2,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: "#003E80",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },

  card: {
    padding: 16,
    borderRadius: 15,
    marginHorizontal: 12,
    marginBottom: 15,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoText: {
    marginLeft: 6,
    fontSize: 14,
  },

  desc: {
    fontSize: 14,
    marginVertical: 10,
  },

  dateText: {
    fontSize: 12,
    color: "#888",
  },

  separator: {
    height: 1,
    marginVertical: 10,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  updateText: {
    marginLeft: 6,
    fontSize: 14,
  },
});

export default ReportsScreen;
