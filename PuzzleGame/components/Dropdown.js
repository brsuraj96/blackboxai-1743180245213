import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Install this package if not already installed

const DropdownMenu = ({ selectedValue, onValueChange, items }) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => onValueChange(value)}
        style={styles.picker}
      >
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150, // Adjust the width as needed
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
  },
  picker: {
    width: "100%",
    height: 40,
    color: "black",
  },
});

export default DropdownMenu;
