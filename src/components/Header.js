import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({
  title = "",
  showBack = false,
  onBackPress,
  showProfile = true,
  showNotification = true,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      {/* 🔹 Left section (Back or Logo) */}
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>
        ) : (
          <Image
            source={require("../../assets/imageTH.png")}
            style={styles.logo}
          />
        )}

        <Text style={styles.title}>{title}</Text>
      </View>

      {/* 🔹 Right section (icons) */}
      <View style={styles.iconRow}>
        {showProfile && (
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        )}
        {/* {showNotification && (
          <Ionicons name="notifications-outline" size={26} color="#333" />
        )} */}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fff",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 20,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  icon: {
    marginRight: 12,
  },
});
//abdullah
// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const Header = ({
//   title = "",
//   showBack = false,
//   onBackPress,
//   showProfile = true,
//   showNotification = true,
//   showToken = true, // 👈 optional prop
// }) => {
//   const navigation = useNavigation();
//   const [expoToken, setExpoToken] = useState(null);
//   const [expanded, setExpanded] = useState(false);

//   useEffect(() => {
//     const loadToken = async () => {
//       const token = await AsyncStorage.getItem("expoPushToken");
//       setExpoToken(token);
//     };
//     loadToken();
//   }, []);

//   return (
//     <View>
//       {/* ================= HEADER ================= */}
//       <View style={styles.header}>
//         {/* Left */}
//         <View style={styles.leftSection}>
//           {showBack ? (
//             <TouchableOpacity onPress={onBackPress}>
//               <Ionicons name="arrow-back" size={26} color="#333" />
//             </TouchableOpacity>
//           ) : (
//             <Image
//               source={require("../../assets/imageTH.png")}
//               style={styles.logo}
//             />
//           )}

//           <Text style={styles.title}>{title}</Text>
//         </View>

//         {/* Right */}
//         <View style={styles.iconRow}>
//           {showProfile && (
//             <TouchableOpacity
//               onPress={() => navigation.navigate("ProfileScreen")}
//             >
//               <Ionicons name="person-circle-outline" size={28} color="#333" />
//             </TouchableOpacity>
//           )}
//           {showNotification && (
//             <Ionicons name="notifications-outline" size={26} color="#333" />
//           )}
//         </View>
//       </View>

//       {/* ================= TOKEN BAR ================= */}
//       {showToken && expoToken && (
//         <View style={styles.tokenContainer}>
//           <Text
//             numberOfLines={expanded ? undefined : 1}
//             style={styles.tokenText}
//             selectable
//           >
//             🔔 Expo Push Token: {expoToken}
//           </Text>

//           <TouchableOpacity onPress={() => setExpanded(!expanded)}>
//             <Text style={styles.readMore}>
//               {expanded ? "Show less ▲" : "Read more ▼"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default Header;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingTop: 8,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#eaeaea",
//     backgroundColor: "#fff",
//   },
//   leftSection: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logo: {
//     width: 36,
//     height: 36,
//     resizeMode: "contain",
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#222",
//   },
//   iconRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   /* 🔽 TOKEN BAR */
//   tokenContainer: {
//     backgroundColor: "#f5f7fa",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   tokenText: {
//     fontSize: 12,
//     color: "#333",
//   },
//   readMore: {
//     fontSize: 12,
//     color: "#007aff",
//     marginTop: 4,
//   },
// });
//abdullah