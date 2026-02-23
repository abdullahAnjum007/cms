import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

const CustomPickerInput = ({ value, onValueChange, items = [], style }) => {
  return (
    <View style={[styles.container, style]}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#888"
        mode="dropdown"
      >
        <Picker.Item label="Select Role" value="" color="#999"/>
        {items.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
            color="#000"

          />
        ))}
      </Picker>
    </View>
  );
};

export default CustomPickerInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: "center",
    height: 52, // 🔥 IMPORTANT
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "android" ? 52 : 48,
    width: "100%",
    marginTop: Platform.OS === "android" ? -4 : 0, // 🔥 KEY FIX
    // backgroundColor
  },
});
