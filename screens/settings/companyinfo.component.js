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
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Card,
  Button,
  Tab,
  TabBar,
  ViewPager,
  Input,
  Spinner,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod, fileUploadMethod } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import ImagePicker from 'react-native-image-crop-picker';
import { useAuthorization } from "../context/AuthProvider";
import DropDownPicker from "react-native-dropdown-picker";
import { useForm, Controller } from "react-hook-form";
import {
  faInfoCircle,
  faCamera,
  faAddressCard,
  faImages,
  faIdCardAlt,
  faSdCard,
  faSave,
  faSlidersH,
  faImage,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";

const CameraIcon = (props) => (
  <FontAwesomeIcon icon={faCamera} size={25} color={"#FFA12D"} />
);

const InfoIcon = (props) => (
  <FontAwesomeIcon icon={faSlidersH} size={25} color={"#FFA12D"} />
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
export const CompanyInfoScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const initialCompanydata = {
    agent_id: "",
    countryid: "",
    stateid: "",
    company: "",
    address: "",
    city: "",
    zipcode: "",
    officephone: "",
    fax: "",
    website: "",
  };
  const [userData, setUserData] = React.useState({});
  const [countries, setCountries] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const [countryOpen, setCountryOpen] = React.useState(false);
  const [states, setStates] = React.useState([]);
  const [selectedState, setSelectedState] = React.useState(null);
  const [stateOpen, setStateOpen] = React.useState(false);
  const [companyinfo, setCompanyInfo] = React.useState(initialCompanydata);
  const [loading, setLoading] = React.useState(false);
  const [companyLogoImage, setCompanyLogoImage] = React.useState("");
  const [companyBannerImage, setCompanyBannerImage] = React.useState("");
  const [compImgIncCounter, setCompImgIncCounter] = React.useState(0);
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });

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
    let obj = { agent_id: userData.agent_id };
    postMethod("get-countries", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          let cdata = [];
          res[0].response.data.forEach((x) => {
            cdata.push({ label: x.name, value: x.id });
          });
          setCountries(cdata);
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  React.useEffect(() => {
    // const displayValue = countries[selectedIndex.row];
    let componentMounted = true;
    let obj = { agent_id: userData.agent_id, country_id: selectedCountry };
    selectedCountry &&
      postMethod("get-states", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            let cdata = [];
            res[0].response.data.forEach((x) => {
              cdata.push({ label: x.name, value: x.id });
            });
            setStates(cdata);
          }
        }
      });
    return () => {
      componentMounted = false;
    };
  }, [selectedCountry, userData]);
  React.useEffect(() => {
    let componentMounted = true;
    let obj = { agent_id: userData.agent_id };
    postMethod("agent-company-info-details", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          setCompanyInfo(res[0].response.data);
          setCompanyBannerImage(res[0].response.data.companybanner);
          setCompanyLogoImage(res[0].response.data.companylogo);
          let agObj = res[0].response.data;
          for (const [key, value] of Object.entries(agObj)) {
            let val = "";
            if (!`${value}` || `${value}` !== "null") {
              val = `${value}`;
            }

            if (`${key}` !== "countryid" || `${key}` !== "stateid") {
              setValue(`${key}`, val);
            } else {
              setSelectedCountry(res[0].response.data.countryid.toString());
              setSelectedState(res[0].response.data.stateid.toString());
            }
          }
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);

  const handleImagePickerLogo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      uploadCompanyImage(result.assets[0], "logoImageName");
    } else {
      alert("You did not select any video.");
    }
  };
  const handleCameraPickerLogo =async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      uploadCompanyImage(result.assets[0], "logoImageName");
    } else {
      alert("You did not select any video.");
    }  
  };
  const handleImagePickerBanner = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      uploadCompanyImage(result.assets[0], "bannerImageName");
    } else {
      alert("You did not select any video.");
    }
  };
  const handleCameraPickerBanner =async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      uploadCompanyImage(result.assets[0], "bannerImageName");
    } else {
      alert("You did not select any video.");
    }
  };
  const uploadCompanyImage = (image, imgType) => {
    var filename = image.uri.replace(/^.*[\\\/]/, "");
    const formdt = new FormData();
    formdt.append(imgType, {
      uri: image.uri,
      name: filename,
      type: "image/*",
    });
    formdt.append("agent_id", userData.agent_id);
    formdt.append("authenticate_key", "abcd123XYZ");
    fileUploadMethod("agent-company-information-upload-imgupdate", formdt).then(
      (res) => {
        if (res.length > 0) {
          if (res[0].response.status === "error") {
            setSaveResult({
              message: res[0].response.message,
              color: "danger",
            });
          } else {
            setCompanyLogoImage(res[0].response.data.logoImageUrl);
            setCompanyBannerImage(res[0].response.data.bannerImageUrl);
            setCompImgIncCounter(compImgIncCounter + 1);
            setSaveResult({
              message: res[0].response.message,
              color: "success",
            });
          }
        }
      }
    );
  };
  const onSubmit = (data) => {
    setLoading(true);
    data.agent_id = userData.agent_id;
    data.countryid = selectedCountry;
    data.stateid = selectedState;
    postMethod("agent-company-information-update", data).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          setSaveResult({
            message: res[0].response.message || "error",
            color: "danger",
          });
        } else {
          setSaveResult({
            message: res[0].response.message || "Saved Successfully",
            color: "success",
          });
        }
        setLoading(false);
      }
    });
  };
  const onCountryOpen = React.useCallback(() => {
    setStateOpen(false);
  }, []);
  const onStateOpen = React.useCallback(() => {
    setCountryOpen(false);
  }, []);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 100}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            nestedScrollEnabled={true}
          >
            <View style={styles.headingWrap}>
              <FontAwesomeIcon
                icon={faInfoCircle}
                size={20}
                color={"#adadad"}
              />
              <Text category="h6" status="warning" style={styles.pageHeading}>
                Company Information
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
              <Tab title="Company Information" icon={InfoIcon} />
            </TabBar>
            <ViewPager
              selectedIndex={selectedIndex}
              onSelect={(index) => setSelectedIndex(index)}
            >
              <View style={styles.uploadImages} level="2">
                <View style={styles.uploadSection}>
                  <Text status="basic" category="s1">
                    Upload Company Logo
                  </Text>
                  <View style={styles.imageWrap}>
                    {companyLogoImage === "" ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        size={100}
                        color={"#e5e5e5"}
                      />
                    ) : (
                      <Image
                        key={companyLogoImage + compImgIncCounter}
                        source={{
                          uri:
                            companyLogoImage + "?random=" + compImgIncCounter,
                        }}
                        style={styles.profileImage}
                      />
                    )}
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Button
                      style={styles.button}
                      appearance="ghost"
                      status="danger"
                      accessoryLeft={CameraIcon}
                      onPress={handleCameraPickerLogo}
                    />
                    <Button
                      style={styles.button}
                      appearance="ghost"
                      status="danger"
                      accessoryLeft={SDCardIcon}
                      onPress={handleImagePickerLogo}
                    />
                  </View>
                </View>
                <Text style={styles.errorMsg} status={saveResult.color}>
                  {saveResult.message}
                </Text>
                <View style={styles.uploadSection}>
                  <Text status="basic" category="s1">
                    Upload Company Banner
                  </Text>
                  <View style={styles.imageWrapBanner}>
                    {companyBannerImage === "" ? (
                      <FontAwesomeIcon
                        icon={faImage}
                        size={100}
                        color={"#e5e5e5"}
                      />
                    ) : (
                      <Image
                        key={companyBannerImage + compImgIncCounter}
                        source={{
                          uri:
                            companyBannerImage + "?random=" + compImgIncCounter,
                        }}
                        style={styles.bannerImage}
                      />
                    )}
                    {/* <FontAwesomeIcon
                      icon={faImage}
                      size={100}
                      color={'#e5e5e5'}
                    /> */}
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Button
                      style={styles.button}
                      appearance="ghost"
                      status="danger"
                      accessoryLeft={CameraIcon}
                      onPress={handleCameraPickerBanner}
                    />
                    <Button
                      style={styles.button}
                      appearance="ghost"
                      status="danger"
                      accessoryLeft={SDCardIcon}
                      onPress={handleImagePickerBanner}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.formWrapTab} level="2">
                <View>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Company *"
                        label="Company"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="company"
                    rules={{
                      required: {
                        value: true,
                        message: "Company name is required",
                      },
                    }}
                    defaultValue=""
                  />
                  {errors.company && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.company?.message}
                    </Text>
                  )}
                  <View style={{ zIndex: 2001 }}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <>
                          <Text category="s1" style={styles.activeLabels1}>
                            Country
                          </Text>
                          <DropDownPicker
                            dropDownContainerStyle={{
                              backgroundColor: "white",
                              zIndex: 1000,
                              elevation: 1000,
                            }}
                            placeholder="Select a Country"
                            open={countryOpen}
                            onOpen={onCountryOpen}
                            style={styles.formControlDrop}
                            value={selectedCountry}
                            items={countries.length > 0 ? countries : []}
                            setOpen={setCountryOpen}
                            setValue={setSelectedCountry}
                            setItems={setCountries}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                          />
                        </>
                      )}
                      name="countryid"
                      rules={{
                        required: {
                          value: true,
                          message: "Country is required",
                        },
                      }}
                      defaultValue=""
                    />
                  </View>
                  {errors.countryid && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.countryid?.message}
                    </Text>
                  )}
                  <View style={{ zIndex: 2000 }}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <>
                          <Text category="s1" style={styles.activeLabels1}>
                            State
                          </Text>
                          <DropDownPicker
                            dropDownContainerStyle={{
                              backgroundColor: "white",
                              zIndex: 1000,
                              elevation: 1000,
                            }}
                            placeholder="Select a State"
                            onOpen={onStateOpen}
                            open={stateOpen}
                            style={styles.formControlDrop}
                            value={selectedState}
                            items={states.length > 0 ? states : []}
                            setOpen={setStateOpen}
                            setValue={setSelectedState}
                            setItems={setStates}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                          />
                        </>
                      )}
                      name="stateid"
                      rules={{
                        required: { value: true, message: "State is required" },
                      }}
                      defaultValue=""
                    />
                  </View>
                  {errors.stateid && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.stateid?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="City"
                        label="City"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="city"
                    rules={{
                      required: { value: true, message: "City is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.city && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.city?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Zip"
                        label="Zip"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="zipcode"
                    rules={{
                      required: { value: true, message: "Zipcode is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.zipcode && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.zipcode?.message}
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
                      required: { value: true, message: "Phone is required" },
                    }}
                    defaultValue=""
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
                        placeholder="Fax"
                        label="Fax"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="fax"
                    // rules={{
                    //   required: {value: true, message: 'Name is required'},
                    // }}
                    defaultValue=""
                  />
                  {errors.fax && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.fax?.message}
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
                      required: { value: true, message: "Website is required" },
                    }}
                    defaultValue=""
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
                        placeholder="Address"
                        label="Address"
                        style={styles.formControl}
                        textStyle={{ minHeight: 100 }}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        multiline={true}
                      />
                    )}
                    name="address"
                    rules={{
                      required: { value: true, message: "Address is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.address && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.address?.message}
                    </Text>
                  )}
                  <Text style={styles.errorMsg} status={saveResult.color}>
                    {saveResult.message}
                  </Text>
                  <Button
                    style={styles.saveButton}
                    size="large"
                    appearance="outline"
                    onPress={handleSubmit(onSubmit)}
                    accessoryLeft={loading ? LoadingIndicator : SaveIcon}
                  >
                    Update
                  </Button>
                </View>
              </View>
            </ViewPager>
          </ScrollView>
        </KeyboardAvoidingView>
      </Layout>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
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
  uploadSection: {
    elevation: 10,
    padding: 20,
    marginVertical: 20,
    backgroundColor: "#ffffff",
    width: "90%",
    borderRadius: 10,
    alignItems: "center",
  },
  uploadImages: {
    alignItems: "center",
  },
  imageWrap: {
    height: 200,
    width: 200,
    marginTop: 10,
    borderRadius: 100,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  imageWrapBanner: {
    height: 200,
    width: "100%",
    marginTop: 10,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  formWrapTab: {
    padding: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 15,
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
  formControlDrop: {
    marginTop: 10,
    // marginBottom: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5e5",
    marginLeft: 10,
    width: "95%",
    zIndex: 0,
  },
  saveButton: {
    margin: 10,
  },
  activeLabels: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  borderedText: {
    backgroundColor: "#e5e5e5",
    padding: 8,
    marginBottom: 20,
    elevation: 1,
    borderRadius: 5,
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
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  activeLabels1: {
    fontSize: 12,
    marginTop: 20,
    marginLeft: 5,
    color: "#7e89b4c4",
    fontWeight: "bold",
  },
});
