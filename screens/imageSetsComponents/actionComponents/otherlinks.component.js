/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useMemo,useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  ToastAndroid,
  Image,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  Toggle,
  Input,
} from "@ui-kitten/components";

import { useForm, Controller } from "react-hook-form";
import { getLocation, getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fetchRecords, postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
import { ActivityIndicator, Button } from "react-native-paper";
import { axiosPost } from "../../commons/Save";
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const OtherLinksScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [fetching, setFetching] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [isMyCafeGallery, setIsMyCafeGallery] = React.useState(false);
  const [otherLinks, setOtherLinks] = React.useState({});
  const [otherLink, setOtherLink] = React.useState({});
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
    if (Object.entries(userData).length > 0 && tourid) {
      setFetching(true);
      let obj = { agent_id: userData.agent_id, tourId: tourid };
      axiosPost("tourotherlink", obj)
        .then((res) => {
          if (res.data[0].response) {
            setFetching(false);

            if (res.data[0].response.status === "success") {
              setRefresh(false);
              setOtherLinks(res.data[0].response.data);
            }
          }
        })
        .catch((err) => {
          setFetching(false);
        });
    }
  }, [userData, isFocused, tourid, refresh]);
  const onSubmit = (data) => {
    setLoading(true);
    data.tourId = tourid;
    data.agent_id = userData.agent_id;
    data.service_link = otherLinks.mis_link.service_link;
    data.myCafeGallery_unbranded_link =
      otherLinks.mis_link.myCafeGallery_unbranded_link;
    data.myCafeGallery_branded_link =
      otherLinks.mis_link.myCafeGallery_branded_link;
    postMethod("other-link-send-email", data).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          setLoading(false);
        } else {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          setLoading(false);
          setRefresh(true);
        }
      }
    });
  };
  const onCafeGalleryCheckedChange = (isChecked) => {
    setIsMyCafeGallery(isChecked);
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
                  name="external-link-outline"
                  style={styles.tabButton}
                  fill="#FFA12D"
                />
                <Text category="h6" status="warning" style={styles.pageHeading}>
                  Other Links
                </Text>
              </View>
              <Text category="c2" appearance="hint" style={{ marginLeft: 45 }}>
                Actions
              </Text>
            </View>
          </View>
          {fetching ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.formWrapTab} level="2">
              <View style={styles.formWrapCard}>
                <Text category="s1" style={{ marginBottom: 10 }}>
                  QR Codes
                </Text>
                <Text category="s2" style={{ marginRight: 20 }}>
                  MyCafeGallery
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  {otherLinks &&
                  otherLinks.qr_code &&
                  otherLinks.qr_code &&
                  otherLinks.qr_code.mycafe_image_link ? (
                    <Image
                      source={{ uri: otherLinks.qr_code.mycafe_image_link }}
                      style={styles.qrCode}
                    />
                  ) : (
                    ""
                  )}

                  <Toggle
                    style={styles.toggle}
                    status="primary"
                    onChange={onCafeGalleryCheckedChange}
                    checked={isMyCafeGallery}
                  />
                </View>
                <Divider style={{ marginVertical: 20 }} />
                <Text category="s1" style={{ marginBottom: 10 }}>
                  Misc Links
                </Text>

                <Text category="s2" style={{ fontWeight: "bold" }}>
                  Service Link:
                </Text>
                <Text
                  category="label"
                  selectable={true}
                  style={{ marginBottom: 20 }}
                >
                  {Object.entries(otherLinks).length > 0 &&
                    otherLinks.mis_link.service_link}
                </Text>

                <Text category="s2" style={{ fontWeight: "bold" }}>
                  MyCafeGallery (Branded):
                </Text>
                <Text category="label" style={{ marginBottom: 20 }}>
                  {Object.entries(otherLinks).length > 0 &&
                    otherLinks.mis_link.myCafeGallery_branded_link}
                </Text>

                <Text category="s2" style={{ fontWeight: "bold" }}>
                  MyCafeGallery (Unbranded):
                </Text>
                <Text category="label" style={{ marginBottom: 20 }}>
                  {Object.entries(otherLinks).length > 0 &&
                    otherLinks.mis_link.myCafeGallery_unbranded_link}
                </Text>
                <Divider style={{ marginVertical: 20 }} />

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      // placeholder="Email"
                      label="Inventory Button"
                      style={styles.formControl}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="inventorybutton"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: "Inventory Button is required",
                  //   },
                  // }}
                />
                {errors.inventorybutton && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.inventorybutton?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      // placeholder="Email"
                      label="Tour Widget"
                      style={styles.formControl}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="tourwidget"
                  // rules={{
                  //   required: { value: true, message: "Tour Widget is required" },
                  // }}
                />
                {errors.tourwidget && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.tourwidget?.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      // placeholder="Email"
                      label="Embed Code"
                      style={styles.formControl}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="embedcode"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: "Inventory Button is required",
                  //   },
                  // }}
                />
                {errors.embedcode && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.embedcode?.message}
                  </Text>
                )}
                <Divider style={{ marginVertical: 20 }} />
                <Text category="s1" style={{ marginBottom: 10 }}>
                  Email Links
                </Text>
                <Text category="c2">
                  You could enter multiple email addresses separated by comma.
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      // placeholder="Email"
                      label="Email"
                      style={styles.formControl}
                      multiline={true}
                      textStyle={{ minHeight: 64 }}
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
                />
                {errors.email && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.email?.message}
                  </Text>
                )}
                <Text style={styles.errorMsg} status={saveResult.color}>
                  {saveResult.message}
                </Text>
                <Button
                  style={styles.saveButton}
                  size="large"
                  mode="contained"
                  buttonColor="orange"
                  appearance="outline"
                  onPress={handleSubmit(onSubmit)}
                  // loading={loading}
                  // disabled={loading}
                >
                  Update
                </Button>
              </View>
            </View>
          )}
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
  qrCode: {
    height: 100,
    width: 100,
  },
});
