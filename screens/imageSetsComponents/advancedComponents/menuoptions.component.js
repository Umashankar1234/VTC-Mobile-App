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
import { Divider, Icon, Layout, Text, Toggle } from "@ui-kitten/components";
import { useForm } from "react-hook-form";
import { getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
import { Button } from "react-native-paper";

// const SaveIcon = (props) => <Icon {...props} name="save-outline" />;

export const MenuOptionsScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [menuOrders, setMenuOrders] = React.useState([]);
  const [contactMenuData, setContactMenuData] = React.useState([]);
  const [detailMenuData, setDetailMenuData] = React.useState([]);
  const [shareMenuData, setShareMenuData] = React.useState([]);
  const [toolsMenuData, setToolsMenuData] = React.useState([]);
  const [viewerMenuData, setViewerMenuData] = React.useState([]);
  const [checkedMenu, setCheckedMenu] = React.useState([]);
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
      postMethod("load-menuoption", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(false);
            let agObj = res[0].response.data;
            const cont_data = agObj.option.contact;
            const detail_data = agObj.option.detail;
            const share_data = agObj.option.share;
            const tools_data = agObj.option.tools;
            const viewer_data = agObj.option.viewer;
            if (agObj.tourtaborder > 0) {
              var obj = [
                {
                  name: "Virtual Tour",
                  order: agObj.tourtaborder.virtualshow,
                },
                {
                  name: "Youtube",
                  order: agObj.tourtaborder.videos,
                },
                {
                  name: "Gallery",
                  order: agObj.tourtaborder.theatre,
                },
                {
                  name: "Floor Plans",
                  order: agObj.tourtaborder.floorplans,
                },
              ];
              setMenuOrders(obj.sort((a, b) => (a.order > b.order ? 1 : -1)));
            }
            for (var i = 0; i < cont_data.id.length; i++) {
              const obj = {
                id: cont_data.id[i],
                name: cont_data.text[i],
                status: cont_data.status[i],
              };
              setContactMenuData((prevArray) => [...prevArray, obj]);
              // if (cont_data.status[i] === 1) {
              //   setCheckedMenu(checkedMenu => [
              //     ...checkedMenu,
              //     cont_data.id[i],
              //   ]);
              // }
            }
            for (var j = 0; j < detail_data.id.length; j++) {
              const obj = {
                id: detail_data.id[j],
                name: detail_data.text[j],
                status: detail_data.status[j],
              };
              setDetailMenuData((prevArray) => [...prevArray, obj]);
              // if (detail_data.status[j] === 1) {
              //   setCheckedMenu(checkedMenu => [
              //     ...checkedMenu,
              //     detail_data.id[j],
              //   ]);
              // }
            }
            for (var k = 0; k < share_data.id.length; k++) {
              const obj = {
                id: share_data.id[k],
                name: share_data.text[k],
                status: share_data.status[k],
              };
              setShareMenuData((prevArray) => [...prevArray, obj]);
              // if (share_data.status[k] === 1) {
              //   setCheckedMenu(checkedMenu => [
              //     ...checkedMenu,
              //     share_data.id[k],
              //   ]);
              // }
            }
            for (var l = 0; l < tools_data.id.length; l++) {
              const obj = {
                id: tools_data.id[l],
                name: tools_data.text[l],
                status: tools_data.status[l],
              };
              setToolsMenuData((prevArray) => [...prevArray, obj]);
              // if (tools_data.status[l] === 1) {
              //   setCheckedMenu(checkedMenu => [
              //     ...checkedMenu,
              //     tools_data.id[l],
              //   ]);
              // }
            }
            for (var m = 0; m < viewer_data.id.length; m++) {
              const obj = {
                id: viewer_data.id[m],
                name: viewer_data.text[m],
                status: viewer_data.status[m],
              };
              setViewerMenuData((prevArray) => [...prevArray, obj]);
              // if (viewer_data.status[m] === 1) {
              //   setCheckedMenu(checkedMenu => [
              //     ...checkedMenu,
              //     viewer_data.id[m],
              //   ]);
              // }
            }
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
    var checked = [];
    viewerMenuData.forEach((vm) => {
      vm.status === 1 && checked.push(vm.id);
    });
    shareMenuData.forEach((sm) => {
      sm.status === 1 && checked.push(sm.id);
    });
    detailMenuData.forEach((dm) => {
      dm.status === 1 && checked.push(dm.id);
    });
    contactMenuData.forEach((cm) => {
      cm.status === 1 && checked.push(cm.id);
    });
    toolsMenuData.forEach((tm) => {
      tm.status === 1 && checked.push(tm.id);
    });
    const obj = {
      agent_id: userData.agent_id,
      tourid: tourid,
      menu: checked,
      panoramamenu: 5,
    };
    postMethod("update-menu", obj).then((res) => {
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
  const onViewerDataChanged = (nv, index) => {
    let newArr = viewerMenuData.map((item, i) => {
      if (index === i) {
        return { ...item, status: item.status === 1 ? 0 : 1 };
      } else {
        return item;
      }
    });
    setViewerMenuData(newArr);
  };
  const onShareDataChanged = (nv, index) => {
    let newArr = shareMenuData.map((item, i) => {
      if (index === i) {
        return { ...item, status: item.status === 1 ? 0 : 1 };
      } else {
        return item;
      }
    });
    setShareMenuData(newArr);
  };
  const onDetailDataChanged = (nv, index) => {
    let newArr = detailMenuData.map((item, i) => {
      if (index === i) {
        return { ...item, status: item.status === 1 ? 0 : 1 };
      } else {
        return item;
      }
    });
    setDetailMenuData(newArr);
  };
  const onContactDataChanged = (nv, index) => {
    let newArr = contactMenuData.map((item, i) => {
      if (index === i) {
        return { ...item, status: item.status === 1 ? 0 : 1 };
      } else {
        return item;
      }
    });
    setContactMenuData(newArr);
  };
  const onToolsDataChanged = (nv, index) => {
    let newArr = toolsMenuData.map((item, i) => {
      if (index === i) {
        return { ...item, status: item.status === 1 ? 0 : 1 };
      } else {
        return item;
      }
    });
    setToolsMenuData(newArr);
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
                <Text category="h6" status="warning" style={styles.pageHeading}>
                  Menu Options
                </Text>
              </View>
              <Text category="c2" appearance="hint" style={{ marginLeft: 45 }}>
                Advanced
              </Text>
            </View>
          </View>
          <View style={styles.formWrapTab} level="2">
            <View style={styles.formWrapCard}>
              <Text category="h5">Viewer</Text>
              {viewerMenuData && viewerMenuData.length > 0 ? (
                viewerMenuData.map((am, i) => (
                  //   <Text key={i}>{am.amenityname}</Text>
                  <View
                    key={i}
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
                      checked={am.status === 1 ? true : false}
                      onChange={(nextValue) =>
                        onViewerDataChanged(nextValue, i)
                      }
                    >
                      {am.name}
                    </Toggle>
                  </View>
                ))
              ) : (
                <ActivityIndicator />
              )}
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
              <Text category="h5">Share</Text>
              {shareMenuData && shareMenuData.length > 0 ? (
                shareMenuData.map((am, i) => (
                  //   <Text key={i}>{am.amenityname}</Text>
                  <View
                    key={i}
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
                      checked={am.status === 1 ? true : false}
                      onChange={(nextValue) => onShareDataChanged(nextValue, i)}
                    >
                      {am.name}
                    </Toggle>
                  </View>
                ))
              ) : (
                <ActivityIndicator />
              )}
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
              <Text category="h5">Detail</Text>
              {detailMenuData && detailMenuData.length > 0 ? (
                detailMenuData.map((am, i) => (
                  //   <Text key={i}>{am.amenityname}</Text>
                  <View
                    key={i}
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
                      checked={am.status === 1 ? true : false}
                      onChange={(nextValue) =>
                        onDetailDataChanged(nextValue, i)
                      }
                    >
                      {am.name}
                    </Toggle>
                  </View>
                ))
              ) : (
                <ActivityIndicator />
              )}
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
              <Text category="h5">Contact</Text>
              {contactMenuData && contactMenuData.length > 0 ? (
                contactMenuData.map((am, i) => (
                  //   <Text key={i}>{am.amenityname}</Text>
                  <View
                    key={i}
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
                      checked={am.status === 1 ? true : false}
                      onChange={(nextValue) =>
                        onContactDataChanged(nextValue, i)
                      }
                    >
                      {am.name}
                    </Toggle>
                  </View>
                ))
              ) : (
                <ActivityIndicator />
              )}
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
              <Text category="h5">Tools</Text>
              {toolsMenuData && toolsMenuData.length > 0 ? (
                toolsMenuData.map((am, i) => (
                  //   <Text key={i}>{am.amenityname}</Text>
                  <View
                    key={i}
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
                      checked={am.status === 1 ? true : false}
                      onChange={(nextValue) => onToolsDataChanged(nextValue, i)}
                    >
                      {am.name}
                    </Toggle>
                  </View>
                ))
              ) : (
                <ActivityIndicator />
              )}
              {menuOrders && menuOrders.length > 0 ? (
                menuOrders.map((am, i) => (
                  <>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                    <Text category="h5">Tab Order</Text>
                    // <Text key={i}>{am.amenityname}</Text>
                    <View
                      key={i}
                      style={{
                        width: "100%",
                        marginTop: 5,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        name="home-outline"
                        style={styles.tabButton}
                        fill="#FFA12D"
                      />{" "}
                      <Text>{am.name}</Text>
                    </View>
                  </>
                ))
              ) : (
                <View></View>
              )}
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
              <Button
                style={styles.saveButton}
                mode="contained"
                buttonColor="orange"
                onPress={onSubmit}
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
});
