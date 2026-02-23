import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";

const ComplaintDetailScreen = ({ route }) => {
  const { complaint } = route.params;
  const navigation = useNavigation();

  // 🔒 FORCE LIGHT MODE COLORS
  const bgColor = "#F5F5F7";
  const cardBg = "#FFFFFF";
  const textColor = "#000000";
  const subText = "#444";
  const borderColor = "#EEE";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      {/* STATUS BAR — ALWAYS LIGHT MODE */}

      <Header
        title="Complain Detail"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 14 }}
      >
        {/* ---------- ISSUE INFO CARD ---------- */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Issue Information
          </Text>

          <View style={styles.row}>
            <View
              style={[styles.infoBox, { backgroundColor: cardBg, borderColor }]}
            >
              <Text style={styles.issueNumber}>
                #{complaint._id.slice(-6).toUpperCase()}
              </Text>
              <Text style={[styles.infoLabel, { color: subText }]}>
                Issue ID
              </Text>
            </View>

            <View
              style={[styles.infoBox, { backgroundColor: cardBg, borderColor }]}
            >
              <View style={styles.statusDot(complaint.status)} />
              <Text style={[styles.infoLabel, { color: subText }]}>
                {complaint.status}
              </Text>
            </View>
          </View>
        </View>

        {/* ---------- MAIN DETAILS CARD ---------- */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>
            {complaint.title}
          </Text>

          <DetailRow
            icon="location-outline"
            text={complaint.location}
            color={subText}
          />

          <DetailRow
            icon="pricetag-outline"
            text={`${complaint.category} • ${complaint.priority}`}
            color={subText}
          />

          <DetailRow
            icon="person-outline"
            text={`Reported by: ${complaint.createdBy?.name}`}
            color={subText}
          />

          {complaint.assignedTo && (
            <DetailRow
              icon="person-circle-outline"
              text={`Assigned to: ${complaint.assignedTo}`}
              color={subText}
            />
          )}

          <DetailRow
            icon="calendar-outline"
            text={`Reported on: ${moment(complaint.createdAt).format(
              "MMM DD, hh:mm A",
            )}`}
            color={subText}
          />
        </View>

        {/* ---------- IMAGE ---------- */}
        {complaint.photo && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate("ImagePreviewScreen", {
                image: complaint.photo,
              })
            }
          >
            <Image source={{ uri: complaint.photo }} style={styles.mainImage} />
          </TouchableOpacity>
        )}
        {/* ---------- RESOLVED IMAGE ---------- */}
        {complaint.status === "resolved" && complaint.resolvedPhoto && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Resolved Proof Photo
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("ImagePreviewScreen", {
                  image: complaint.resolvedPhoto,
                })
              }
            >
              <Image
                source={{ uri: complaint.resolvedPhoto }}
                style={styles.mainImage}
              />
            </TouchableOpacity>
            {complaint.resolvedBy && (
              <DetailRow
                icon="checkmark-circle-outline"
                text={`Resolved by: ${complaint.history?.find((h) => h.status === "resolved")?.updatedBy?.name || "Technician"}`}
                color={subText}
              />
            )}
          </View>
        )}

        {/* ---------- DESCRIPTION ---------- */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: subText }]}>
            {complaint.description}
          </Text>
        </View>

        {/* ---------- TIMELINE ---------- */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Timeline
          </Text>

          {complaint.history?.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineDot(getStatusColor(item.status))} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.timelineTitle, { color: textColor }]}>
                  {item.status.toUpperCase()}
                </Text>

                {item.message && (
                  <Text style={{ color: subText }}>{item.message}</Text>
                )}

                <Text style={styles.timelineTime}>
                  {moment(item.createdAt).format("MMM DD, hh:mm A")}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComplaintDetailScreen;

/* ---------- SMALL HELPER COMPONENT ---------- */
const DetailRow = ({ icon, text, color }) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={18} color={color} />
    <Text style={[styles.detailText, { color }]}>{text}</Text>
  </View>
);

/* ---------- STATUS COLOR ---------- */
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#FF4B4B";
    case "in-progress":
      return "#E0A300";
    case "resolved":
      return "#4CAF50";
    default:
      return "#007AFF";
  }
};

/* ------------------------- STYLES ------------------------- */

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  infoBox: {
    flex: 1,
    paddingVertical: 18,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },

  issueNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003E80",
  },

  infoLabel: {
    marginTop: 5,
    fontSize: 14,
  },

  statusDot: (status) => ({
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: getStatusColor(status),
  }),

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  detailText: {
    marginLeft: 6,
    fontSize: 15,
  },

  mainImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 15,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
  },

  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  timelineDot: (color) => ({
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color,
  }),

  timelineTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  timelineTime: {
    fontSize: 13,
    color: "#888",
  },
});
