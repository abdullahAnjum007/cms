import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // icon pack
import DashboardScreen from "../screens/User/DashboardScreen";
import ComplaintListScreen from "../screens/User/ComplaintListScreen";
import ProfileScreen from "../screens/Common/ProfileScreen";
import ImagePreviewScreen from "../components/ImagePreviewScreen";

const Tab = createBottomTabNavigator();

export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") iconName = "home-outline";
          else if (route.name === "Complaints") iconName = "list-outline";
          else if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Complaints" component={ComplaintListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="ImagePreviewScreen"
        component={ImagePreviewScreen}
        // options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
