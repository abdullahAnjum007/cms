import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";

// Screens
import DashboardScreen from "../screens/Technician/TechnicianDashboardScreen";
import TaskScreen from "../screens/Technician/TaskScreen";
import QueueScreen from "../screens/Technician/QueueScreen";
import ProfileScreen from "../screens/Common/ProfileScreen";
import TaskDetailScreen from "../screens/Technician/TaskDetailScreen";
import ImagePreviewScreen from "../components/ImagePreviewScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TechnicianTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0C4C79",
        tabBarInactiveTintColor: "#000000",

        tabBarShowLabel: true,
        tabBarIcon: ({ color }) => {
          let iconSource;

          if (route.name === "Dashboard") {
            iconSource = require("../../assets/Technichian/dashboard.png");
          } else if (route.name === "Task") {
            iconSource = require("../../assets/Technichian/Task.png");
          } else if (route.name === "Queue") {
            iconSource = require("../../assets/Technichian/Queue.png");
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 26,
                height: 26,
                resizeMode: "contain",
                tintColor: color, // ✅ Active/inactive tint
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Task" component={TaskScreen} />
      <Tab.Screen name="Queue" component={QueueScreen} />
    </Tab.Navigator>
  );
}

// ✅ Wrap Tabs inside a Stack for extra screens like Profile
export default function TechnicianNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Bottom Tabs */}
      <Stack.Screen name="TechnicianTabs" component={TechnicianTabNavigator} />

      {/* Profile screen navigated from Header */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
      <Stack.Screen
        name="ImagePreviewScreen"
        component={ImagePreviewScreen}
        // options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
