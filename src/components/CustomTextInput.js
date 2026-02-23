import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomTextInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  style,
  textColor = "#000", // Force text color
  placeholderColor = "#888", // Force placeholder color
  backgroundColor = "#fff", // Optional background color
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const isPasswordField = secureTextEntry;

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPasswordField && !isPasswordVisible}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isPasswordField && (
        <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={22}
            color={placeholderColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  icon: {
    paddingHorizontal: 8,
  },
});

export default CustomTextInput;
