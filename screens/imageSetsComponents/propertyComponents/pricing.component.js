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
import { getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const PricingScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);

  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
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
  const initialPricingState = {
    pricetype: "",
    price: "",
    priceflexibility: "",
    priceinfo: "",
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
    let componentMounted = true;
    if (Object.entries(userData).length > 0 && refresh) {
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
    data.agent_id = userData.agent_id;
    data.tourid = tourid;
    data.tab_index = "3";
    postMethod("update-property-info", data).then((res) => {
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
    reset(initialPricingState);
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
                    name="credit-card-outline"
                    style={styles.tabButton}
                    fill="#FFA12D"
                  />
                  <Text
                    category="h6"
                    status="warning"
                    style={styles.pageHeading}
                  >
                    Pricing
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
              <Text style={styles.caption}>Currency</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.pickerContainer}>
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
                    </View>
                  )}
                  name="pricetype"
                  rules={{
                    required: {
                      value: true,
                      message: "Price Type is required",
                    },
                  }}
                />
                {errors.pricetype && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.pricetype?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Price"
                      label="Price"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="price"
                  rules={{
                    required: { value: true, message: "Price is required" },
                  }}
                />
                {errors.price && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.price?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.pickerContainer}>
                    <Text style={styles.caption}>Flexibility</Text>
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
                          label="Select Flexibility"
                          value=""
                        />
                        <Picker.Item
                          style={styles.pickerItemStyle}
                          label="FIRM"
                          value="FIRM"
                        />
                        <Picker.Item
                          style={styles.pickerItemStyle}
                          label="Negotiable"
                          value="Negotiable"
                        />
                      </Picker>
                    </View>
                  )}
                  name="priceflexibility"
                  rules={{
                    required: {
                      value: true,
                      message: "Price Flexibility is required",
                    },
                  }}
                />
                {errors.priceflexibility && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.priceflexibility?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Additional Price Information"
                      label="Additional Price Information"
                      style={styles.formControl}
                      onBlur={onBlur}
                      multiline={true}
                      textStyle={{ minHeight: 64 }}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="priceinfo"
                  rules={{
                    required: {
                      value: true,
                      message: "Price info is required",
                    },
                  }}
                />
                {errors.priceinfo && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.priceinfo?.message}
                  </Text>
                )}
                <Text style={styles.errorMsg} status={saveResult.color}>
                  {saveResult.message}
                </Text>
                <Button
                  style={styles.saveButton}
                  size="large"
                  mode="contained"
                  appearance="outline"
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
    // marginVertical:0,
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
  pickerContainer: { borderBottomColor: "#c4c4c4ff", borderBottomWidth: 1 },
  caption: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "bold",
    color: "#9294a5",
  },
});
