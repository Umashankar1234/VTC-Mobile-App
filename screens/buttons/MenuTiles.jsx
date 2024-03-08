import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { Icon } from "@ui-kitten/components";

const MenuTiles = ({ children, iconName, onPress }) => {
  return (
    <Pressable
      style={styles.buttonLg}
      android_ripple={{ color: "#d6d6d6" }}
      onPress={onPress}
    >
      <Icon name={iconName} fill="#FFA12D" style={styles.largeIcon} />
      <Text category="s1" style={styles.lgbtnText}>
        {children}
      </Text>
    </Pressable>
  );
};

export default MenuTiles;

const styles = StyleSheet.create({
  buttonLg: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 4,
    margin: 10,
    elevation: 10,
    backgroundColor: "#fff",
    height: 100,
    width: 100,
  },
  lgbtnText: {
    textAlign: "center",
    color: "gray",
  },
  largeIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
});
