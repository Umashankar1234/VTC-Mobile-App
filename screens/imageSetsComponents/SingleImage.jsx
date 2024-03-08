import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { Icon, Toggle } from "@ui-kitten/components";

import { ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { Pressable } from "react-native";
import { TextInput } from "react-native";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";
import { Button } from "react-native-paper";
import { PermissionsAndroid } from "react-native";
import { Alert } from "react-native";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;

const SingleImage = ({
  image,
  currentImagesetData,
  setCurrentImagesetData,
  setSync,
  userData,
  tourid,
  sync,
  pageType,
}) => {
  const [downloadProgress, setDownloadProgress] = React.useState();
  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");
  const ensureDirAsync = async (dir, intermediates = true) => {
    const props = await FileSystem.getInfoAsync(dir);
    if (props.exist && props.isDirectory) {
      return props;
    }
    let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates });
    return await ensureDirAsync(dir, intermediates);
  };
  const downloadCallback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };
  const [caption, setCaption] = React.useState(image.caption);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

  const promptDeleteImageSet = async (item) => {
    const objusr = {
      agent_id: userData.agent_id,
      tourId: tourid,
      imageSet: item.imageid ? item.imageid : item.id,
    };
    axiosPost("delete-image-editimageset", objusr)
      .then((res) => {
        setSync(!sync);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Image Deleted Succesfully 👋",
          position: "top",
          topOffset: "70",
        });
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "There was some error 👋",
          position: "top",
          topOffset: "70",
        });
      });
  };

  const download = async (fileUrl) => {
    if (Platform.OS == "android") {
      const dir = ensureDirAsync(downloadPath);
    }
    let fileName = fileUrl.split("tinythumb/")[1];
    //alert(fileName)
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      downloadPath + fileName,
      {},
      downloadCallback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      if (Platform.OS == "android") saveAndroidFile(uri, fileName);
      else saveIosFile(uri);
    } catch (e) {
      console.error("download error:", e);
    }
  };
  const saveAndroidFile = async (fileUri, fileName = "File") => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          "image/jpeg"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Image Downloaded Succesfully 👋",
              position: "top",
              topOffset: "70",
            });
          })
          .catch((e) => {});
      } catch (e) {
        throw new Error(e);
      }
    } catch (err) {}
  };

  const handleImageFlyerChange = (event, id) => {
    const arr = [];
    currentImagesetData.forEach((res) => {
      if (res.imageid === id) {
        if (event === true) {
          res.enableonflyer = 1;
        } else {
          res.enableonflyer = 0;
        }
      }
      arr.push(res);
    });
    setCurrentImagesetData(arr);
    // setActive(!active);
  };
  const handleImageTourChange = (event, id) => {
    const arr = [];
    currentImagesetData.forEach((res) => {
      if (res.id === id) {
        if (event === true) {
          res.enableontour = 1;
        } else {
          res.enableontour = 0;
        }
      }
      arr.push(res);
    });
    setCurrentImagesetData(arr);
    // setActive(!active);
  };
  const handleImageVideoChange = (event, id) => {
    const arr = [];
    currentImagesetData.forEach((res) => {
      if (res.imageid === id) {
        if (event === true) {
          res.enableonvideo = 1;
        } else {
          res.enableonvideo = 0;
        }
      }
      arr.push(res);
    });
    setCurrentImagesetData(arr);
    // setActive(!active);
  };
  console.log(currentImagesetData);
  const handleCaptionChange = (event, data) => {
    const value = event;
    const arr = [];
    currentImagesetData.forEach((res) => {
      if (data.id === res.id) {
        res.caption = value;
        // setCaption(value);
      }
      arr.push(res);
    });
    setCurrentImagesetData(arr);
  };
  const UseImage = useCallback(() => {
    if (pageType == "flyer")
      return (
        <View style={styles.sectionFooterSub}>
          <Text style={styles.sectionFooterHead}>
            Use this Image on Flyer ?
          </Text>
          <Toggle
            style={styles.toggle}
            status="warning"
            onChange={(e) => handleImageFlyerChange(e, image.imageid)}
            checked={image.enableonflyer == 1 ? true : false}
          />
        </View>
      );
    else if (pageType == "videos")
      return (
        <View
          style={{
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.sectionLabels}>Caption</Text>
          <TextInput
            editable
            value={image.caption}
            style={styles.sectionData}
            onChangeText={(e) => handleCaptionChange(e, image)}
          />
          <View style={styles.sectionFooterSub}>
            <Text style={styles.sectionFooterHead}>
              Use this image on Video ?
            </Text>
            <Toggle
              style={styles.toggle}
              status="warning"
              onChange={(e) => handleImageVideoChange(e, image.imageid)}
              checked={image.enableonvideo == 1 ? true : false}
            />
          </View>
        </View>
      );
    else
      return (
        <View
          style={{
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.sectionLabels}>Caption</Text>
          <TextInput
            editable
            value={image.caption}
            style={styles.sectionData}
            onChangeText={(e) => handleCaptionChange(e, image)}
          />
          <View style={styles.sectionFooterSub}>
            <Text style={styles.sectionFooterHead}>
              Use this image on Tour ?
            </Text>
            <Toggle
              style={styles.toggle}
              status="warning"
              onChange={(e) => handleImageTourChange(e, image.id)}
              checked={image.enableontour == 1 ? true : false}
            />
          </View>
        </View>
      );
  }, [pageType]);

  return (
    <>
      <View style={styles.oneSet}>
        <View style={styles.blockHeader}>
          <ImageBackground
            style={styles.imageCover}
            source={{
              uri: image.imageurl,
            }}
          >
            <View style={styles.textHead}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Pressable
                  style={styles.editIcon}
                  onPress={() => download(image.file_url)}
                >
                  <Icon
                    name="download-outline"
                    style={{ width: 20, height: 20 }}
                    fill="#ffffff"
                  />
                </Pressable>
                <Pressable
                  onPress={() => setDeleteModalVisible(!deleteModalVisible)}
                  style={styles.deleteIcon}
                >
                  <Icon
                    name="trash-outline"
                    style={{ width: 20, height: 20 }}
                    fill="#ffffff"
                  />
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.infoSection}>
          <UseImage />
        </View>
      </View>
      <Modal
        useNativeDriver={true}
        animationType="slide"
        transparent={true}
        backdropStyle={styles.backdrop}
        visible={deleteModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewSm}>
            <Text category="s1" style={{ margin: 5 }}>
              Are You Sure You Want To Delete This Image ?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Button
                status="primary"
                mode="contained"
                onPress={() => {
                  setDeleteModalVisible(!deleteModalVisible);
                }}
                style={{ marginRight: 10 }}
              >
                Cancel
              </Button>
              <Button
                status="basic"
                mode="contained"
                buttonColor="red"
                onPress={() => {
                  promptDeleteImageSet(image);
                  setDeleteModalVisible(!deleteModalVisible);
                }}
              >
                Delete
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SingleImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlayBg: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.8)",
    position: "absolute",
    top: 0,
    left: 0,
  },
  floatingButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 70,
    borderRadius: 5,
  },
  counterCards: {
    flexDirection: "row",
    width: "100%",
  },
  countCard: {
    width: Dimensions.get("window").width / 2 - 20,
    margin: 10,
    justifyContent: "center",
  },
  countText: {
    textAlign: "center",
  },
  recentList: {
    flexDirection: "column",
    width: "100%",
    height: 500,
    padding: 10,
  },
  listCard: {
    width: Dimensions.get("window").width - 20,
    marginBottom: 5,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
  },
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
  },
  tabButton: {
    width: 32,
    height: 32,
  },
  actionButton: {
    width: 25,
    height: 25,
  },
  buttonWrap: { marginHorizontal: 5 },
  buttonWrapInset: {
    margin: 5,
  },
  editIcon: {
    marginHorizontal: 5,
    backgroundColor: "#0c722b",
    padding: 5,
    borderRadius: 50,
    color: "white",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    marginHorizontal: 5,
    backgroundColor: "#c50707",
    padding: 5,
    borderRadius: 50,
    color: "white",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    width: Dimensions.get("window").width - 20,
    flexWrap: "wrap",
  },
  modalViewSm: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    width: Dimensions.get("window").width - 20,
    flexWrap: "wrap",
  },
  modalHeading: {
    width: "100%",
    marginBottom: 20,
    marginLeft: 10,
    fontSize: 20,
    color: "#adadad",
  },
  modalText: {
    marginTop: 10,
    textAlign: "center",
    color: "#555555",
    fontSize: 16,
  },
  modalPressable: {
    width: "46%",
    height: 100,
    marginHorizontal: "2%",
    marginVertical: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "rgba(0,0,0,0.8)",
    elevation: 10,
  },
  modalIcon: {
    width: 50,
    height: 50,
  },
  closeIcon: {
    width: 40,
    height: 40,
  },
  modalPressableClose: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  oneSet: {
    padding: 0,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 10,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoSection: {
    paddingBottom: 10,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
  },
  sectionLabels: {
    color: "#adadad",
    fontSize: 14,
    marginTop: 15,
  },
  sectionLabelsAlt: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionData: {
    backgroundColor: "#ffffff79",
    width: "100%",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#b4b2b2",
  },

  sectionFooterSub: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionFooterHead: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
    flex: 1,
  },
  toggle: {
    marginTop: 10,
    flex: 1,
  },
  imageCover: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  textHead: {
    padding: 10,
    justifyContent: "flex-end",
    flexDirection: "row",
    width: "100%",
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  socialIconsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    position: "absolute",
    bottom: "45%",
    right: "45%",
    fontWeight: "bold",
  },
  overlayView: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.349)",
  },
});
