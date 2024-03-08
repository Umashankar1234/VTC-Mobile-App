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
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Card,
  Tab,
  TabBar,
  ViewPager,
  Input,
  Spinner,
} from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import {
  fetchRecords,
  postMethod,
  fileUploadMethod,
} from "../commons/Services";
import { useAuthorization } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from "expo-image-picker";

import {
  faUser,
  faCamera,
  faAddressCard,
  faImages,
  faIdCardAlt,
  faSdCard,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-native-paper";

const CameraIcon = (props) => (
  <FontAwesomeIcon icon={faCamera} size={25} color={"#FFA12D"} />
);

const AddressIcon = (props) => (
  <FontAwesomeIcon icon={faAddressCard} size={25} color={"#FFA12D"} />
);

const GalleryIcon = (props) => (
  <FontAwesomeIcon icon={faImages} size={25} color={"#FFA12D"} />
);

const SDCardIcon = (props) => (
  <FontAwesomeIcon icon={faSdCard} size={25} color={"#FFA12D"} />
);
const SaveIcon = (props) => (
  <FontAwesomeIcon icon={faSave} size={25} color={"#FFA12D"} />
);
const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);
export const AgentProfileScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const initialProfiledata = {
    agent_id: "",
    mobile: "",
    is_autotour: "",
    is_update_image: "",
    facebooklink: "",
    twitterlink: "",
    linkedinlink: "",
    yelplink: "",
    is_maxeberdi: "",
    licenceno: "",
    fname: "xxx",
    lname: "",
    username: "",
    password: "",
    email: "",
    profile: "",
  };
  const [userData, setUserData] = React.useState({});
  const [agentPersonalinfo, setAgentPersonalinfo] =
    React.useState(initialProfiledata);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [cafeLoading, setCafeLoading] = React.useState(false);
  const [agentProfileImage, setAgentProfileImage] = React.useState("");
  const [myCafeGallery, setMyCafeGallery] = React.useState("");
  const [profImgIncCounter, setProfImgIncCounter] = React.useState(0);
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
    if (saveResult.message !== "") {
      setTimeout(() => {
        setSaveResult({
          message: "",
          color: "basic",
        });
      }, 5000);
    }
  }, [saveResult]);
  React.useEffect(() => {
    let componentMounted = true;
    if (Object.entries(userData).length > 0) {
      let obj = { agent_id: userData.agent_id };
      postMethod("agent-profile-details", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setAgentPersonalinfo(res[0].response.data.agent_details);
            setAgentProfileImage(res[0].response.data.agentphotouploadfile);
            setProfImgIncCounter(profImgIncCounter + 1);
            let agObj = res[0].response.data.agent_details;
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
  }, [userData.agent_id]);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      width: 300,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      showCropGuidelines: true,
    });
    if (!result.canceled) {
      uploadAgentProfileImage(result);
    } else {
      alert("You did not select any Image.");
    }
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    //   freeStyleCropEnabled: true,
    //   showCropGuidelines: true,
    //   // includeBase64: true,
    // }).then(image => {
    //   uploadAgentProfileImage(image);
    // });
  };
  const handleCameraPicker = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      width: 300,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      showCropGuidelines: true,
    });
    if (!result.canceled) {
      uploadAgentProfileImage(result);
    } else {
      alert("You did not select any Image.");
    }
  };
  const uploadAgentProfileImage = (image) => {
    try {
      var filename = image.uri.replace(/^.*[\\\/]/, "");
      const formdt = new FormData();
      formdt.append("agentphotouploadfile", {
        uri: image.uri,
        name: filename,
        type: "image/*",
      });
      formdt.append("agent_id", userData.agent_id);
      formdt.append("authenticate_key", "abcd123XYZ");
      fileUploadMethod("agent-profile-upload-image", formdt).then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "error") {
            setSaveResult({
              message: res[0].response.message,
              color: "danger",
            });
          } else {
            setAgentProfileImage(res[0].response.data.profile_image);
            setProfImgIncCounter(profImgIncCounter + 1);
            setSaveResult({
              message: res[0].response.message,
              color: "success",
            });
          }
        }
      });
    } catch (error) {
    }
  };
  const onSubmit = (data) => {
    setLoading(true);
    data.agent_id = userData.agent_id;
    postMethod("agent-personal-information", data).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          setSaveResult({
            message: res[0].response.message
              ? res[0].response.message
              : "something happend. Try again",
            color: "danger",
          });
        } else {
          setSaveResult({
            message: res[0].response.message
              ? res[0].response.message
              : "Agent personal information saved successfully",
            color: "success",
          });
        }
        setLoading(false);
      }
    });
  };

  const saveMyCafe = () => {
    setCafeLoading(true);
    let obj = { agent_id: userData.agent_id, mycafegallery: myCafeGallery };
    postMethod("update-agent-mycafe", obj).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          setSaveResult({ message: res[0].response.message, color: "danger" });
        } else {
          setSaveResult({ message: res[0].response.message, color: "success" });
        }
        setCafeLoading(false);
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

      <Layout style={styles.container}>
        
          <View style={styles.headingWrap}>
            <FontAwesomeIcon icon={faUser} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Agent Profile
            </Text>
          </View>
          <TabBar
            style={{
              paddingVertical: 15,
              backgroundColor: "#fff",
              elevation: 2,
            }}
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <Tab title="Upload Images" icon={CameraIcon} />
            <Tab title="Personal Information" icon={AddressIcon} />
            <Tab title="My Cafe Gallery" icon={GalleryIcon} />
          </TabBar>
          <ViewPager
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <View style={styles.uploadImages} level="2">
              <View style={styles.imageWrap}>
                {agentProfileImage === "" ? (
                  <FontAwesomeIcon
                    icon={faIdCardAlt}
                    size={100}
                    color={"#e5e5e5"}
                  />
                ) : (
                  <Image
                    key={agentProfileImage + profImgIncCounter}
                    source={{
                      uri: agentProfileImage + "?random=" + profImgIncCounter,
                    }}
                    style={styles.profileImage}
                  />
                )}
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>              
                <Button
                  style={styles.button}
                  mode="contained"
                  onPress={handleCameraPicker}
                  icon="camera"
                >Camera</Button>
                <Button
                  style={styles.button}
                  mode="contained"
                  icon="image-search-outline"
                  onPress={handleImagePicker}
                >Gallery</Button>
              </View>
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
              {/* <Button
                style={styles.saveButton}
                size="large"
                accessoryLeft={SaveIcon}>
                Save
              </Button> */}
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 150 }} style={styles.formWrapTab} level="2">
              <View style={styles.formWrapCard}>
                {/* <Text category="h5">Personal Info</Text> */}
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
                  // rules={{
                  //   required: {value: true, message: 'Name is required'},
                  // }}
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
                  // defaultValue={agentPersonalinfo.fname}
                  rules={{
                    required: {
                      value: true,
                      message: "First name is required",
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
                    required: { value: true, message: "Last name is required" },
                  }}
                  defaultValue=""
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
                      placeholder="Username"
                      label="Username"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="username"
                  rules={{
                    required: { value: true, message: "Username is required" },
                  }}
                  defaultValue=""
                />
                {errors.username && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.username?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Passwrod"
                      label="Password"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="password"
                  // rules={{
                  //   required: {value: true, message: 'Password is required'},
                  // }}
                  defaultValue=""
                />
                {errors.password && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.password?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Confirm Password"
                      label="Confirm Password"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="password"
                  // rules={{
                  //   required: {value: true, message: 'Confirm password is required'},
                  // }}
                  defaultValue=""
                />
                {errors.password && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.password?.message}
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
                    required: { value: true, message: "Email is required" },
                  }}
                  defaultValue=""
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
                      placeholder="Mobile"
                      label="Mobile"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                      maxLength={11}
                      keyboardType="number-pad"
                    />
                  )}
                  name="mobile"
                  // rules={{
                  //   required: {value: true, message: 'Name is required'},
                  // }}
                  defaultValue=""
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
                      placeholder="Facebook Link"
                      label="Facebook Link"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="facebooklink"
                  // rules={{
                  //   required: {value: true, message: 'Name is required'},
                  // }}
                  defaultValue=""
                />
                {errors.facebooklink && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.facebooklink?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Twitter Link"
                      label="Twitter Link"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="twitterlink"
                  // rules={{
                  //   required: {value: true, message: 'Name is required'},
                  // }}
                  defaultValue=""
                />
                {errors.twitterlink && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.twitterlink?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Linkedin Link"
                      label="Linkedin Link"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="linkedinlink"
                  // rules={{
                  //   required: {value: true, message: 'Name is required'},
                  // }}
                  defaultValue=""
                />
                {errors.linkedinlink && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.linkedinlink?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Yelp Link"
                      label="Yelp Link"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="yelplink"
                  // rules={{
                  //   required: {value: true, message: 'Name is required'},
                  // }}
                  defaultValue=""
                />
                {errors.yelplink && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.yelplink?.message}
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
            </ScrollView>
            <View style={styles.formWrapTab} level="2">
              <Text category="s1" style={styles.activeLabels}>
                Active Link
              </Text>
              <Text
                category="s1"
                style={[styles.borderedText, { borderBottom: 0 }]}
              >
                https://virtualtourcafe.com/mycafegallery/xyz
              </Text>
              <Text category="s1" style={styles.activeLabels}>
                Inventory Button *
              </Text>
              <Text category="s1" style={styles.borderedText}>
                "a href="https://virtualtourcafe.com/mycafegallery/pintu"
                target="_blank"
              </Text>
              <Input
                placeholder="Link Name"
                label="Link Name"
                style={styles.formControl}
                onChangeText={(value) => setMyCafeGallery(value)}
                value={myCafeGallery}
                textStyle={styles.textInputStyle}
                size="large"
              />
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
              <Button
                style={styles.saveButton}
                loading={loading}
                disabled={loading}
                mode="contained"
                onPress={saveMyCafe}
                buttonColor="orange"
              >
                Update
              </Button>
            </View>
          </ViewPager>
      </Layout>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    height: Dimensions.get("window").height,
  },
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  sectionHead: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  uploadImages: {
    justifyContent: "center",
    alignItems: "center",
    height: 500,
  },
  imageWrap: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
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
    alignSelf: "center",
  },
  activeLabels: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 5,
    color: "#3d4b7cc4",
    fontWeight:"bold"
  },
  borderedText: {
    backgroundColor: "#e5e5e5",
    padding: 8,
    marginBottom: 20,
    elevation: 1,
    borderRadius: 5,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  button:{
    marginHorizontal:20,
  }
});
