import { Modal, StyleSheet, Switch, Text, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthorization } from "./context/AuthProvider";
import { APIURL, axiosPost } from "./commons/Save";
import { getUser } from "./context/async-storage";
import { StatusBar } from "react-native";
import { ScrollView } from "react-native";

import { Dimensions } from "react-native";
import { FlatList } from "react-native";
import SingleImage from "./imageSetsComponents/SingleImage";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Button } from "react-native-paper";
import EditImageSetModal from "./imageSetsComponents/ImageSetComponent/EditImageSetModal";
import MenuTiles from "./buttons/MenuTiles";
import { Linking } from "react-native";
import Video from "react-native-video";
import { Pressable } from "react-native";
import { Icon } from "@ui-kitten/components";
import * as FileSystem from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";
const { StorageAccessFramework } = FileSystem;

const EditImageSet = ({ route, navigation }) => {
  const isFocused = useIsFocused();

  const { tourid, pageType } = route.params;

  const [previewVideoVisible, setPreviewVideoVisible] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState();

  const [menuModalVisible, setMenuModalVisible] = React.useState(false);
  const [menuSelectionType, setMenuSelectionType] = React.useState("");
  const [sync, setSync] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openImagePicker, setOpenImagePicker] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentImagesetData, setCurrentImagesetData] = useState({});
  const [currentImagesetServices, setCurrentImagesetServices] = useState({});
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [isEnabled, setIsEnabled] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const fetchUser = React.useCallback(async () => {
    if (status === "signOut") {
    } else {
      var myInfo = await getUser();
      setUserData(myInfo);
    }
  }, [status]);
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const url = "change-tour-service";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = { agentId: userData.agent_id, tourid: tourid };
      const result = await axiosPost("get-videoList", data);
      setLoading(false);
      if (result.data[0].response.status === "success") {
        setCurrentImagesetData(result.data[0].response.dataProvider);
      }
    };
    if (pageType == "videos" && userData.agent_id) fetchData();
  }, [pageType, userData.agent_id, isFocused, sync]);
  useEffect(() => {
    if (tourid && Object.entries(userData).length > 0) {
      setLoading(true);
      const objusr = {
        agentId: userData.agent_id,
        tourid: tourid,
      };
      axiosPost("tour-list", objusr)
        .then((res) => {
          setLoading(false);
          if (res.data[0].response.status === "success") {
            console.log(res.data[0].response);
            if (pageType != "videos")
              setCurrentImagesetData(res.data[0].response.dataDetails.dataProvider);
            setCurrentImagesetServices(
              res.data[0].response.dataDetails.dataProvider
            );
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [tourid, sync, userData, isFocused]);
  const [loading, setLoading] = React.useState(true);
  const pickVideoAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
    });
    // if (type === 'picture') {
    //   var x = pictureFiles;
    //   for (let file of image) {
    //     x.push(file);
    //   }
    //   setPictureFiles(x);
    // }
    // if (type === 'video') {
    //   var x = videoFiles;
    //   for (let file of image) {
    //     x.push(file);
    //   }
    //   setVideoFiles(x);
    // }
    // if (type === 'panorama') {
    //   var x = panoramaFiles;
    //   for (let file of image) {
    //     x.push(file);
    //   }
    //   setPanoramaFiles(x);
    // }
    if (!result.canceled) {
      var x = [];
      result.assets.forEach((element) => {
        x.push(element);
      });
      data = {};
      data.agent_id = userData.agent_id;
      data.tourid = tourid;
      const formdt = new FormData();
      Object.keys(data).forEach((key) => formdt.append(key, data[key]));
      for (let file of x) {
        var fname = file.uri.replace(/^.*[\\\/]/, "");
        var obj = {
          uri: file.uri,
          name: fname,
          type: "video/*",
        };
        formdt.append("video[]", obj);
      }
      formdt.append("authenticate_key", "abcd123XYZ");
      setUploading(true);

      axios({
        method: "post",
        url: APIURL + "add-video-editimageset",
        data: formdt,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setUploading(false);
          setLoading(false);
          if (res.data[0].response) {
            if (res.data[0].response.status === "error") {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: res.data[0].response.message,
                position: "top",
                topOffset: "70",
              });
            } else {
              Toast.show({
                type: "success",
                text1: "Successful",
                text2: res.data[0].response.message,
                position: "top",
                topOffset: "70",
              });
              setSync(!sync);
            }
          }
        })
        .catch((error) => {
          setUploading(false);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: res.data[0].response.message,
            position: "top",
            topOffset: "70",
          });
        });
    } else {
      alert("You did not select any video.");
    }
  };
  const pickImageAsync = async (type) => {
    setUploading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
    });
    setUploading(false);
    if (!result.canceled) {
      if (type === "picture") {
        var x = [];
        result.assets.forEach((element) => {
          x.push(element);
        });
        data = {};
        data.agent_id = userData.agent_id;
        data.tourId = tourid;
        const formdt = new FormData();
        Object.keys(data).forEach((key) => formdt.append(key, data[key]));
        for (let file of x) {
          var fname = file.uri.replace(/^.*[\\\/]/, "");
          var obj = {
            uri: file.uri,
            name: fname,
            type: "image/*",
          };
          formdt.append("imageArr[]", obj);
        }
        formdt.append("authenticate_key", "abcd123XYZ");
        axios({
          method: "post",
          url: APIURL + "save-tour-image",
          data: formdt,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res) => {
            setLoading(false);
            if (res.data[0].response) {
              if (res.data[0].response.status === "error") {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: res.data[0].response.message,
                  position: "top",
                  topOffset: "70",
                });
              } else {
                Toast.show({
                  type: "success",
                  text1: "Successful",
                  text2: res.data[0].response.message,
                  position: "top",
                  topOffset: "70",
                });
                setSync(!sync);
              }
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      }
      if (type === "panorama") {
        var x = panoramaFiles;
        result.assets.forEach((element) => {
          x.push(element);
        });
        setPanoramaFiles(x);
      }
    } else {
      alert("You did not select any image.");
    }
  };
  const openCameraAsync = async (type) => {
    setUploading(true);
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    setUploading(false);

    if (!result.canceled) {
      if (type === "picture") {
        var x = [];
        result.assets.forEach((element) => {
          x.push(element);
        });
        data = {};
        data.agent_id = userData.agent_id;
        data.tourId = tourid;
        const formdt = new FormData();
        Object.keys(data).forEach((key) => formdt.append(key, data[key]));
        for (let file of x) {
          var fname = file.uri.replace(/^.*[\\\/]/, "");
          var obj = {
            uri: file.uri,
            name: fname,
            type: "image/*",
          };
          formdt.append("imageArr[]", obj);
        }
        formdt.append("authenticate_key", "abcd123XYZ");
        axios({
          method: "post",
          url: APIURL + "save-tour-image",
          data: formdt,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res) => {
            setLoading(false);
            if (res.data[0].response) {
              if (res.data[0].response.status === "error") {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: res.data[0].response.message,
                  position: "top",
                  topOffset: "70",
                });
              } else {
                Toast.show({
                  type: "success",
                  text1: "Successful",
                  text2: res.data[0].response.message,
                  position: "top",
                  topOffset: "70",
                });
                setSync(!sync);
              }
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      }
      if (type === "panorama") {
        var x = panoramaFiles;
        result.assets.forEach((element) => {
          x.push(element);
        });
        setPanoramaFiles(x);
      }
    } else {
      alert("You did not select any image.");
    }
  };
  const handleTourChange = (value) => {
    var check = value === true ? 1 : 0;
    setCurrentImagesetServices({
      ...currentImagesetServices,
      virtualtourservice: check,
    });
    const obj = {
      agent_id: userData.agent_id,
      tourid: tourid,
      status: "tour",
      virtualtourservice: check,
    };
    axiosPost(url, obj)
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Successful",
          text2: res.data[0].response.message,
          position: "top",
          topOffset: "70",
        });
      })
      .catch((err) => {
        setSync(!sync);
      });
  };
  const handleFlyerChange = (event) => {
    var check = event === true ? 1 : 0;
    setCurrentImagesetServices({
      ...currentImagesetServices,
      flyerservice: check,
    });
    const obj = {
      agent_id: userData.agent_id,
      tourid: tourid,
      status: "flyer",
      flyerservice: check,
    };
    axiosPost(url, obj)
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Successful",
          text2: res.data[0].response.message,
          position: "top",
          topOffset: "70",
        });
      })
      .catch((err) => {
        setSync(!sync);
      });
  };
  const handleVideoChange = (event) => {
    var check = event === true ? 1 : 0;
    setCurrentImagesetServices({
      ...currentImagesetServices,
      videoservice: check,
    });
    const obj = {
      agent_id: userData.agent_id,
      tourid: tourid,
      status: "video",
      videoservice: check,
    };
    axiosPost(url, obj)
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Successful",
          text2: res.data[0].response.message,
          position: "top",
          topOffset: "70",
        });
      })
      .catch((err) => {
        setSync(!sync);
      });
  };
  const UpdateImageSetList = () => {
    const image_set_list = [];
    const image_set_services = [];
    currentImagesetData.forEach((element) => {
      image_set_list.push(element);
    });
    const imgArr = {
      ...image_set_list,
      ...currentImagesetServices,
    };
    const obj = {
      agent_id: userData.agent_id,
      type: "tour",
      imageArr: { ...imgArr },
      authenticate_key: "abcd123XYZ",
    };
    const url =
      pageType && pageType == "flyer" ? "update-flyer" : "update-tour";
    axiosPost(url, "", "", obj)
      .then((res) => {
        if (res.data[0].response.status === "success") {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: res.data[0].response.message,
            position: "top",
            topOffset: "70",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: res.data[0].response.message,
            position: "top",
            topOffset: "70",
          });
        }
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "There was an error.Please try again later",
          position: "top",
          topOffset: "70",
        });
        setSync(true);
      });
  };
  const viewModal = (modalType) => {
    setMenuSelectionType(modalType);
    setMenuModalVisible(!menuModalVisible);
  };
  const printPdf = async (id) => {
    const url = `https://www.virtualtourcafe.com/agent-flyer-active-print/${id}`; // Replace with the desired URL

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open the URL:", url);
    }
  };
  const downloadPdf = async (id) => {
    const url = `https://www.virtualtourcafe.com/agent-download-flyer/${id}`; // Replace with the desired URL

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open the URL:", url);
    }
  };
  const TourEditIcons = useCallback(() => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.buttonlgWrap}
      >
        <MenuTiles iconName="swap-outline" onPress={() => viewModal("ORD")}>
          Change Order
        </MenuTiles>
        <MenuTiles iconName="eye" onPress={() => viewTour(tourid)}>
          View Tour
        </MenuTiles>
        <MenuTiles
          iconName="paper-plane-outline"
          onPress={() => setOpenImagePicker(true)}
        >
          Add Images
        </MenuTiles>
        <MenuTiles
          iconName="play-circle-outline"
          onPress={() => pickVideoAsync()}
        >
          Add Video
        </MenuTiles>
        <MenuTiles
          iconName="color-palette-outline"
          onPress={() => viewModal("PRT")}
        >
          Property Information
        </MenuTiles>
        <MenuTiles
          iconName="person-done-outline"
          onPress={() => viewModal("AMN")}
        >
          Amenities
        </MenuTiles>
        <MenuTiles
          iconName="person-done-outline"
          onPress={() =>
            navigation.navigate("ServiceLinksScreen", {
              tourid: tourid,
            })
          }
        >
          Service Links
        </MenuTiles>
        <MenuTiles
          iconName="person-done-outline"
          onPress={() =>
            navigation.navigate("OtherLinksScreen", {
              tourid: tourid,
            })
          }
        >
          Other Links
        </MenuTiles>
        <MenuTiles
          iconName="person-done-outline"
          onPress={() =>
            navigation.navigate("TrafficReports", {
              tourid: tourid,
            })
          }
        >
          Traffic Report
        </MenuTiles>
        <MenuTiles
          iconName="person-done-outline"
          onPress={() => viewModal("ADV")}
        >
          Advanced Options
        </MenuTiles>
      </ScrollView>
    );
  }, [tourid]);
  const FlyerEditIcons = useCallback(() => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.buttonlgWrap}
      >
        <MenuTiles
          iconName="paper-plane-outline"
          onPress={() =>
            navigation.navigate("Imagesets", {
              tourid: tourid,
            })
          }
        >
          Go to related ImageSet
        </MenuTiles>
        <MenuTiles
          iconName="play-circle-outline"
          onPress={() =>
            navigation.navigate("SendFlyer", {
              tourid: tourid,
            })
          }
        >
          Send to a friend
        </MenuTiles>
        <MenuTiles
          iconName="color-palette-outline"
          onPress={() =>
            navigation.navigate("FlyerThemes", {
              tourid: tourid,
            })
          }
        >
          Themes
        </MenuTiles>
        <MenuTiles
          iconName="color-palette-outline"
          onPress={() => viewModal("PRT")}
        >
          Property Information
        </MenuTiles>
        <MenuTiles
          iconName="clipboard-outline"
          onPress={() =>
            navigation.navigate("PostToCraigslist", {
              tourid: tourid,
            })
          }
        >
          Post to Craigslist
        </MenuTiles>
        <MenuTiles
          iconName="download-outline"
          onPress={() => downloadPdf(tourid)}
        >
          Download PDF
        </MenuTiles>
        <MenuTiles iconName="printer-outline" onPress={() => printPdf(tourid)}>
          Print PDF
        </MenuTiles>
      </ScrollView>
    );
  }, [tourid]);
  const VideosEditIcons = useCallback(() => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.buttonlgWrap}
      >
        <MenuTiles
          iconName="paper-plane-outline"
          onPress={() =>
            navigation.navigate("Imagesets", {
              tourid: tourid,
            })
          }
        >
          Go to related Tour
        </MenuTiles>
        <MenuTiles
          iconName="play-circle-outline"
          onPress={() =>
            navigation.navigate("VideoPromotion", {
              tourid: tourid,
            })
          }
        >
          Distribute Video
        </MenuTiles>
        <MenuTiles
          iconName="play-circle-outline"
          onPress={() =>
            navigation.navigate("VideoPromotion", {
              tourid: tourid,
            })
          }
        >
          Video Promotion
        </MenuTiles>
        <MenuTiles iconName="color-palette-outline" onPress={openPreviewModal}>
          Preview Video Frame
        </MenuTiles>
        {/* <MenuTiles
          iconName="color-palette-outline"
          onPress={() => viewModal("PRT")}
        >
          Preview Image Frame
        </MenuTiles> */}
        <MenuTiles iconName="clipboard-outline" onPress={downloadVideo}>
          Download Video
        </MenuTiles>
      </ScrollView>
    );
  }, [tourid]);
  const EditIcons = useCallback(() => {
    if (pageType == "videos") return VideosEditIcons();
    else if (pageType == "flyer") return FlyerEditIcons();
    else return TourEditIcons();
  });
  const closeVideoModal = () => {
    setVideoUrl();
    setPreviewVideoVisible(false);
  };
  const openPreviewModal = async () => {
    const data = { agentId: userData.agent_id, tourId: tourid };
    const result = await axiosPost("preview-video", data);
    if (result.data[0].response.status == "success")
      setVideoUrl(result.data[0].response.data.filePath);
    setPreviewVideoVisible(true);
  };
  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");
  const downloadVideo = async () => {
    const data = { agentId: userData.agent_id, tourId: tourid };
    const result = await axiosPost("preview-video", data);
    if (result.data[0].response.status == "success") {
      var url = result.data[0].response.data.filePath;
      download(url);
    }
  };
  const downloadCallback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };
  const ensureDirAsync = async (dir, intermediates = true) => {
    const props = await FileSystem.getInfoAsync(dir);
    if (props.exist && props.isDirectory) {
      return props;
    }
    let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates });
    return await ensureDirAsync(dir, intermediates);
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
          "video/mp4"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Video Downloaded Succesfully 👋",
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
  const viewTour = async (id) => {
    if (pageType == "videos")
      var url = `https://www.virtualtourcafe.com/admin-as-agent-mobile/${userData.agent_id}/${id}`;
    else var url = `https://www.virtualtourcafe.com/tour/${id}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open the URL:", url);
    }
  };
  return (
    <>
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <View style={styles.actions}>
        <EditIcons />
      </View>
      {uploading && (
        <View style={[styles.serviceHeader, styles.loader]}>
          <View>
            <Text style={styles.loaderText}>Uploading..Please Wait</Text>
          </View>
          <View>
            <ActivityIndicator size="large" color="#FFA12D" />
          </View>
        </View>
      )}

      <View style={styles.serviceHeader}>
        <Text style={styles.serviceTitle}>
          Edit{" "}
          {pageType && pageType == "flyer"
            ? "Flyer"
            : pageType == "videos"
            ? "Video"
            : "Tour"}
        </Text>
        <Button
          mode="contained-tonal"
          buttonColor="orange"
          onPress={UpdateImageSetList}
        >
          Save
        </Button>
      </View>

      <View style={styles.services}>
        <View style={styles.btnContainer}>
          <Text style={styles.toggleTitle}>Tour Service</Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(e) => handleTourChange(e)}
            value={
              currentImagesetServices.virtualtourservice == 1 ? true : false
            }
          />
        </View>
        <View style={styles.btnContainer}>
          <Text style={styles.toggleTitle}>Flyer Service</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(e) => handleFlyerChange(e)}
            value={currentImagesetServices.flyerservice == 1 ? true : false}
          />
        </View>
        <View style={styles.btnContainer}>
          <Text style={styles.toggleTitle}>Video Service</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(e) => handleVideoChange(e)}
            value={currentImagesetServices.videoservice == 1 ? true : false}
          />
        </View>
      </View>
      {currentImagesetData &&
      currentImagesetData &&
      currentImagesetData.length > 0 ? (
        <FlatList
          data={currentImagesetData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <>
                <SingleImage
                  pageType={pageType}
                  image={item}
                  setSync={setSync}
                  sync={sync}
                  currentImagesetData={currentImagesetData}
                  userData={userData}
                  tourid={tourid}
                  setCurrentImagesetData={setCurrentImagesetData}
                />
              </>
            );
          }}
        />
      ) : !loading ? (
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: Dimensions.get("window").height - 200,
          }}
        >
          <Text>No data found</Text>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("window").height - 200,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <ActivityIndicator size="large" color="#FFA12D" />
        </View>
      )}
      <EditImageSetModal
        navigation={navigation}
        menuModalVisible={menuModalVisible}
        menuSelectionType={menuSelectionType}
        setMenuModalVisible={setMenuModalVisible}
        // setSelectedIndex={setSelectedIndex}
        setMenuSelectionType={setMenuSelectionType}
        // duplicateImageset={duplicateImageset}
        imagesetId={tourid}
        images={currentImagesetData}
        setImages={setCurrentImagesetData}
        setSync={setSync}
        sync={sync}
      />
      <Modal
        useNativeDriver={true}
        animationType="slide"
        transparent={true}
        backdropStyle={styles.backdrop}
        visible={openImagePicker}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewSm}>
            <Pressable
              android_ripple={{ color: "#d6d6d6" }}
              style={styles.modalPressableClose}
              onPress={() => {
                setOpenImagePicker(!openImagePicker);
                // setSelectedIndex(null);
              }}
            >
              <Icon
                name="close-square"
                style={styles.closeIcon}
                fill="#FFA12D"
              />
            </Pressable>
            <Text category="s1" style={{ margin: 5 }}>
              How do you want to upload images ?
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
                  openCameraAsync("picture");
                  setOpenImagePicker(!openImagePicker);
                }}
                style={{ marginRight: 10 }}
              >
                Use Camera
              </Button>
              <Button
                status="basic"
                mode="contained"
                onPress={() => {
                  pickImageAsync("picture");
                  setOpenImagePicker(!openImagePicker);
                }}
              >
                Pick From gallery
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        useNativeDriver={true}
        animationType="slide"
        transparent={true}
        backdropStyle={styles.backdrop}
        visible={previewVideoVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "rgba(0, 0, 0, 0.7)",
                position: "relative",
              }}
            >
              <View style={styles.buttonContainer}>
                <View></View>
                <Text style={styles.modalHeading}>Video Preview</Text>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressableClose}
                  onPress={closeVideoModal}
                >
                  <Icon
                    name="close-square"
                    style={styles.closeIcon}
                    fill="#FFA12D"
                  />
                </Pressable>
                {videoUrl && (
                  <Video
                    source={{
                      uri: videoUrl,
                    }} // Can be a URL or a local file.
                    ref={(ref) => {
                      this.player = ref;
                    }} // Store reference
                    style={styles.backgroundVideo}
                    repeat={true}
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditImageSet;

const styles = StyleSheet.create({
  saveBtn: {},
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
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
    pageHeading: {
      color: "#adadad",
      marginLeft: 10,
      fontSize: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    width: Dimensions.get("window").width - 20,
    flexWrap: "wrap",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#000000a1",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10,
  },
  toggleTitle: {
    color: "white",
    fontWeight: 400,
  },
  btnContainer: { justifyContent: "center", alignItems: "center" },
  actions: {
    height: 120,
  },
  services: {
    backgroundColor: "#2d3e50",
    flexDirection: "row",
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 5,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  userHeadBanner: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  userHeadText: {
    flexDirection: "column",
  },
  userHeadImage: {
    backgroundColor: "#ffffff",
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 20,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  userProfiledefIcon: {
    width: 50,
    height: 50,
  },
  colorHeading: {
    // width: '100%',
    paddingHorizontal: 10,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pageHeading: {
    width: "100%",
    padding: 10,
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
  recentBlock: {
    width: "100%",
    height: 180,
    elevation: 10,
    padding: 0,
    flexDirection: "column",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  recentImage: {
    width: "100%",
    height: 120,
    marginBottom: 5,
    resizeMode: "cover",
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    height: 50,
    width: 60,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    margin: 5,
  },
  overlayIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "80%",
  },
  recentText: {
    paddingHorizontal: 10,
  },
  lightText: {
    color: "gray",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonlgWrap: {
    width: Dimensions.get("window").width,
    height: 150,
  },
  buttonLg: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 2,
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
  aboutContainer: {
    flex: 1,
    flexDirection: "row",
  },
  imageContainer: {
    flex: 0.5,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    padding: 8,
    height: 200,
  },
  agentImage: {
    minHeight: 140,
    // height: '100%',
    width: "100%",
    borderRadius: 100,
  },
  agentLicense: {
    textAlign: "center",
    backgroundColor: "#102e7a",
    width: "70%",
    color: "#ffffff",
  },
  aboutHeading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  favorites: {
    marginTop: 20,
    padding: 8,
  },
  favoritesHeader: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  favoriteImages: {
    width: "100%",
    height: "100%",
  },
  backgroundVideo: {
    position: "absolute",
    top: 20,
    // left: 0,
    height: 400,
    width: 400,
    // transform: [{translateX: -50}],
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    height: 350,
    overflow: "hidden",
  },
  modalHeading: {
    width: "100%",
    // marginBottom: 20,
    marginLeft: 10,
    fontSize: 20,
    color: "#adadad",
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
  closeIcon: {
    width: 40,
    height: 40,
  },
  modalPressableClose: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  loader: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  loaderText: {
    fontWeight: "bold",
    marginRight: 20,
  },
});
