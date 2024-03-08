/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from "react-native";
import { Divider, Icon, Layout, Text } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fileUploadMethod, postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { Picker } from "@react-native-picker/picker";
// import ImagePicker from "react-native-image-crop-picker";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const CompanyBannerScreen = ({ route, navigation }) => {

  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [allBanners, setAllBanners] = React.useState([]);
  const [defaultBanner, setDefaultBanner] = React.useState("");
  const [headerImageId, setHeaderImageId] = React.useState("");
  const [customBannerImg, setCustomBannerImg] = React.useState("");
  const [offeredBannerImg, setOfferedBannerImg] = React.useState("");
  const [pictureFiles, setPictureFiles] = React.useState([]);
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const initialDescriptionState = {
    caption: "",
    widgetcaption: "",
    description: "",
  };
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
  React.useEffect(() => {
    setPictureFiles([]);
  }, [isFocused]);
  React.useEffect(() => {
    let componentMounted = true;
    if (Object.entries(userData).length > 0 && refresh) {
      let obj = { agentId: userData.agent_id, tourid: tourid };
      postMethod("get-flyerheader-details", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(false);
            setAllBanners(res[0].response.flyerdetails);
            setDefaultBanner(res[0].response.defaulturl);
            setHeaderImageId(res[0].response.headerimageid);
            setCustomBannerImg(res[0].response.bannerimg);
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [userData, isFocused, tourid, refresh]);
  React.useEffect(() => {
    var filter_data = allBanners.filter((res) => {
      return res.id == headerImageId;
    });
    if (filter_data.length > 0) {
      setOfferedBannerImg(filter_data[0].url);
    } else {
      setOfferedBannerImg("");
    }
  }, [headerImageId, allBanners]);
  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("agent_id", userData.agent_id);
    formData.append("tourId", tourid);
    if (!pictureFiles || pictureFiles.length === 0) {
      formData.append("header", 0);
    } else {
      for (let file of pictureFiles) {
        var fname = file.path.replace(/^.*[\\\/]/, "");
        var obj = {
          uri: file.path,
          name: fname,
          type: file.mime,
        };
        formData.append("image[]", obj);
      }
    }
    formData.append("authenticate_key", "abcd123XYZ");
    fileUploadMethod("save-company-banner", formData).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          setLoading(false);
          setRefresh(true);
        }
      }
    });
  };
  const resetControls = () => {
    reset(initialDescriptionState);
  };
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      var x = pictureFiles;
      result.assets.forEach((element) => {
        x.push(element);
      });
      // for (let file of result) {
      // x.push(file);
      // }
      setPictureFiles(x);
    } else {
      alert("You did not select any image.");
    }
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    //   freeStyleCropEnabled: true,
    //   showCropGuidelines: true,
    //   multiple: false,
    //   // includeBase64: true,
    // }).then((image) => {
    //   var x = [];
    //   // for (let file of image) {
    //   //   x.push(file);
    //   // }
    //   x.push(image);
    //   setPictureFiles(x);
    // });
  };
  const deleteCustomImage = () => {
    let obj = {
      agent_id: userData.agent_id,
      tourId: tourid,
      folder: "companybanner",
      defalutImage: "default-banner.jpg",
    };
    postMethod("delete-tour-image", obj).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          setRefresh(true);
        }
      }
    });
  };
  return (
    <SafeAreaView>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <ScrollView>
        <Layout style={styles.container}>
          <View style={styles.headingWrap}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Icon
                  name="film-outline"
                  style={styles.tabButton}
                  fill="#FFA12D"
                />
                <Text category="h6" status="warning" style={styles.pageHeading}>
                  Company Banner
                </Text>
              </View>
              <Text category="c2" appearance="hint" style={{ marginLeft: 45 }}>
                Advanced
              </Text>
            </View>
          </View>
          <View style={styles.formWrapTab} level="2">
            <View style={styles.formWrapCard}>
              <Text style={{ marginLeft: 15 }} category="h6">
                Custom Banner
              </Text>
              {pictureFiles && pictureFiles.length > 0 ? (
                <Image
                  source={{ uri: pictureFiles[0].path }}
                  style={styles.bannerImgStyle}
                />
              ) : (
                customBannerImg !== "" && (
                  <Image
                    source={{ uri: customBannerImg }}
                    style={styles.bannerImgStyle}
                  />
                )
              )}
              {pictureFiles.length === 0 &&
                customBannerImg === "" &&
                defaultBanner !== "" && (
                  <Image
                    source={{ uri: defaultBanner }}
                    style={styles.bannerImgStyle}
                  />
                )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleImagePicker}
                >
                  <Icon
                    name="image"
                    style={styles.uploadIcons}
                    fill="#FFA12D"
                  />
                  <Text category="s1">Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={deleteCustomImage}
                >
                  <Icon
                    name="trash"
                    style={styles.uploadIcons}
                    fill="#FFA12D"
                  />
                  <Text category="s1">Remove</Text>
                </TouchableOpacity>
              </View>
              <Divider style={{ marginVertical: 20 }} />
              <Text style={{ marginLeft: 15 }} category="h6">
                Offered Banners
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  // <Input
                  //   placeholder="WIDGET TITLE"
                  //   label="WIDGET TITLE"
                  //   style={styles.formControl}
                  //   textStyle={styles.textInputStyle}
                  //   onBlur={onBlur}
                  //   onChangeText={value => onChange(value)}
                  //   value={value}
                  //   size="large"
                  // />

                  <Picker
                    selectedValue={value}
                    label="Offered Banners"
                    style={styles.formControl}
                    // itemStyle={{backgroundColor: '#FFFFFF', color: '#000000'}}
                    color="primary"
                    // mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => {
                      onChange(itemValue);
                      setHeaderImageId(itemValue);
                    }}
                  >
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="None"
                      value=""
                    />

                    {allBanners &&
                      allBanners.length > 0 &&
                      allBanners.map((banner) => (
                        <Picker.Item
                          style={styles.pickerItemStyle}
                          label={banner.imagename}
                          value={banner.id}
                          key={banner.id}
                        />
                      ))}
                  </Picker>
                )}
                name="offeredbanner"
                rules={{
                  required: {
                    value: true,
                    message: "Offered banner is required",
                  },
                }}
              />
              {errors.offeredbanner && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.offeredbanner?.message}
                </Text>
              )}
              {offeredBannerImg === "" ? (
                <Image
                  source={{ uri: defaultBanner }}
                  style={styles.bannerImgStyle}
                />
              ) : (
                <Image
                  source={{ uri: offeredBannerImg }}
                  style={styles.bannerImgStyle}
                />
              )}
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
              <Button
                style={styles.saveButton}
                mode="contained"
                buttonColor="orange"
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                loading={loading}
              >
                Update
              </Button>
            </View>
          </View>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: "space-between",
  },
  sectionLabels: {
    color: "#adadad",
    fontSize: 14,
    marginTop: 15,
  },
  sectionLabelsAlt: {
    color: "#adadad",
    fontSize: 14,
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
    height: 150,
    resizeMode: "cover",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 15,
  },
  textHead: {
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  formWrapTab: {
    padding: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    margin: 15,
    borderRadius: 15,
  },
  formWrapCard: {
    backgroundColor: "#ffffff",
    // elevation: 10,

    padding: 10,
  },
  formControl: {
    margin: 5,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  saveButton: {
    margin: 10,
  },
  pickerItemStyle: { backgroundColor: "#FFF", color: "#000" },
  bannerImgStyle: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginVertical: 20,
  },
  uploadIcons: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  uploadButton: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    elevation: 2,
    borderRadius: 10,
    marginVertical: 10,
    width: 100,
  },
});
