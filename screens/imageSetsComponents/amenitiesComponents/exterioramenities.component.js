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
  Pressable,
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
  Button,
  TopNavigationAction,
  Toggle,
  Input,
} from "@ui-kitten/components";
// import {useForm, Controller} from 'react-hook-form';
import { getLocation, getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fetchRecords, postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
import { FlashList } from "@shopify/flash-list";
import  Toast  from "react-native-toast-message";
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const ExteriorsScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [exteriorAmenities, setExteriorAmenities] = React.useState([]);
  const [newAmenity, setNewAmenity] = React.useState("");
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });
  //   const {
  //     control,
  //     handleSubmit,
  //     setValue,
  //     formState: {errors},
  //     reset,
  //   } = useForm();
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
    let componentMounted = true;
    if (Object.entries(userData).length > 0 && refresh) {
      let obj = { agent_id: userData.agent_id, tourId: tourid };
      postMethod("get-amenities", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(!refresh);
            setExteriorAmenities(res[0].response.data.exterior);
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [userData, isFocused, tourid, refresh]);
  const handleSubmit = () => {
    setLoading(true);
    const checkedData = [];
    const uncheckedData = [];
    exteriorAmenities.forEach((res) => {
      if (res.countamenity === 1) {
        checkedData.push(res.id);
      }
      uncheckedData.push(res.id);
    });
    var obj = {
      agent_id: userData.agent_id,
      tourId: tourid,
      idsArray: checkedData,
      notcheckedArr: uncheckedData,
      type: "3",
    };
    postMethod("update-amenity", obj).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: res[0].response.message,
            position: "top",
            topOffset: "70",
          });     
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: res[0].response.message,
            position: "top",
            topOffset: "70",
          });     
          setLoading(false);
          setRefresh(!refresh);
        }
      }
    });
  };

  const onActiveCheckedChange = (isChecked, index) => {
    let newArr = exteriorAmenities.map((item, i) => {
      if (index === i) {
        return { ...item, countamenity: item.countamenity === 1 ? 0 : 1 };
      } else {
        return item;
      }
    });
    setExteriorAmenities(newArr);
  };
  const removeAmenitiy = (obj) => {
    var data = {
      tourId: tourid,
      agent_id: userData.agent_id,
      amenityId: obj.id,
    };
    postMethod("remove-amenities", data).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          Toast.show({
            type: "error",
            text1: "Error",
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
          setRefresh(!refresh);
        }
      }
    });
  };
  const addNewAmenity = () => {
    if (newAmenity != "") {
      var data = {
        tourId: tourid,
        agent_id: userData.agent_id,
        type: "3",
        amenityname: newAmenity,
      };
      postMethod("save-amenities", data).then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "error") {
            Toast.show({
              type: "error",
              text1: "Error",
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
            setRefresh(!refresh);
            setNewAmenity("");
          }
        }
      });
    } else {
      ToastAndroid.show(
        "Please enter some text in the field",
        ToastAndroid.SHORT
      );
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
      <ScrollView nestedScrollEnabled={true}>
        <Layout style={styles.container}>
          <View style={styles.headingWrap}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Icon
                  name="expand-outline"
                  style={styles.tabButton}
                  fill="#FFA12D"
                />
                <Text category="h6" status="warning" style={styles.pageHeading}>
                  Exterior Amenities
                </Text>
              </View>
              <Text category="c2" appearance="hint" style={{ marginLeft: 45 }}>
                Amenities
              </Text>
            </View>
          </View>
          <View style={styles.formWrapTab} level="2">
            <View style={styles.formWrapCard}>
              {/* <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    placeholder="CAPTION/TITLE"
                    label="CAPTION/TITLE"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="caption"
                rules={{
                  required: {value: true, message: 'Caption is required'},
                }}
              />
              {errors.caption && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.caption?.message}
                </Text>
              )} */}
              <View
                style={{
                  width: "100%",
                  marginTop: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Input
                  placeholder="Enter new Amenity"
                  label="Enter new Amenity"
                  style={styles.formControl}
                  textStyle={styles.textInputStyle}
                  onChangeText={(value) => setNewAmenity(value)}
                  value={newAmenity}
                  size="large"
                />
                <Pressable
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50,
                  }}
                  onPress={addNewAmenity}
                >
                  <Icon
                    name="plus-circle-outline"
                    style={styles.closeIcon}
                    fill="#FFA12D"
                  />
                  <Text style={{ marginLeft: 5 }}>Add New</Text>
                </Pressable>
              </View>

              {exteriorAmenities && exteriorAmenities.length > 0 ? (
                <View
                  style={{
                    height: 400,
                    width: "100%",
                  }}
                >
                  <FlashList
                    data={exteriorAmenities}
                    nestedScrollEnabled
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            width: "100%",
                            marginTop: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Toggle
                            style={styles.toggle}
                            checked={item.countamenity === 1 ? true : false}
                            onChange={(nextValue) =>
                              onActiveCheckedChange(nextValue, index)
                            }
                          >
                            {item.amenityname}
                          </Toggle>
                          {userData.agent_id === item.agentid && (
                            <Pressable
                              // style={styles.modalPressableClose}
                              onPress={() => removeAmenitiy(item)}
                            >
                              <Icon
                                name="trash-outline"
                                style={styles.closeIcon}
                                fill="#FFA12D"
                              />
                            </Pressable>
                          )}
                        </View>
                      );
                    }}
                    estimatedItemSize={8}
                  />
                </View>
              ) : (
                <ActivityIndicator size="small" color="#FFA12D" />
              )}
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
              <Button
                style={styles.saveButton}
                size="large"
                appearance="outline"
                onPress={handleSubmit}
                disabled={loading}
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
    width: 30,
    height: 30,
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
    width: "100%",
    padding: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
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
    alignSelf: "flex-end",
  },
});
