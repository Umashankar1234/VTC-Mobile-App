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
import { Icon, Layout, Text, Radio, RadioGroup } from "@ui-kitten/components";
import { useForm } from "react-hook-form";
import { getUser } from "../../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../../commons/Services";
import { useAuthorization } from "../../context/AuthProvider";
import { Button } from "react-native-paper";
import { RadioButton } from "react-native-paper";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import { axiosPost } from "../../commons/Save";

// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// import Sound from "react-native-sound";

// const SaveIcon = props => <Icon {...props} name="save-outline" />;

export const BackgroundMusicScreen = ({ route, navigation }) => {
  const tourid =
    route && route.params && route.params.tourid ? route.params.tourid : "";
  // const soundPlay = React.useRef(new Sound());
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [playing, setPlaying] = React.useState(false);
  const [musicData, setMusicData] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedMusicPath, setSelectedMusicPath] = React.useState("");
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });
  // var sound1;
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


  // React.useEffect(() => {
  //   Sound.setCategory("Playback", true); // true = mixWithOthers
  // }, []);
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
      let obj = { agent_id: userData.agent_id };
      postMethod("agent-get-background-music", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setRefresh(true);
            setMusicData(res[0].response.data.all_music);
            handleMusicSelection(res[0].response.data.musicid);
            // sound.unloadAsync();
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [userData, isFocused, refresh]);
  const onSubmit = async () => {
    setLoading(true);
    if (tourid) {
      const obj = {
        agent_id: userData.agent_id,
        tourid: tourid,
        musicid: musicData[selectedIndex].musicid,
      };

      postMethod("update-music", obj).then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "error") {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: res[0].response.message,
              position: "top",
              topOffset: "70",
            });
            // ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
          } else {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: res[0].response.message,
              position: "top",
              topOffset: "70",
            });
            // ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
            setLoading(false);
            setRefresh(true);
          }
        }
      });
    } else {
      const obj = {
        agent_id: userData.agent_id,
        tourid: tourid,
        authenticate_key: "abcd123XYZ",
        musicid: musicData[selectedIndex].musicid,
        all_music: musicData,
      };
      const res = await axiosPost(
        "agent-update-backgroud-music-defaults",
        "",
        "",
        obj,
        ""
      );
      setLoading(false);
      if (res.data[0].response.status === "error") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.data[0].response.message,
          position: "top",
          topOffset: "70",
        });
        // ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res.data[0].response.message,
          position: "top",
          topOffset: "70",
        });
        // ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
        setLoading(false);
        setRefresh(true);
      }
    }
  };
  const handleMusicSelection = (i) => {
    setSelectedIndex(i);
    // setLoading(true);

    setSelectedMusicPath(musicData[i].path);
    playSound();
  };

  // React.useEffect(() => {
  //   soundPlay(selectedMusicPath, Sound.MAIN_BUNDLE, (error, sound) => {
  //     if (error) {
  //       return;
  //     }
  //   });
  // }, [selectedMusicPath]);

  // const playSound = () => {
  //   if (selectedMusicPath && selectedMusicPath !== '') {
  //     sound1.play();
  //     setPlaying(true);
  //   }
  // };
  // const stopSound = () => {
  //   setPlaying(false);
  //   sound1.stop(() => {
  //   });
  // };
  const [sound, setSound] = React.useState();
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: selectedMusicPath });
    setSound(sound);

    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  const SingleItem = (item) => {};

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
                  name="music-outline"
                  style={styles.tabButton}
                  fill="#FFA12D"
                />
                <Text category="h6" status="warning" style={styles.pageHeading}>
                  Background Music
                </Text>
              </View>
              <Text category="c2" appearance="hint" style={{ marginLeft: 45 }}>
                Advanced
              </Text>
            </View>
          </View>
          <View style={styles.formWrapTab} level="2">
            <View style={styles.formWrapCard}>
              {/* <TouchableOpacity
                style={styles.modalPressable}
                onPress={playing ? stopSound : playSound}>
                <Icon
                  name={playing ? 'stop-circle-outline' : 'play-circle-outline'}
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
              </TouchableOpacity> */}
              <RadioGroup
                selectedIndex={selectedIndex}
                onChange={(index) => handleMusicSelection(index)}
              >
                <Radio key={99999}>None</Radio>

                {musicData && musicData.length > 0 ? (
                  musicData.map((music, i) => (
                    <Radio key={i}>{music.caption}</Radio>
                  ))
                ) : (
                  <ActivityIndicator />
                )}
              </RadioGroup>

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
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "rgba(0,0,0,0.8)",
    elevation: 10,
    alignSelf: "flex-end",
  },
  modalIcon: {
    width: 20,
    height: 20,
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
