/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Card,
  Toggle,
  TopNavigationAction,
  Input,
} from "@ui-kitten/components";
// import {Camera, CameraType} from 'expo-camera';
import { getLocation, getUser } from "./context/async-storage";
import { useIsFocused } from "@react-navigation/native";
// import {fetchRecords, postMethod, fileUploadMethod} from './commons/Services';
import { useAuthorization } from "./context/AuthProvider";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { SaveIcon } from "./commons/Icons";
import { APIURL, axiosPost } from "./commons/Save";
import axios from "axios";
import { Button } from "react-native-paper";

// import ImagePicker from 'react-native-image-crop-picker';
// const BackIcon = props => <Icon {...props} name="arrow-back" />;
// const PlusIcon = props => <Icon {...props} name="plus-outline" />;
// const SaveIcon = props => <Icon {...props} name="save-outline" />;
const useToggleState = (initialState = false) => {
  const [checked, setChecked] = React.useState(initialState);

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  return { checked, onChange: onCheckedChange };
};

export const CreateImageSetsScreen = ({ navigation }) => {
  const initialImagesetState = {
    countryid: 0,
    stateid: "",
    city: "",
    categoryid: "",
    typeid: "",
    caption: "",
    pricetype: "",
    price: "",
    mls: "",
    virtualtourservice: 1,
    flyerservice: 1,
    videoservice: 1,
    picture: "",
    video: "",
    panorama: "",
  };
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const infoToggleState = useToggleState();
  const primaryToggleState = useToggleState();
  const [userData, setUserData] = React.useState({});
  const [allCountries, setAllCountries] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState(0);
  const [allStates, setAllStates] = React.useState([]);
  const [isvirtualtourservice, setIsvirtualtourservice] = React.useState(true);
  const [isflyerservice, setIsflyerservice] = React.useState(true);
  const [isvideoservice, setIsvideoservice] = React.useState(true);
  const [pictureFiles, setPictureFiles] = React.useState([]);
  const [videoFiles, setVideoFiles] = React.useState([]);
  const [panoramaFiles, setPanoramaFiles] = React.useState([]);
  const [preview, setPreview] = React.useState(false);
  const [previewType, setPreviewType] = React.useState("picture");
  const [loading, setLoading] = React.useState(false);
  // const [type, setType] = React.useState(CameraType.back);
  const {
    control,
    handleSubmit,
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
    resetControls();
  }, [isFocused]);
  React.useEffect(() => {
    if (Object.entries(userData).length > 0) {
      let obj = { agent_id: userData.agent_id };
      axiosPost("get-countries", obj).then((res) => {
        if (res.data[0].response) {
          if (res.data[0].response.status === "success") {
            setAllCountries(res.data[0].response.data);
          }
        }
      });
    }
  }, [userData]);

  React.useEffect(() => {
    if (selectedCountry !== 0) {
      let obj = { country_id: selectedCountry };
      axiosPost("get-states", obj).then((res) => {
        if (res.data[0].response) {
          if (res.data[0].response.status === "success") {
            setAllStates(res.data[0].response.data);
          }
        }
      });
    }
  }, [selectedCountry]);

  const pickVideoAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
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
      var x = videoFiles;
      result.assets.forEach((element) => {
        x.push(element);
      });
      setVideoFiles(x);
    } else {
      alert("You did not select any video.");
    }
  };
  const pickImageAsync = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      if (type === "picture") {
        var x = pictureFiles;
        result.assets.forEach((element) => {
          x.push(element);
        });
        // for (let file of result) {
        // x.push(file);
        // }
        setPictureFiles(x);
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
  const onSubmit = async (data) => {
    setLoading(true);
    data.agent_id = userData.agent_id;
    data.virtualtourservice = isvirtualtourservice ? 1 : 0;
    data.flyerservice = isflyerservice ? 1 : 0;
    data.videoservice = isvideoservice ? 1 : 0;
    const formdt = new FormData();
    Object.keys(data).forEach((key) => formdt.append(key, data[key]));
    for (let file of pictureFiles) {
      var fname = file.uri.replace(/^.*[\\\/]/, "");
      var obj = {
        uri: file.uri,
        name: fname,
        type: "image/*",
      };
      formdt.append("picture[]", obj);
    }
    for (let file of videoFiles) {
      var fname = file.uri.replace(/^.*[\\\/]/, "");
      var obj = {
        uri: file.uri,
        name: fname,
        type: "video/*",
      };
      formdt.append("video[]", obj);
    }
    for (let file of panoramaFiles) {
      var fname = file.uri.replace(/^.*[\\\/]/, "");
      var obj = {
        uri: file.uri,
        name: fname,
        type: "image/*",
      };
      formdt.append("panorama[]", obj);
    }
    formdt.append("authenticate_key", "abcd123XYZ");
    axios({
      method: "post",
      url: APIURL + "agent-save-imageset",
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
            ToastAndroid.show(res.data[0].response.message, ToastAndroid.SHORT);
          } else {
            if (res.data[0].response.data.pictureAry.length > 0) {
              axiosPost(`save-tour-picture`,"","", {
                tourid: res.data[0].response.data.tourid,
                property: res.data[0].response.data.property,
                pictureAry: res.data[0].response.data.pictureAry,
              })
                .then((result) => console.log(result,"result"))
                .catch((err) => {
                  console.log(err,"err");
                });
            }
            if (res.data[0].response.data.panoramaImgAry.length > 0) {
              axiosPost(`save-panarama-image`,"","", {
                tourid: res.data[0].response.data.tourid,
                property: res.data[0].response.data.property,
                panoramaImgAry: res.data[0].response.data.panoramaImgAry,
                imagecapturedatepano:
                  res.data[0].response.data.imagecapturedatepano,
              });
            }
            if (res.data[0].response.data.videoAry.length > 0) {
              axiosPost(
                `save-tour-video`,"","",
                {
                  tourid: res.data[0].response.data.tourid,
                  property: res.data[0].response.data.property,
                  videoAry: res.data[0].response.data.videoAry,
                  post: res.data[0].response.data.post,
                },
                {}
              );
            }
            ToastAndroid.show(res.data[0].response.message, ToastAndroid.SHORT);
            resetControls();
            navigation.navigate("Imagesets");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const resetControls = () => {
    reset(initialImagesetState);
    setPictureFiles([]);
    setVideoFiles([]);
    setPanoramaFiles([]);
    setSelectedCountry([]);
    setIsvirtualtourservice(true);
    setIsflyerservice(true);
    setIsvideoservice(true);
    setPreview(false);
  };
  const onVirtualtourserviceCheckedChange = (isChecked) => {
    setIsvirtualtourservice(isChecked);
  };
  const onFlyerserviceCheckedChange = (isChecked) => {
    setIsflyerservice(isChecked);
  };
  const onVideoserviceCheckedChange = (isChecked) => {
    setIsvideoservice(isChecked);
  };

  const deleteMedia = (type, index) => {
    if (type === "picture") {
      setPictureFiles([
        ...pictureFiles.slice(0, index),
        ...pictureFiles.slice(index + 1, pictureFiles.length),
      ]);
      ToastAndroid.show("Image deleted", ToastAndroid.SHORT);
    }
    if (type === "video") {
      setVideoFiles([
        ...videoFiles.slice(0, index),
        ...videoFiles.slice(index + 1, videoFiles.length),
      ]);
      ToastAndroid.show("Video deleted", ToastAndroid.SHORT);
    }
    if (type === "panorama") {
      setPanoramaFiles([
        ...panoramaFiles.slice(0, index),
        ...panoramaFiles.slice(index + 1, panoramaFiles.length),
      ]);
      ToastAndroid.show("Panorama deleted", ToastAndroid.SHORT);
    }
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
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Create tour
            </Text>
          </View>
          <View style={styles.sectionInfo}>
            <Text category="h6" style={styles.sectionHead}>
              Upload Media
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                right: 5,
                top: 5,
              }}
              // disabled={
              //   videoFiles.length === 0 &&
              //   pictureFiles.length === 0 &&
              //   panoramaFiles.length === 0
              // }
              onPress={() => {
                setPreview(true);
              }}
            >
              <Icon name="eye" style={styles.uploadIcons} fill="#FFA12D" />
              {/* <Text category="s1">Pictures</Text> */}
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImageAsync("picture")}
              >
                <Icon name="image" style={styles.uploadIcons} fill="#FFA12D" />

                <Text category="s1">Pictures</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickVideoAsync()}
              >
                <Icon name="video" style={styles.uploadIcons} fill="#FFA12D" />

                <Text category="s1">Videos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImageAsync("panorama")}
              >
                <Icon name="camera" style={styles.uploadIcons} fill="#FFA12D" />

                <Text category="s1">Panoramas</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sectionInfo}>
            <Text category="h6" style={styles.sectionHead}>
              Property Information
            </Text>
            <View style={styles.formCtrlWrap}>
              <Text style={styles.formLabel}>Country</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    selectedValue={value}
                    label="Country"
                    style={styles.formControl}
                    // itemStyle={{backgroundColor: '#FFFFFF', color: '#000000'}}
                    color="primary"
                    // mode="dropdown"
                    onValueChange={(itemValue, itemIndex) => {
                      onChange(itemValue);
                      setSelectedCountry(itemValue);
                    }}
                  >
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="Select Country"
                      value=""
                    />

                    {allCountries &&
                      allCountries.length > 0 &&
                      allCountries.map((country) => (
                        <Picker.Item
                          style={styles.pickerItemStyle}
                          label={country.name}
                          value={country.id}
                          key={country.id}
                        />
                      ))}
                  </Picker>
                )}
                name="countryid"
                defaultValue=""
              />
            </View>
            {errors.countryid && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.countryid?.message}
              </Text>
            )}
            <View style={styles.formCtrlWrap}>
              <Text style={styles.formLabel}>State</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    themeVariant="light"
                    selectedValue={value}
                    style={styles.formControl}
                    onValueChange={(itemValue, itemIndex) => {
                      onChange(itemValue);
                    }}
                  >
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="Select State"
                      value=""
                    />
                    {allStates &&
                      allStates.length > 0 &&
                      allStates.map((state) => (
                        <Picker.Item
                          style={styles.pickerItemStyle}
                          label={state.name}
                          value={state.id}
                          key={state.id}
                        />
                      ))}
                  </Picker>
                )}
                name="stateid"
                defaultValue=""
              />
            </View>
            {errors.stateid && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.stateid?.message}
              </Text>
            )}
            {/* <Text style={styles.sectionLabels}>City</Text>
            <Text style={styles.sectionData}>Enter City</Text> */}
            <Text style={styles.formLabel}>City</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter City"
                  style={styles.formControl}
                  textStyle={styles.textInputStyle}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    onChange(value);
                  }}
                  value={value}
                  size="large"
                />
              )}
              name="city"
              defaultValue=""
            />
            {errors.city && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.city?.message}
              </Text>
            )}
            <View style={styles.formCtrlWrap}>
              <Text style={styles.formLabel}>Status</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    themeVariant="light"
                    selectedValue={value}
                    style={styles.formControl}
                    onValueChange={(itemValue, itemIndex) => {
                      onChange(itemValue);
                    }}
                  >
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="Select Status"
                      value=""
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="1"
                      label="For Sale"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="2"
                      label="For Rent"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="3"
                      label="Sold"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="4"
                      label="Contingent"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="5"
                      label="Pending"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="6"
                      label="Withdrawn"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="7"
                      label="Community"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="8"
                      label="Miscellaneous"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="9"
                      label="Personal"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="10"
                      label="Coming Soon"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="11"
                      label="Draft"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="12"
                      label="For Lease"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="13"
                      label="For-Sale-By-Owner"
                    />
                  </Picker>
                )}
                name="categoryid"
                defaultValue=""
              />
            </View>
            {errors.categoryid && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.categoryid?.message}
              </Text>
            )}
            <View style={styles.formCtrlWrap}>
              <Text style={styles.formLabel}>Property Type</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    themeVariant="light"
                    selectedValue={value}
                    style={styles.formControl}
                    onValueChange={(itemValue, itemIndex) => {
                      onChange(itemValue);
                    }}
                  >
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="Select Property Type"
                      value=""
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="1"
                      label="Single Family Home"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="2"
                      label="Condo"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="3"
                      label="Townhouse"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="4"
                      label="Coop"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="5"
                      label="Apartment"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="6"
                      label="Loft"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="7"
                      label="Mobile/Manufactured"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="8"
                      label="Farm/Ranch"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="9"
                      label="Multi-Family"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="10"
                      label="Income/Investment"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="11"
                      label="Houseboat"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="12"
                      label="Commercial Lot/Land"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="13"
                      label="Not Applicable"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="14"
                      label="Commercial"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="15"
                      label="Duet"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="16"
                      label="Duplex"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="17"
                      label="Triplex"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      value="18"
                      label="Commercial Rental"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="19"
                      value="Residential Lot/Land"
                    />
                  </Picker>
                )}
                name="typeid"
                defaultValue=""
              />
            </View>
            {errors.typeid && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.typeid?.message}
              </Text>
            )}
            <Text style={styles.formLabel}>Caption/Title</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter Caption/Title"
                  // label="Caption/Title"
                  style={styles.formControl}
                  textStyle={styles.textInputStyle}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  size="large"
                />
              )}
              name="caption"
              rules={{
                required: { value: true, message: "Caption is required" },
              }}
              defaultValue=""
            />
            {errors.caption && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.caption?.message}
              </Text>
            )}
            <View style={styles.formCtrlWrap}>
              <Text style={styles.formLabel}>Currency</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    themeVariant="light"
                    selectedValue={value}
                    style={styles.formControl}
                    onValueChange={(itemValue, itemIndex) => {
                      onChange(itemValue);
                    }}
                  >
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="Select Currency"
                      value=""
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="USD"
                      value="USD"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="CAD"
                      value="CAD"
                    />
                    <Picker.Item
                      style={styles.pickerItemStyle}
                      label="EUR"
                      value="EUR"
                    />
                  </Picker>
                )}
                name="pricetype"
                defaultValue=""
              />
            </View>
            {errors.pricetype && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.pricetype?.message}
              </Text>
            )}
            <Text style={styles.formLabel}>Price</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter Price"
                  // label="Price"
                  style={styles.formControl}
                  textStyle={styles.textInputStyle}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  size="large"
                  keyboardType="number-pad"
                />
              )}
              name="price"
              defaultValue=""
            />
            {errors.price && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.price?.message}
              </Text>
            )}
            <Text style={styles.formLabel}>MLS</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter MLS"
                  // label="MLS"
                  style={styles.formControl}
                  textStyle={styles.textInputStyle}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  size="large"
                />
              )}
              name="mls"
              defaultValue=""
            />
            {errors.mls && (
              <Text style={styles.errorMsg} status="danger">
                {errors?.mls?.message}
              </Text>
            )}
          </View>
          <View style={styles.sectionInfo}>
            <Text category="h6" style={styles.sectionHead}>
              Services
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text style={{ fontSize: 18, color: "#555555" }}>Tour</Text>
                <Toggle
                  style={styles.toggle}
                  status="primary"
                  onChange={onVirtualtourserviceCheckedChange}
                  checked={isvirtualtourservice}
                />
              </View>

              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text style={{ fontSize: 18, color: "#555555" }}>Flyer</Text>
                <Toggle
                  style={styles.toggle}
                  status="info"
                  onChange={onFlyerserviceCheckedChange}
                  checked={isflyerservice}
                />
              </View>
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text style={{ fontSize: 18, color: "#555555" }}>Video</Text>
                <Toggle
                  style={styles.toggle}
                  status="success"
                  onChange={onVideoserviceCheckedChange}
                  checked={isvideoservice}
                />
              </View>
            </View>
          </View>
          <Button
            style={{ margin: 20 }}
            disabled={loading}
            buttonColor="orange"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? "Please wait. ." : "Submit"}
          </Button>
        </Layout>
      </ScrollView>
      <Modal
        useNativeDriver={true}
        animationType="slide"
        transparent={true}
        visible={preview}
        onRequestClose={() => {
          setPreview(!preview);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                right: 5,
                top: 5,
              }}
              onPress={() => setPreview(false)}
            >
              <Icon name="close" style={styles.uploadIcons} fill="#FFA12D" />

              {/* <Text category="s1">Pictures</Text> */}
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                borderBottomColor: "#e5e5e5",
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={styles.previewbtn}
                onPress={() => setPreviewType("picture")}
              >
                <Icon name="image" style={styles.uploadIcons} fill="#FFA12D" />

                <Text category="s1">Pictures</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.previewbtn}
                onPress={() => setPreviewType("video")}
              >
                <Icon name="video" style={styles.uploadIcons} fill="#FFA12D" />

                <Text category="s1">Videos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.previewbtn}
                onPress={() => setPreviewType("panorama")}
              >
                <Icon name="camera" style={styles.uploadIcons} fill="#FFA12D" />

                <Text category="s1">Panorama</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {previewType === "picture" &&
                pictureFiles.length > 0 &&
                pictureFiles.map((pf, i) => (
                  <View key={i}>
                    <ImageBackground
                      source={{ uri: pf.uri }}
                      style={{
                        width: 80,
                        height: 80,
                        resizeMode: "contain",
                        marginRight: 15,
                      }}
                    >
                      {/* {<Text>{pf.size}</Text>} */}
                    </ImageBackground>
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                      }}
                      onPress={() => deleteMedia("picture", i)}
                    >
                      <Icon
                        name="trash"
                        style={styles.uploadIcons}
                        fill="#FD8A8A"
                      />

                      {/* <Text category="s1">Pictures</Text> */}
                    </TouchableOpacity>
                  </View>
                ))}
              {previewType === "video" &&
                videoFiles.length > 0 &&
                videoFiles.map((pf, i) => (
                  <View key={i}>
                    <ImageBackground
                      source={{ uri: pf.uri }}
                      style={{
                        width: 80,
                        height: 80,
                        resizeMode: "contain",
                        marginRight: 15,
                      }}
                    >
                      {/* {<Text>{pf.size}</Text>} */}
                    </ImageBackground>
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                      }}
                      onPress={() => deleteMedia("video", i)}
                    >
                      <Icon
                        name="trash"
                        style={styles.uploadIcons}
                        fill="#FD8A8A"
                      />

                      {/* <Text category="s1">Pictures</Text> */}
                    </TouchableOpacity>
                  </View>
                ))}
              {previewType === "panorama" &&
                panoramaFiles.length > 0 &&
                panoramaFiles.map((pf, i) => (
                  <View key={i}>
                    <ImageBackground
                      source={{ uri: pf.uri }}
                      style={{
                        width: 80,
                        height: 80,
                        resizeMode: "contain",
                        marginRight: 15,
                      }}
                    >
                      {/* {<Text>{pf.size}</Text>} */}
                    </ImageBackground>
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                      }}
                      onPress={() => deleteMedia("panorama", i)}
                    >
                      <Icon
                        name="trash"
                        style={styles.uploadIcons}
                        fill="#FD8A8A"
                      />

                      {/* <Text category="s1">Pictures</Text> */}
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFFDE",
    paddingBottom: 100,
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
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
  },
  toggle: {
    marginTop: 10,
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
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 10,
  },
  sectionHead: {
    color: "gray",
    fontSize: 18,
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
    borderRadius: 15,
    marginVertical: 10,
    width: "30%",
  },
  formControl: {
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  formCtrlWrap: {
    marginTop: 10,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    padding: 0,
  },
  textInputStyle: {
    // color: 'white',
  },
  formLabel: {
    color: "#rgba(0,0,0,0.3)",
    marginBottom: 0,
    marginTop: 20,
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  previewbtn: {
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    width: 90,
    padding: 5,
    borderRadius: 5,
  },
  pickerItemStyle: { backgroundColor: "#FFF", color: "#000" },
});
