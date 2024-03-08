/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Modal,
  Pressable,
  Alert,
  ImageBackground,
  Linking,
} from "react-native";
import { Icon, Text, Toggle } from "@ui-kitten/components";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import Toast from "react-native-toast-message";
import { Button } from "react-native-paper";

const RenderActiveImageSet = React.memo(
  ({ imageset, userData, setRefresh, navigation, pageType }) => {
    const isFocused = useIsFocused();
    React.useEffect(() => {
      setSelectedIndex(null);
      setMenuModalVisible(false);
      setMenuSelectionType("");
    }, [isFocused]);
    const [isActive, setIsActive] = React.useState(imageset.isactive === 1);
    const [isLiveDate, setIsLiveDate] = React.useState(
      imageset.is_schedule === 1
    );
    const [visible, setVisible] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [menuModalVisible, setMenuModalVisible] = React.useState(false);
    const [menuSelectionType, setMenuSelectionType] = React.useState("");
    const [objTodelete, setObjToDelete] = React.useState({});
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [isvirtualtourservice, setIsvirtualtourservice] = React.useState(
      imageset.virtualtourservice === 1
    );
    const [isflyerservice, setIsflyerservice] = React.useState(
      imageset.flyerservice === 1
    );
    const [isvideoservice, setIsvideoservice] = React.useState(
      imageset.videoservice === 1
    );
    const customPostForImageSets = (url, obj) => {
      postMethod(url, obj).then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "success") {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: res[0].response.message,
              position: "top",
              topOffset: "70",
            });
            setRefresh(true);
          }
        }
      });
    };
    const onActivateCheckedChange = (isChecked) => {
      setIsActive(isChecked);
      let obj = {
        agent_id: userData.agent_id,
        tourid: imageset.id,
        isactive: isChecked ? 1 : 0,
      };
      customPostForImageSets("change-image-status", obj);
    };

    const onLiveDateCheckedChange = (isChecked) => {
      setIsLiveDate(isChecked);
      let obj = {
        agent_id: userData.agent_id,
        tourid: imageset.id,
        is_schedule: isChecked ? 1 : 0,
      };
      customPostForImageSets("change-schedule-status", obj);
    };
    const onVirtualtourserviceCheckedChange = (isChecked) => {
      setIsvirtualtourservice(isChecked);
      let obj = {
        agent_id: userData.agent_id,
        tourid: imageset.id,
        status: "tour",
        virtualtourservice: isChecked ? 1 : 0,
      };
      customPostForImageSets("change-tour-service", obj);
    };
    const onFlyerserviceCheckedChange = (isChecked) => {
      setIsflyerservice(isChecked);
      let obj = {
        agent_id: userData.agent_id,
        tourid: imageset.id,
        status: "flyer",
        flyerservice: isChecked ? 1 : 0,
      };
      customPostForImageSets("change-tour-service", obj);
    };
    const onVideoserviceCheckedChange = (isChecked) => {
      setIsvideoservice(isChecked);
      let obj = {
        agent_id: userData.agent_id,
        tourid: imageset.id,
        status: "video",
        videoservice: isChecked ? 1 : 0,
      };
      customPostForImageSets("change-tour-service", obj);
    };
    const onSelect = (index) => {
      setSelectedIndex(index);
      setVisible(false);
      switch (index.row) {
        case 0:
          setMenuSelectionType("ACT");
          break;
        case 1:
          setMenuSelectionType("DIS");
          break;
        case 2:
          setMenuSelectionType("PRT");
          break;
        case 3:
          setMenuSelectionType("AMN");
          break;
        case 4:
          setMenuSelectionType("ADV");
          break;
        default:
          break;
      }
      setMenuModalVisible(true);
    };

    const renderToggleButton = () => (
      <Pressable
        style={styles.buttonWrapInset}
        onPress={() => setVisible(true)}
      >
        <Icon
          name="more-vertical-outline"
          style={{ width: 25, height: 25 }}
          fill="#FFFFFF"
        />
      </Pressable>
    );
    const promptDeleteImageSet = (item) => {
      setObjToDelete(item);
      setVisible(false);
      setMenuModalVisible(false);
      setDeleteModalVisible(true);
    };
    const deleteImageset = () => {
      var obj = {
        agent_id: userData.agent_id,
        tourId: objTodelete.id,
      };
      postMethod("delete-imageset", obj).then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "error") {
            Toast.show({
              type: "error",
              text1: "Error deleting imageset",
              text2: res[0].response.message,
              position: "top",
              topOffset: "70",
            });
            setDeleteModalVisible(false);
          } else {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: res[0].response.message,
              position: "top",
              topOffset: "70",
            });
            setRefresh(true);
            setDeleteModalVisible(false);
          }
        }
      });
    };
    const duplicateImageset = (item) => {
      var obj = {
        agent_id: userData.agent_id,
        tourId: item.id,
      };
      postMethod("duplicateimageset", obj).then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "error") {
            Toast.show({
              type: "error",
              text1: "Success",
              text2: res[0].response.message,
              position: "top",
              topOffset: "70",
            });
          } else {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: res[0].response.message,
              position: "top",
              topOffset: "70",
            });
            setRefresh(true);
            setMenuModalVisible(false);
          }
        }
      });
    };
    const gotoEdit = (id) => {
      // if (pageType && pageType == "flyer")
      //   navigation.navigate("EditFlyer", {
      //     tourid: id,
      //   });
      // else
      navigation.navigate("EditImageSet", {
        tourid: id,
        pageType: pageType,
      });
    };
    const doubleTapTimer = useRef(null);
    const [tapCount, setTapCount] = useState(0);

    const handlePress = (imageset) => {
      clearTimeout(doubleTapTimer.current);
      setTapCount((prevCount) => prevCount + 1);

      if (tapCount === 0) {
        doubleTapTimer.current = setTimeout(() => {
          // Perform action on single tap
          setTapCount(0);
        }, 300); // Adjust the delay based on your needs
      } else if (tapCount === 1) {
        // Perform action on double tap
        gotoEdit(imageset.id);
        setTapCount(0);
      }
    };
    const viewTour = async (id) => {
      if (pageType == "videos")
        var url = `https://www.virtualtourcafe.com/admin-as-agent-mobile/${userData.agent_id}/${id}`;
      else
        var url = `https://www.virtualtourcafe.com/tour/${id}`;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
      }
    };
    const shareToFb = (tourId) => {
      const url = `https://www.virtualtourcafe.com/tour/${tourId}${userData.agent_id}`;

      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;

      Linking.openURL(facebookUrl);
    };
    const shareToTwitter = (tourId) => {
      const url = `https://www.virtualtourcafe.com/tour/${tourId}${userData.agent_id}`;
      const tweet = `Check out this link: ${url}`;

      Linking.openURL(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
      );
    };
    return (
      <Pressable
        android_ripple={{ color: "#d6d6d6" }}
        onPress={(e) => handlePress(imageset)}
        style={styles.oneSet}
      >
        <View style={styles.blockHeader}>
          <ImageBackground
            style={styles.imageCover}
            source={{
              uri: imageset.filename,
            }}
          >
            <View style={styles.overlayView} />

            <View style={styles.caption}>
              <Text style={{ color: "#FFA12D", fontSize: 20 }}>
                {imageset.caption}
              </Text>
              {/* <Text style={{color: '#adadad', fontSize: 12}}>
                3738 Nevil St
              </Text> */}
            </View>
            <View style={styles.textHead}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                {pageType && (
                  <Pressable
                    style={styles.viewIcon}
                    android_ripple={{ color: "#95a399", radius: 18 }}
                    onPress={() => viewTour(imageset.id)}
                  >
                    <Icon
                      name="eye-outline"
                      style={{ width: 20, height: 20, overflow: "hidden" }}
                      fill="#ffffff"
                    />
                  </Pressable>
                )}

                <Pressable
                  style={styles.editIcon}
                  android_ripple={{ color: "#95a399", radius: 18 }}
                  onPress={() => gotoEdit(imageset.id)}
                >
                  <Icon
                    name="edit-outline"
                    style={{ width: 20, height: 20, overflow: "hidden" }}
                    fill="#ffffff"
                  />
                </Pressable>
                <Pressable
                  onPress={() => promptDeleteImageSet(imageset)}
                  style={styles.deleteIcon}
                  android_ripple={{ color: "#95a399", radius: 18 }}
                >
                  <Icon
                    name="trash-outline"
                    style={{ width: 20, height: 20 }}
                    fill="#ffffff"
                  />
                </Pressable>
                {!pageType && (
                  <Pressable
                    onPress={() => duplicateImageset(imageset)}
                    style={styles.duplicateIcon}
                    android_ripple={{ color: "#adadad", radius: 18 }}
                  >
                    <Icon
                      name="copy-outline"
                      style={{ width: 20, height: 20 }}
                      fill="#ffffff"
                    />
                  </Pressable>
                )}
              </View>
            </View>
            <View style={styles.socialIconsContainer}>
              <View></View>
              <View style={styles.socialIcons}>
                <Text style={styles.sectionLabelsAlt}>Share :</Text>
                <Pressable
                  style={styles.buttonWrapInset}
                  onPress={() => shareToFb(imageset.id)}
                >
                  <Icon
                    name="facebook"
                    style={{ width: 25, height: 25 }}
                    fill="#3b5998"
                  />
                </Pressable>
                <Pressable
                  style={styles.buttonWrapInset}
                  onPress={(e) => shareToTwitter(imageset.id)}
                >
                  <Icon
                    name="twitter"
                    style={{ width: 25, height: 25 }}
                    fill="#1DA1F2"
                  />
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.infoSection}>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Text style={styles.sectionLabels}>Status</Text>
            <Text style={styles.sectionData}>Picker</Text>
            <Text style={styles.sectionLabels}>Date Last Edited</Text>
            <Text style={styles.sectionData}>{imageset.lastmodifieddate}</Text>
            {/* <Text style={styles.sectionLabels}>Schedule Live Date</Text>
            <Toggle
              style={styles.toggle}
              status="primary"
              onChange={onLiveDateCheckedChange}
              checked={isLiveDate}
            /> */}
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Text style={styles.sectionLabels}>Date of Creation</Text>
            <Text style={styles.sectionData}>{imageset.creationdate}</Text>
            <Text style={styles.sectionLabels}>Activate/Visible</Text>
            <Toggle
              style={styles.toggle}
              status="success"
              onChange={onActivateCheckedChange}
              checked={isActive}
            />
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            ></View>
          </View>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.sectionFooterSub}>
            <Text style={styles.sectionFooterHead}>TOUR SERVICE</Text>
            <Toggle
              style={styles.toggle}
              status="warning"
              onChange={onVirtualtourserviceCheckedChange}
              checked={isvirtualtourservice}
            />
          </View>
          <View style={styles.sectionFooterSub}>
            <Text style={styles.sectionFooterHead}>FLYER SERVICE</Text>
            <Toggle
              style={styles.toggle}
              status="info"
              onChange={onFlyerserviceCheckedChange}
              checked={isflyerservice}
            />
          </View>
          <View style={styles.sectionFooterSub}>
            <Text style={styles.sectionFooterHead}>VIDEO SERVICE</Text>
            <Toggle
              style={styles.toggle}
              status="success"
              onChange={onVideoserviceCheckedChange}
              checked={isvideoservice}
            />
          </View>
        </View>
        <View>
          {/* <EditImageSetModal
          navigation={navigation}
          menuModalVisible={menuModalVisible}
          menuSelectionType={menuSelectionType}
          setMenuModalVisible={setMenuModalVisible}
          setSelectedIndex={setSelectedIndex}
          setMenuSelectionType={setMenuSelectionType}
          duplicateImageset={duplicateImageset}
          imageset={imageset}
        /> */}
          <Modal
            useNativeDriver={true}
            animationType="slide"
            transparent={true}
            backdropStyle={styles.backdrop}
            visible={deleteModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setDeleteModalVisible(!deleteModalVisible);
              setObjToDelete({});
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalViewSm}>
                <Text category="s1" style={{ margin: 5 }}>
                  Are you sure you want to delete this imageset ?
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
                    onPress={deleteImageset}
                    style={{ marginRight: 10 }}
                  >
                    Yes
                  </Button>
                  <Button
                    status="basic"
                    mode="contained"
                    onPress={() => {
                      setDeleteModalVisible(!deleteModalVisible);
                      setObjToDelete({});
                    }}
                  >
                    No
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </Pressable>
    );
  }
);
export default RenderActiveImageSet;

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
  viewIcon: {
    marginHorizontal: 5,
    backgroundColor: "#7700ff",
    padding: 5,
    borderRadius: 50,
    color: "white",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    // overflow: "hidden",
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
    // overflow: "hidden",
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
  duplicateIcon: {
    marginHorizontal: 5,
    backgroundColor: "#dac723",
    padding: 5,
    borderRadius: 50,
    color: "white",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
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
    color: "#555555",
    fontSize: 15,
  },
  sectionFooterSub: {
    alignItems: "center",
  },
  sectionFooterHead: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
  },
  toggle: {
    marginTop: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
