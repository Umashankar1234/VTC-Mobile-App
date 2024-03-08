import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { BackHandler } from "react-native";

export const BackHandlerHelper = (url, params) => {
  const navigation = useNavigation();
  function handleBackButtonClick() {
    navigation.navigate(url, params);
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);
};
