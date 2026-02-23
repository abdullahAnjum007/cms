import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../services/apiHelper";

const AUAScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        // `https://cms-backend-lake-theta.vercel.app/api/auth/users`
        `${BASE_URL}/auth/users`
      );
      const data = await res.json();

      setUsers(data);
    } catch (error) {
      console.log("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>

      <View style={styles.badge}>
        <Text style={styles.role}>{item.role}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#720C4C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Admin Portal"
        showBack
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default AUAScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },

  badge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  role: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
    textTransform: "capitalize",
  },
});
