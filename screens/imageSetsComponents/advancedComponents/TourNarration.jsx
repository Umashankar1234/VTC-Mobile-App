import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "react-native-paper";

const TourNarration = () => {
  pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type:"*/*",
    });

    alert(result.uri);

  };
  return (
    <View>
      <Button onPress={pickDocument}>TourNarration</Button>
    </View>
  );
};

export default TourNarration;

const styles = StyleSheet.create({});
