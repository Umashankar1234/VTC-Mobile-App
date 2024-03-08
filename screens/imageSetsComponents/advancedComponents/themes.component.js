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
import { Icon, Layout, Text, Toggle } from "@ui-kitten/components";
import { useForm } from "react-hook-form";
import { getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
import { Button } from "react-native-paper";

// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const ThemesScreen = ({ route, navigation }) => {
  const { tourid } = route.params;
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [isActive, setIsActive] = React.useState(false);
  const [premiumThemes, setPremiumThemes] = React.useState([]);
  const [selectedPremiumTheme, setSelectedPremiumTheme] = React.useState(null);
  const [selectedTourTheme, setSelectedTourTheme] = React.useState(null);
  const [tourThemes, setTourThemes] = React.useState([]);
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
    setLoading(false);
  }, [isFocused]);
  React.useEffect(() => {
    let componentMounted = true;
    if (Object.entries(userData).length > 0 && refresh) {
      let obj = { agentId: userData.agent_id, tourid: tourid };
      postMethod("get-themes", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(false);
            setPremiumThemes(res[0].response.dataTotalArray[0].premiumArry);
            setTourThemes(res[0].response.dataTotalArray[0].datathemeArray);
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
    var obj = {
      agentId: userData.agent_id,
      tourid: tourid,
      themeId: selectedTourTheme,
      is_premium_theme: isActive ? 1 : 0,
      premium_tour_theme: selectedPremiumTheme,
    };
    postMethod("update-themes", obj).then((res) => {
      setLoading(false);

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

  const onActivateCheckedChange = (isChecked) => {
    setIsActive(isChecked);
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
      <View style={styles.headingWrap}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Icon
              name="color-palette-outline"
              style={styles.tabButton}
              fill="#FFA12D"
            />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Themes
            </Text>
          </View>
          <Text category="c2" appearance="hint" style={{ marginLeft: 45 }}>
            Advanced
          </Text>
          <Text
            category="c2"
            appearance="hint"
            style={{ marginTop: 20, textAlign: "justify" }}
          >
            Select any theme and use with your brokerage banner or branding –
            themes are color designs only and can be used by any agent or
            broker.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text category="s1" style={{ marginRight: 10 }}>
                  Use Premium Themes
                </Text>
              </View>

              <Toggle
                style={styles.toggle}
                status="info"
                onChange={onActivateCheckedChange}
                checked={isActive}
              />
            </View>
            <Button
              style={styles.saveButton}
              mode="contained"
              onPress={onSubmit}
              disabled={loading}
              loading={loading}
            >
              Save
            </Button>
          </View>
        </View>
      </View>
      <ScrollView>
        <Layout style={styles.container}>
          <View style={styles.formWrapTab} level="2">
            <View style={styles.formWrapCard}>
              <Text category="h6" status="info" style={{ marginBottom: 10 }}>
                Premium Themes
              </Text>
              <View style={{ flexDirection: "column" }}>
                {premiumThemes &&
                  premiumThemes.length > 0 &&
                  premiumThemes.map((pt, i) => (
                    <TouchableOpacity
                      onPress={() => setSelectedPremiumTheme(pt.key)}
                      key={pt.key}
                      style={{
                        width: "100%",
                        height: 200,
                        backgroundColor:
                          selectedPremiumTheme === pt.key
                            ? "#FFA12D"
                            : "#ffffff",
                        marginBottom: 20,
                        justifyContent: "space-between",
                        alignItems: "center",
                        elevation: 5,
                      }}
                    >
                      <Image
                        source={{ uri: pt.imageurl }}
                        style={{ width: "100%", height: 150 }}
                      />
                      <View
                        style={{
                          marginBottom: 10,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {selectedPremiumTheme === pt.key && (
                          <Icon
                            name="done-all-outline"
                            style={styles.tabButton}
                            fill="#FFFFFF"
                          />
                        )}
                        <Text
                          category="h6"
                          style={{
                            color:
                              selectedPremiumTheme === pt.key
                                ? "#ffffff"
                                : "#FFA12D",
                            marginLeft: 10,
                          }}
                        >
                          {pt.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
              <Text category="h6" status="info" style={{ marginBottom: 10 }}>
                Tour Themes
              </Text>
              <View style={{ flexDirection: "column" }}>
                {tourThemes &&
                  tourThemes.length > 0 &&
                  tourThemes.map((pt, i) => (
                    <TouchableOpacity
                      onPress={() => setSelectedTourTheme(pt.themeId)}
                      key={pt.themeId}
                      style={{
                        width: "100%",
                        height: 200,
                        backgroundColor:
                          selectedTourTheme === pt.themeId
                            ? "#FFA12D"
                            : "#ffffff",
                        marginBottom: 20,
                        justifyContent: "space-between",
                        alignItems: "center",
                        elevation: 5,
                      }}
                    >
                      <Image
                        source={{ uri: pt.url }}
                        resizeMode="stretch"
                        style={{ width: "100%", height: 150 }}
                      />
                      <View
                        style={{
                          marginBottom: 10,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {selectedTourTheme === pt.themeId && (
                          <Icon
                            name="done-all-outline"
                            style={styles.tabButton}
                            fill="#FFFFFF"
                          />
                        )}
                        <Text
                          category="h6"
                          style={{
                            color:
                              selectedTourTheme === pt.themeId
                                ? "#ffffff"
                                : "#FFA12D",
                            marginLeft: 10,
                          }}
                        >
                          {pt.caption}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
              <Text style={styles.errorMsg} status={saveResult.color}>
                {saveResult.message}
              </Text>
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
    marginTop: 20,
    alignSelf: "center",
  },
});
