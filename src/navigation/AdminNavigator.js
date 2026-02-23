import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import DashboardScreen from "../screens/Admin/AdminDashboardScreen";
import AllComplaintsScreen from "../screens/Admin/AllComplaintsScreen";
import AnalyticsScreen from "../screens/Admin/AnalyticsScreen";
import ReportsScreen from "../screens/Admin/ReportsScreen";
import ProfileScreen from "../screens/Common/ProfileScreen";
import DetailedComplain from "../screens/Admin/DetailedCoimplain";
import SignupScreen from "../screens/Auth/SignupScreen";
import AUAScreen from "../screens/Admin/AUAScreen";
import ImagePreviewScreen from "../components/ImagePreviewScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* -------------------- BOTTOM TABS -------------------- */

function AdminTabNavigator({ role }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          let icon = "ellipse-outline";

          if (route.name === "Dashboard") icon = "speedometer-outline";
          if (route.name === "Issues") icon = "list-outline";
          if (route.name === "Analytics") icon = "bar-chart-outline";
          if (route.name === "Reports") icon = "document-text-outline";

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      {/* ✅ Always Visible */}
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Issues" component={AllComplaintsScreen} />

      {/* ✅ Admin ONLY */}
      {role === "admin" && (
        <>
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
          <Tab.Screen name="Reports" component={ReportsScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

/* -------------------- STACK NAVIGATOR -------------------- */

export default function AdminNavigator() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadRole = async () => {
      const storedRole = await AsyncStorage.getItem("role");
      setRole(storedRole); // admin | floormanager
    };

    loadRole();
  }, []);

  // ⏳ Prevent rendering until role is loaded
  if (!role) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs">
        {() => <AdminTabNavigator role={role} />}
      </Stack.Screen>

      {/* Shared Screens */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="TaskDetailScreen" component={DetailedComplain} />
      <Stack.Screen name="SignUpScreen" component={SignupScreen} />
      <Stack.Screen name="AUAScreen" component={AUAScreen} />
      <Stack.Screen name="ImagePreviewScreen" component={ImagePreviewScreen} />
    </Stack.Navigator>
  );
}
