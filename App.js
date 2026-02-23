// import React, { useEffect } from "react";
// import { Provider } from "react-redux";
// import { Alert, Platform } from "react-native";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import Constants from "expo-constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import store from "./src/redux/store";
// import AppNavigator from "./src/navigation/AppNavigator";

// // Notification behavior
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// async function registerForPushNotifications() {
//   try {
//     if (!Device.isDevice) {
//       Alert.alert("Push notifications require a physical device");
//       return;
//     }

//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();

//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } =
//         await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       console.log("Notification permission denied");
//       return;
//     }

//     const token = (
//       await Notifications.getExpoPushTokenAsync({
//          projectId: "77ead665-ac4a-4996-9b24-948798e60ed4",
//       })
//     ).data;

//     console.log("Expo Push Token:", token);

//     // Save locally for later (login)
//     await AsyncStorage.setItem("expoPushToken", token);

//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//       });
//     }
//   } catch (err) {
//     console.error("Push registration error:", err);
//   }
// }

// export default function App() {
//   useEffect(() => {
//     registerForPushNotifications();

//     const notificationListener =
//       Notifications.addNotificationReceivedListener(notification => {
//         console.log("Notification received:", notification);
//       });

//     const responseListener =
//       Notifications.addNotificationResponseReceivedListener(response => {
//         console.log("Notification clicked:", response);
//       });

//     return () => {
//       notificationListener.remove();
//       responseListener.remove();
//     };
//   }, []);

//   return (
//     <Provider store={store}>
//       <AppNavigator />
//     </Provider>
//   );
// }

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Alert, Platform, useColorScheme } from "react-native";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import store from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";

/* ---------------- Notification Behavior ---------------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* ---------------- Register Push Notifications ---------------- */
async function registerForPushNotifications() {
  try {
    if (!Device.isDevice) {
      Alert.alert("Physical device required for push notifications");
      return;
    }

    // ✅ Android channel MUST be before token
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    // Permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("❌ Notification permission denied");
      return;
    }

    // ✅ SAFE projectId
    const projectId =
      Constants.easConfig?.projectId ??
      Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.log("❌ Missing EAS projectId");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;

    console.log("✅ Expo Push Token:", token);

    // Store for backend usage
    await AsyncStorage.setItem("expoPushToken", token);
  } catch (error) {
    console.error("❌ Push registration error:", error);
  }
}

/* ---------------- App ---------------- */
export default function App() {
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    registerForPushNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📩 Notification received:", notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👉 Notification clicked:", response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      {/* <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} /> */}
      <StatusBar barStyle={ 'dark-content'} />
      <AppNavigator />
    </Provider>
  )
}
