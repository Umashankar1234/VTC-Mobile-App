import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import { Dimensions } from "react-native";
import { Icon } from "@ui-kitten/components";
import { ScrollView } from "react-native";
import DraggableGrid from "react-native-draggable-grid";
import { Button } from "react-native-paper";
import { Image } from "react-native";
import { axiosPost } from "../../commons/Save";
import { useIsFocused } from "@react-navigation/native";
import { getItem } from "../../context/async-storage";
import Toast from "react-native-toast-message";

const EditImageSetModal = ({
  navigation,
  menuModalVisible,
  menuSelectionType,
  setMenuModalVisible,
  // setSelectedIndex,
  setMenuSelectionType,
  // duplicateImageset,
  imagesetId,
  images,
  setImages,
  setSync,
  sync,
}) => {
  const goTo = (url) => {
    setMenuModalVisible(!menuModalVisible);
    navigation.navigate(url, {
      tourid: imagesetId,
    });
  };
  const [agentId, setAgentId] = useState();
  const isFocused = useIsFocused();

  const render_item = (item) => {
    return (
      <View style={styles.item} key={item.key}>
        <Image source={{ uri: item.file_url }} style={styles.item_text} />
      </View>
    );
  };
  const [isDragging, setIsDragging] = useState(false);
  const [imgIds, setImgIds] = useState();
  const onDragStart = () => {
    setIsDragging(true);
  };
  const onDragRelease = (data) => {
    setIsDragging(false);
    setImages(data);
    setImgIds(data.map((item, index) => item.imageid));
  };
  const dataWithKeys =
    images &&
    images.length > 0 &&
    images.map((item, index) => ({
      ...item,
      key: item.imageid,
    }));
  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    if (isFocused) fetch();
  }, [isFocused]);
  const submitOrder = async () => {
    const data = {
      agent_id: agentId,
      imgid: imgIds,
      type: "tour",
      authenticate_key: "abcd123XYZ",
    };
    const res = await axiosPost("change-order", "", "", data, "");
    setMenuModalVisible(false);

    // if (res.data[0].response) {
    //   if (res.data[0].response.status === "error") {
    //     Toast.show({
    //       type: "error",
    //       text1: "Error",
    //       text2: res.data[0].response.message,
    //       position: "top",
    //       topOffset: "70",
    //     });
    //   } else {
    //     Toast.show({
    //       type: "success",
    //       text1: "Successful",
    //       text2: res.data[0].response.message,
    //       position: "top",
    //       topOffset: "70",
    //     });
    //     setSync(!sync);
    //   }
    // }
  };
  return (
    <Modal
      useNativeDriver={true}
      animationType="slide"
      transparent={true}
      backdropStyle={styles.backdrop}
      visible={menuModalVisible}
      onRequestClose={() => {
        setMenuModalVisible(!menuModalVisible);
        // setSelectedIndex(null);
        setMenuSelectionType("");
      }}
    >
      <ScrollView contentContainerStyle={styles.modalHolder}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <ActionModalContent/> */}
            {menuSelectionType === "ORD" && (
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.buttonContainer1}
                scrollEnabled={!isDragging}
              >
                <Text style={styles.modalHeading}>Change Order</Text>
                <Button
                  buttonColor="orange"
                  mode="contained"
                  onPress={submitOrder}
                >
                  Save
                </Button>

                <View style={styles.wrapper}>
                  <DraggableGrid
                    numColumns={4}
                    onDragStart={onDragStart}
                    renderItem={render_item}
                    data={dataWithKeys}
                    onDragRelease={onDragRelease}
                  />
                </View>
              </ScrollView>
            )}
            {menuSelectionType === "ACT" && (
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeading}>Actions</Text>

                {/* <Pressable android_ripple={{ color: "#d6d6d6" }}
                style={styles.modalPressable}
                onPress={() => duplicateImageset(imageset)}
              >
                <Icon
                  name="copy-outline"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Duplicate ImageSet</Text>
              </Pressable> */}
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("ServiceLinksScreen")}
                >
                  <Icon
                    name="link-2-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Service Links</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("OtherLinksScreen")}
                >
                  <Icon
                    name="external-link-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Other Links</Text>
                </Pressable>
              </View>
            )}
            {menuSelectionType === "DIS" && (
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeading}>Distribute</Text>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                >
                  <Icon name="shake" style={styles.modalIcon} fill="#FFA12D" />
                  <Text style={styles.modalText}>Distribute Tour</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                >
                  <Icon
                    name="file-add"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Post to Craigslist</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                >
                  <Icon name="video" style={styles.modalIcon} fill="#FFA12D" />
                  <Text style={styles.modalText}>Video Promotion</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                >
                  <Icon
                    name="play-circle"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Distribute Video</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                >
                  <Icon name="npm" style={styles.modalIcon} fill="#FFA12D" />
                  <Text style={styles.modalText}>Single Property Domain</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                >
                  <Icon
                    name="person-done"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Domain Manager</Text>
                </Pressable>
              </View>
            )}
            {menuSelectionType === "PRT" && (
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeading}>Property Information</Text>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("DescriptionScreen")}
                >
                  <Icon
                    name="person-done-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Description</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("FeaturesScreen")}
                >
                  <Icon
                    name="globe-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Features</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("PricingScreen")}
                >
                  <Icon
                    name="credit-card-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Pricing</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("LocationInfoScreen")}
                >
                  <Icon
                    name="navigation-2-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Location</Text>
                </Pressable>
                {/* <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                >
                  <Icon
                    name="file-text-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Docs/Forms</Text>
                </Pressable> */}
              </View>
            )}
            {menuSelectionType === "AMN" && (
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeading}>Amenities</Text>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("AppliancesScreen")}
                >
                  <Icon
                    name="speaker-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Appliances</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("InteriorsScreen")}
                >
                  <Icon
                    name="collapse-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Interior Amenities</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("ExteriorsScreen")}
                >
                  <Icon
                    name="expand-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Exterior Amenities</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("CommunityScreen")}
                >
                  <Icon
                    name="people-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Community Amenities</Text>
                </Pressable>
              </View>
            )}
            {menuSelectionType === "ADV" && (
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeading}>Advanced</Text>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("MenuOptionsScreen")}
                >
                  <Icon
                    name="menu-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Menu Options</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("BackgroundMusicScreen")}
                >
                  <Icon
                    name="music-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Background Music</Text>
                </Pressable>
                {/* <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("TourNarration")}
                >
                  <Icon
                    name="mic-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Tour Narration</Text>
                </Pressable> */}
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("AnnouncementScreen")}
                >
                  <Icon
                    name="radio-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Announcements</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("NewsletterScreen")}
                >
                  <Icon
                    name="file-text-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Newsletter Form</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("ThemesScreen")}
                >
                  <Icon
                    name="color-palette-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Themes</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("CompanyBannerScreen")}
                >
                  <Icon
                    name="film-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Company Banner</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("ColistingAgentScreen")}
                >
                  <Icon
                    name="person-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Co-listing Agent</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("YoutubeLinksScreen")}
                >
                  <Icon
                    name="arrow-right-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>Additional Youtube Links</Text>
                </Pressable>
                <Pressable
                  android_ripple={{ color: "#d6d6d6" }}
                  style={styles.modalPressable}
                  onPress={() => goTo("WalkthroughScreen")}
                >
                  <Icon
                    name="video-outline"
                    style={styles.modalIcon}
                    fill="#FFA12D"
                  />
                  <Text style={styles.modalText}>3D Walkthrough</Text>
                </Pressable>
              </View>
            )}
            <Pressable
              android_ripple={{ color: "#d6d6d6" }}
              style={styles.modalPressableClose}
              onPress={() => {
                setMenuModalVisible(!menuModalVisible);
                // setSelectedIndex(null);
                setMenuSelectionType("");
              }}
            >
              <Icon
                name="close-square"
                style={styles.closeIcon}
                fill="#FFA12D"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditImageSetModal;

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
    marginVertical: 22,
  },
  modalHolder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000006c",
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
  wrapper: {
    paddingTop: 20,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  item: {
    width: 100,
    height: 100,
    // backgroundColor: "red",
    margin: 8,
    // justifyContent: "center",
    // alignItems: "center",
  },
  item_text: {
    width: 80,
    height: 80,
  },
});
