import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import AdminNavigator from "./AdminNavigator";
import ComplainerNavigator from "./ComplainerNavigator";
import TechnicianNavigator from "./TechnicianNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("AuthNavigator");

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const role = await AsyncStorage.getItem("role");

        console.log("AppNavigator logs token:", token);
        console.log("AppNavigator logs role:", role);

        if (token && role) {
          const lowerRole = role.toLowerCase();
          switch (lowerRole) {
            case "admin":
              setInitialRoute("AdminNavigator");
              break;
            case "complainer":
              setInitialRoute("ComplainerNavigator");
              break;
            case "technician":
              setInitialRoute("TechnicianNavigator");
              break;
            default:
              setInitialRoute("AuthNavigator");
          }
        } else {
          setInitialRoute("AuthNavigator");
        }
      } catch (err) {
        console.log("Error checking login:", err);
        setInitialRoute("AuthNavigator");
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          {/* Auth flow */}
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />

          {/* Role-based navigators */}
          <Stack.Screen name="AdminNavigator" component={AdminNavigator} />
          <Stack.Screen
            name="ComplainerNavigator"
            component={ComplainerNavigator}
          />
          <Stack.Screen
            name="TechnicianNavigator"
            component={TechnicianNavigator}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
