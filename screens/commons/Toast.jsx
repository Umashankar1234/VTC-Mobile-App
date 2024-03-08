import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";

export const ShowToast = (type, heading, desc) => {
  return Toast.show({
    type: { type },
    text1: { heading },
    text2: { desc },
    position: "top",
    topOffset: "70",
  });
};
const Toaster = (type, heading, desc) => {
  useEffect(() => {
    Toast.show({
      type: { type },
      text1: { heading },
      text2: { desc },
      position: "top",
      topOffset: "70",
    });
  }, []);

  return;
};

export default Toaster;

const styles = StyleSheet.create({});
