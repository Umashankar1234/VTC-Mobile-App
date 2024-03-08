import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import { Pressable } from "react-native";

const downloadFile = () => {
  FileSystem.downloadAsync(
    "http://techslides.com/demos/sample-videos/small.mp4",
    FileSystem.documentDirectory + "small.mp4"
  )
    .then(({ uri }) => {
      saveFile(uri);
    })
    .catch((error) => {
      console.error(error);
    });
};

const saveFile = async (fileUri) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);
  }
};
const DownloadImages = () => {
  return (
    <View style={styles.centeredView}>
      <Pressable onPress={() => downloadFile()}>
        <Text>loadImages</Text>
      </Pressable>
    </View>
  );
};

export default DownloadImages;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
