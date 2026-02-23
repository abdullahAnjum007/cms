import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import ProfileScreen from "../screens/Common/ProfileScreen";
import DashboardScreen from "../screens/User/DashboardScreen";
import ReportsScreen from "../screens/User/ReportsScreen";
import ComplaintDetailScreen from "../screens/User/ComplaintDetailScreen";
import ComplaintFormScreen from "../screens/User/ComplaintFormScreen";
import ImagePreviewScreen from "../components/ImagePreviewScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ---------------------------
//   BOTTOM TABS
// ---------------------------
function ComplainerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === "Dashboard") icon = "home-outline";
          else if (route.name === "Reports") icon = "document-text-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

// ---------------------------
//     STACK WRAPPER
// ---------------------------
export default function ComplainerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ComplainerTabs" component={ComplainerTabNavigator} />

      {/* Add all extra screens here */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="ComplaintDetailScreen"
        component={ComplaintDetailScreen}
      />
      <Stack.Screen
        name="ComplaintFormScreen"
        component={ComplaintFormScreen}
      />
      <Stack.Screen
        name="ImagePreviewScreen"
        component={ImagePreviewScreen}
        // options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
