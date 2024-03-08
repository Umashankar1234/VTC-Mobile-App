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
import { Divider, Icon, Layout, Text, Input } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fileUploadMethod, postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
import { Picker } from "@react-native-picker/picker";
// import ImagePicker from "react-native-image-crop-picker";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const ColistingAgentScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [agentData, setAgentData] = React.useState([]);
  const [agentPhoto, setAgentPhoto] = React.useState("");
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
    licenceno: "",
    fname: "",
    lname: "",
    email: "",
    website: "",
    mobile: "",
    officephone: "",
    companyname: "",
    profile: "",
    credentials: "",
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
      let obj = { agent_id: userData.agent_id, tourId: tourid };
      postMethod("coagent-info", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(false);
            setAgentData(res[0].response.data.model);
            setAgentPhoto(res[0].response.data.imagePath);
            let agObj = res[0].response.data.model;
            for (const [key, value] of Object.entries(agObj)) {
              let val = "";
              if (!`${value}` || `${value}` !== "null") {
                val = `${value}`;
              }

              setValue(`${key}`, val);
            }
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [userData, isFocused, tourid, refresh]);

  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
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
        formData.append("photo", obj);
      }
    }
    formData.append("authenticate_key", "abcd123XYZ");

    fileUploadMethod("add-coagent", formData).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          setLoading(false);
          setRefresh(true);
          resetControls();
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
  const deleteCoagent = () => {
    let obj = {
      agent_id: userData.agent_id,
      tourId: tourid,
      coagentid: agentData.id,
    };
    postMethod("delete-coagent", obj).then((res) => {
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
                  name="person-outline"
                  style={styles.tabButton}
                  fill="#FFA12D"
                />
                <Text category="h6" status="warning" style={styles.pageHeading}>
                  Co-listing Agent
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
                Viewer
              </Text>
              {pictureFiles && pictureFiles.length > 0 ? (
                <Image
                  source={{ uri: pictureFiles[0].path }}
                  style={styles.bannerImgStyle}
                />
              ) : (
                agentPhoto !== "" && (
                  <Image
                    source={{ uri: agentPhoto }}
                    style={styles.bannerImgStyle}
                  />
                )
              )}
              {pictureFiles.length === 0 && agentPhoto === "" && (
                <Icon
                  name="person-outline"
                  style={{ width: 50, height: 50 }}
                  fill="#FFA12D"
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
                  onPress={deleteCoagent}
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
                Personal Information
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="License No."
                    label="License No."
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="licenceno"
                rules={{
                  required: {
                    value: true,
                    message: "License No. is required",
                  },
                }}
              />
              {errors.licenceno && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.licenceno?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="First Name"
                    label="First Name"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="fname"
                rules={{
                  required: {
                    value: true,
                    message: "License No. is required",
                  },
                }}
              />
              {errors.fname && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.fname?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Last Name"
                    label="Last Name"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="lname"
                rules={{
                  required: {
                    value: true,
                    message: "Last Name is required",
                  },
                }}
              />
              {errors.lname && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.lname?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Email"
                    label="Email"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="email"
                rules={{
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                }}
              />
              {errors.email && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.email?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Website"
                    label="Website"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="website"
                rules={{
                  required: {
                    value: true,
                    message: "Website is required",
                  },
                }}
              />
              {errors.website && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.website?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Mobile"
                    label="Mobile"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="mobile"
                rules={{
                  required: {
                    value: true,
                    message: "Mobile is required",
                  },
                }}
              />
              {errors.mobile && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.mobile?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Office Phone"
                    label="Office Phone"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="officephone"
                rules={{
                  required: {
                    value: true,
                    message: "Office Phone is required",
                  },
                }}
              />
              {errors.officephone && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.officephone?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Company name"
                    label="Company name"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="companyname"
                rules={{
                  required: {
                    value: true,
                    message: "Company name is required",
                  },
                }}
              />
              {errors.companyname && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.companyname?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Agent Profile"
                    label="Agent Profile"
                    style={styles.formControl}
                    multiline={true}
                    textStyle={{ minHeight: 64 }}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="profile"
                rules={{
                  required: {
                    value: true,
                    message: "Agent Profile is required",
                  },
                }}
              />
              {errors.profile && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.profile?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Credentials"
                    label="Credentials"
                    style={styles.formControl}
                    multiline={true}
                    textStyle={{ minHeight: 64 }}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="credentials"
                rules={{
                  required: {
                    value: true,
                    message: "Credentials is required",
                  },
                }}
              />
              {errors.credentials && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.credentials?.message}
                </Text>
              )}
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
              <Button
                style={styles.saveButton}
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
                buttonColor="orange"
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
