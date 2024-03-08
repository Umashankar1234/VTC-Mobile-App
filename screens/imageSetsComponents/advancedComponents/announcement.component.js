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
} from "react-native";
import { Icon, Layout, Text, Button } from "@ui-kitten/components";
import { useForm } from "react-hook-form";
import { getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { getTimeAMPMFormat, postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import DatePicker from "react-native-date-picker";
// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const AnnouncementScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [timeFrom, setTimeFrom] = React.useState(new Date());
  const [fromOpen, setFromOpen] = React.useState(false);
  const [timeTo, setTimeTo] = React.useState(new Date());
  const [announcementData, setAnnouncementData] = React.useState([]);
  const [toOpen, setToOpen] = React.useState(false);
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
    let componentMounted = true;
    if (Object.entries(userData).length > 0 && refresh) {
      let obj = { agent_id: userData.agent_id, tourid: tourid };
      postMethod("load-announcement", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(false);
            setAnnouncementData(res[0].response.data);
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [userData, isFocused, tourid, refresh]);
  const onSubmit = () => {
    setLoading(true);
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    var ftime = timeFrom.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    var ttime = timeTo.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    var obj = {
      announcedate: dateString,
      fromtime_h: ftime,
      totime_h: ttime,
      agent_id: userData.agent_id,
      tourid: tourid,
    };
    postMethod("save-announcement", obj).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          setLoading(false);
          setRefresh(true);
          setDate(new Date());
          setTimeFrom(new Date());
          setTimeTo(new Date());
        }
      }
    });
  };
  const deleteAnnouncement = (aid) => {
    var obj = {
      agent_id: userData.agent_id,
      tourid: tourid,
      id: aid,
    };
    postMethod("delete-announcement", obj).then((res) => {
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
                  name="radio-outline"
                  style={styles.tabButton}
                  fill="#FFA12D"
                />
                <Text category="h6" status="warning" style={styles.pageHeading}>
                  Open House Announcements
                </Text>
              </View>
              <Text category="c2" appearance="hint" style={{ marginLeft: 45 }}>
                Advanced
              </Text>
            </View>
          </View>
          <View style={styles.formWrapTab} level="2">
            <View style={styles.formWrapCard}>
              <Text
                category="h5"
                style={{ marginBottom: 10, color: "#adadad" }}
              >
                Create Announcement
              </Text>
              <Text category="p2" style={{ color: "#adadad" }}>
                Select Date
              </Text>
              <Button
                onPress={() => setOpen(true)}
                status="basic"
                appearance="outline"
              >
                {date.toDateString()}
              </Button>
              <DatePicker
                mode="date"
                date={date}
                open={open}
                modal
                theme="light"
                textColor="#000000"
                onConfirm={(date) => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              <Text category="p2" style={{ color: "#adadad", marginTop: 15 }}>
                From
              </Text>
              <Button
                onPress={() => setFromOpen(true)}
                status="basic"
                appearance="outline"
              >
                {getTimeAMPMFormat(timeFrom)}
                {/* {timeFrom.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })} */}
              </Button>
              <DatePicker
                mode="time"
                date={timeFrom}
                open={fromOpen}
                modal
                theme="light"
                textColor="#000000"
                onConfirm={(date) => {
                  setFromOpen(false);
                  setTimeFrom(date);
                }}
                onCancel={() => {
                  setFromOpen(false);
                }}
              />
              <Text category="p2" style={{ color: "#adadad", marginTop: 15 }}>
                To
              </Text>
              <Button
                onPress={() => setToOpen(true)}
                status="basic"
                appearance="outline"
              >
                {getTimeAMPMFormat(timeTo)}
                {/* {timeFrom.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })} */}
              </Button>
              <DatePicker
                mode="time"
                date={timeTo}
                open={toOpen}
                modal
                theme="light"
                textColor="#000000"
                onConfirm={(date) => {
                  setToOpen(false);
                  setTimeTo(date);
                }}
                onCancel={() => {
                  setToOpen(false);
                }}
              />
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
              <Button
                style={styles.saveButton}
                size="large"
                appearance="outline"
                onPress={onSubmit}
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
              <Text
                category="h5"
                style={{ marginTop: 20, marginBottom: 10, color: "#adadad" }}
              >
                Announcements
              </Text>
              {announcementData &&
                announcementData.length > 0 &&
                announcementData.map((ad, i) => (
                  <View
                    key={ad.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: "#adadad",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <View>
                      <Text>Announcement Date : {ad.announcedate}</Text>
                      <Text>
                        From : {ad.fromtime} {ad.fromampm}
                      </Text>
                      <Text>
                        To : {ad.totime} {ad.toampm}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.buttonWrap}
                      onPress={() => deleteAnnouncement(ad.id)}
                    >
                      <Icon
                        name="trash-2"
                        style={styles.actionButton}
                        fill="#FFA12D"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
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
  buttonWrap: { position: "absolute", right: -10, top: -18 },
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
});
