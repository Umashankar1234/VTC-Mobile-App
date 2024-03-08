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
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Icon, Layout, Text, Input } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { getLocation, getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fetchRecords, postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const LocationInfoScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);

  const [userData, setUserData] = React.useState({});
  const [allCountries, setAllCountries] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState(0);
  const [allStates, setAllStates] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [refresh, setRefresh] = React.useState(true);
  const [locationData, setLocationData] = React.useState(null);
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
    let componentMounted = true;
    if (Object.entries(userData).length > 0) {
      let obj = { agent_id: userData.agent_id };
      postMethod("get-countries", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setAllCountries(res[0].response.data);
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [userData, locationData]);

  React.useEffect(() => {
    let componentMounted = true;
    if (selectedCountry !== 0) {
      let obj = { country_id: selectedCountry };
      postMethod("get-states", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setAllStates(res[0].response.data);
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [selectedCountry]);
  React.useEffect(() => {
    let componentMounted = true;
    if (
      Object.entries(userData).length > 0 &&
      refresh &&
      allCountries.length > 0
    ) {
      let obj = {
        agent_id: userData.agent_id,
        tourId: tourid,
        type: "imageset",
      };
      postMethod("edit-property", obj).then((res) => {
        setFetching(false);
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(false);
            let agObj = res[0].response.data.toData;
            setLocationData(agObj);
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
  }, [userData, isFocused, tourid, refresh, allCountries, allStates]);
  const onSubmit = (data) => {
    setLoading(true);
    data.agent_id = userData.agent_id;
    data.tourid = tourid;
    data.tab_index = "4";
    postMethod("update-property-info", data).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          setLoading(false);
          // resetControls();
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
      {fetching ? (
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
      ) : (
        <ScrollView>
          <Layout style={styles.container}>
            <View style={styles.headingWrap}>
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Icon
                    name="navigation-2-outline"
                    style={styles.tabButton}
                    fill="#FFA12D"
                  />
                  <Text
                    category="h6"
                    status="warning"
                    style={styles.pageHeading}
                  >
                    Location information
                  </Text>
                </View>
                <Text
                  category="c2"
                  appearance="hint"
                  style={{ marginLeft: 45 }}
                >
                  Property Information
                </Text>
              </View>
            </View>
            <View style={styles.formWrapTab} level="2">
              <View style={styles.formWrapCard}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="ADDRESS"
                      label="ADDRESS"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="address"
                  rules={{
                    required: { value: true, message: "Address is required" },
                  }}
                />
                {errors.address && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.address?.message}
                  </Text>
                )}
                <View style={styles.selectContainer}>
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
                          value=""
                          label="Select Property Type"
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
                          value="19"
                          label="Residential Lot/Land"
                        />
                      </Picker>
                    )}
                    name="typeid"
                    rules={{
                      required: {
                        value: true,
                        message: "Property Type is required",
                      },
                    }}
                  />
                </View>
                {errors.typeid && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.typeid?.message}
                  </Text>
                )}
                <View style={styles.selectContainer}>
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
                    rules={{
                      required: { value: true, message: "Status is required" },
                    }}
                  />
                </View>
                {errors.categoryid && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.categoryid?.message}
                  </Text>
                )}
                <View style={styles.selectContainer}>
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
                    rules={{
                      required: { value: true, message: "Country is required" },
                    }}
                    defaultValue=""
                  />
                </View>
                {errors.countryid && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.countryid?.message}
                  </Text>
                )}
                <View style={styles.selectContainer}>
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
                      onChangeText={(value) => {
                        onChange(value);
                      }}
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
                      placeholder="Zipcode"
                      label="Zipcode"
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
                      placeholder="Neighbourhood"
                      label="Neighbourhood"
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
                  name="neighbourhood"
                  rules={{
                    required: {
                      value: true,
                      message: "Neighbourhood is required",
                    },
                  }}
                  defaultValue=""
                />
                {errors.neighbourhood && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.neighbourhood?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Latitude"
                      label="Latitude"
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
                  name="latitude"
                  rules={{
                    required: { value: true, message: "Latitude is required" },
                  }}
                  defaultValue=""
                />
                {errors.latitude && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.latitude?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Longitude"
                      label="Longitude"
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
                  name="longitude"
                  rules={{
                    required: { value: true, message: "Longitude is required" },
                  }}
                  defaultValue=""
                />
                {errors.longitude && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.longitude?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Area Schools Link"
                      label="Area Schools Link"
                      style={styles.formControl}
                      // multiline={true}
                      // textStyle={{minHeight: 64}}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="areaschoolslink"
                  // rules={{
                  //   required: {value: true, message: 'Area Schools Link is required'},
                  // }}
                />
                {errors.areaschoolslink && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.areaschoolslink?.message}
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
                  disabled={loading}
                  loading={loading}
                  accessoryLeft={
                    loading ? (
                      <ActivityIndicator size="small" color="#FFA12D" />
                    ) : (
                      ""
                    )
                  }
                >
                  Update
                </Button>
              </View>
            </View>
          </Layout>
        </ScrollView>
      )}
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
  selectContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#ddddddd2",
  },
});
