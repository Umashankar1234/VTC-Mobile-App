/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Layout,
  Text,
  Tab,
  TabBar,
  ViewPager,
  Toggle,
  Spinner,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAuthorization } from "../context/AuthProvider";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import {
  faTv,
  faCog,
  faSlidersH,
  faPalette,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";

const CogIcon = (props) => (
  <FontAwesomeIcon icon={faCog} size={25} color={"#FFA12D"} />
);

const SlideIcon = (props) => (
  <FontAwesomeIcon icon={faSlidersH} size={25} color={"#FFA12D"} />
);

const CaptionIcon = (props) => (
  <FontAwesomeIcon icon={faPalette} size={25} color={"#FFA12D"} />
);
const SaveIcon = (props) => (
  <FontAwesomeIcon icon={faSave} size={25} color={"#FFA12D"} />
);
const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);

export const SlideShowDefaultsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const initialImageSettings = { kenburnsservice: 0, randomcamera: 0 };
  const initialSlideSettings = {
    transduration: 0,
    transition: 0,
    transspeed: 0,
  };
  const initialCaptionSettings = {
    tourfontcolor: "ffffff",
    tourfontlocation: "bottom",
    tourfontsize: 20,
    tourfontstyle: "georgia",
    videofontsize: 40,
  };
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [imageSettings, setImageSettings] =
    React.useState(initialImageSettings);
  const [slideSettings, setslideSettings] =
    React.useState(initialSlideSettings);
  const [captionSettings, setcaptionSettings] = React.useState(
    initialCaptionSettings
  );
  const [loading, setLoading] = React.useState(false);
  const [transitionOpen, setTransitionOpen] = React.useState(false);
  const [selectedTransition, setSelectedTransition] = React.useState(0);
  const [transitionList, setTransitionList] = React.useState([]);
  const [fontFamilyOpen, setFontFamilyOpen] = React.useState(false);
  const [selectedFontFamily, setSelectedFontFamily] = React.useState("");
  const [fontFamilyList, setFontFamilyList] = React.useState([
    { label: "Arial", value: "arial" },
    { label: "Times New Roman", value: "times new roman" },
    { label: "Verdana", value: "verdana" },
    { label: "Tahoma", value: "tahoma" },
    { label: "Georgia", value: "georgia" },
  ]);
  const [fontSizeOpen, setFontSizeOpen] = React.useState(false);
  const [selectedFontSize, setSelectedFontSize] = React.useState("");
  const [fontSizeList, setFontSizeList] = React.useState([
    { label: "22", value: "22" },
    { label: "24", value: "24" },
    { label: "26", value: "26" },
    { label: "28", value: "28" },
    { label: "30", value: "30" },
  ]);
  const [videoFontSizeOpen, setVideoFontSizeOpen] = React.useState(false);
  const [selectedVideoFontSize, setSelectedVideoFontSize] = React.useState("");
  const [videoFontSizeList, setVideoFontSizeList] = React.useState([
    { label: "30", value: "30" },
    { label: "32", value: "32" },
    { label: "34", value: "34" },
    { label: "36", value: "36" },
    { label: "38", value: "38" },
    { label: "40", value: "40" },
  ]);
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
    let componentMounted = true;
    let obj = { agent_id: userData.agent_id };
    postMethod("transition", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          let cdata = [];
          res[0].response.data.forEach((x) => {
            cdata.push({ label: x.title, value: x.id });
          });
          setTransitionList(cdata);
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  React.useEffect(() => {
    let componentMounted = true;
    let obj = { agent_id: userData.agent_id };
    postMethod("agent-get-slide-show-settings", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          setImageSettings(res[0].response.data.image_setting);
          setslideSettings(res[0].response.data.slide_setting);
          setcaptionSettings(res[0].response.data.caption_setting);
          setSelectedTransition(
            res[0].response.data.slide_setting.transition.toString()
          );
          setSelectedFontFamily(
            res[0].response.data.caption_setting.tourfontstyle.toString()
          );
          setSelectedFontSize(
            res[0].response.data.caption_setting.tourfontsize.toString()
          );
          setSelectedVideoFontSize(
            res[0].response.data.caption_setting.videofontsize.toString()
          );
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  const onKenBurnsChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setImageSettings({ ...imageSettings, kenburnsservice: dt });
  };
  const onRandomCameraChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setImageSettings({ ...imageSettings, randomcamera: dt });
  };
  const updateImageSettings = () => {
    setLoading(true);
    let obj = {
      agent_id: userData.agent_id,
      type: "image_setting",
      kenburnsservice: imageSettings.kenburnsservice,
      randomcamera: imageSettings.randomcamera,
    };
    postMethod("agent-update-slide-show-image-settings", obj).then((res) => {
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
        }
        setLoading(false);
      }
    });
  };
  const updateSlideSettings = () => {
    setLoading(true);
    let obj = {
      agent_id: userData.agent_id,
      type: "slide_setting",
      transduration: slideSettings.transduration,
      transspeed: slideSettings.transspeed,
      transition: selectedTransition,
    };
    postMethod("agent-update-slide-show-slide-settings", obj).then((res) => {
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
        }
        setLoading(false);
      }
    });
  };
  const updateCaptionSettings = () => {
    setLoading(true);
    let obj = {
      agent_id: userData.agent_id,
      type: "caption_setting",
      tourfontstyle: selectedFontFamily,
      tourfontsize: selectedFontSize,
      videofontsize: selectedVideoFontSize,
      tourfontlocation: "bottom",
      tourfontcolor: "ffffff",
    };
    postMethod("agent-update-slide-show-caption-settings", obj).then((res) => {
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
        }
        setLoading(false);
      }
    });
  };
  const onFamilyOpen = React.useCallback(() => {
    setFontSizeOpen(false);
    setVideoFontSizeOpen(false);
  }, []);
  const onSizeOpen = React.useCallback(() => {
    setFontFamilyOpen(false);
    setVideoFontSizeOpen(false);
  }, []);
  const onVideoSizeOpen = React.useCallback(() => {
    setFontSizeOpen(false);
    setFontFamilyOpen(false);
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          nestedScrollEnabled={true}
        >
          <View style={styles.headingWrap}>
            <FontAwesomeIcon icon={faTv} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Slideshow Defaults
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
            <Tab title="Image Setting" icon={CogIcon} />
            <Tab title="Slide Setting" icon={SlideIcon} />
            <Tab title="Caption Setting" icon={CaptionIcon} />
          </TabBar>
          <ViewPager
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <View style={styles.wrapTab} level="2">
              <View style={styles.contentWrapper}>
                <View style={styles.toggleSection}>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>
                      Use Ken Burns Effects on Tour
                    </Text>
                    <Toggle
                      style={styles.toggle}
                      checked={imageSettings.kenburnsservice === 1}
                      onChange={onKenBurnsChange}
                    />
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Random Camera Setting</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={imageSettings.randomcamera === 1}
                      onChange={onRandomCameraChange}
                    />
                  </View>
                  <Text style={styles.errorMsg} status={saveResult.color}>
                    {saveResult.message}
                  </Text>
                  <Button
                    style={styles.saveButton}
                    mode="contained"
                    buttonColor="orange"
                    loading={loading}
                    disabled={loading}
                    icon="content-save"
                    onPress={updateImageSettings}
                  >
                    Update
                  </Button>
                </View>
              </View>
            </View>
            <View style={styles.wrapTab} level="2">
              <View style={styles.wrapTabSlider}>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Duration
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={slideSettings.transduration}
                      onValueChange={(sliderValue) =>
                        setslideSettings({
                          ...slideSettings,
                          transduration: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Speed
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={slideSettings.transspeed}
                      onValueChange={(sliderValue) =>
                        setslideSettings({
                          ...slideSettings,
                          transspeed: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Transition
                  </Text>
                  <View style={styles.sliderWrap}>
                    <DropDownPicker
                      dropDownContainerStyle={{
                        backgroundColor: "white",
                        zIndex: 1000,
                        elevation: 1000,
                      }}
                      open={transitionOpen}
                      placeholder="Select Transition"
                      style={styles.formControlDrop}
                      value={selectedTransition}
                      items={transitionList.length > 0 ? transitionList : []}
                      setOpen={setTransitionOpen}
                      setValue={setSelectedTransition}
                      setItems={setTransitionList}
                      listMode="MODAL"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </View>
                <Text style={styles.errorMsg} status={saveResult.color}>
                  {saveResult.message}
                </Text>
                <Button
                  style={styles.saveButton}
                  mode="contained"
                  buttonColor="orange"
                  loading={loading}
                  disabled={loading}
                  icon="content-save"
                  onPress={updateSlideSettings}
                >
                  Update
                </Button>
              </View>
            </View>
            <View style={styles.wrapTab} level="2">
              <View style={styles.wrapTabSlider}>
                <View style={[styles.controlSection, { zIndex: 2004 }]}>
                  <Text category="s1" style={styles.labelText}>
                    Font
                  </Text>
                  <View style={styles.sliderWrap}>
                    <DropDownPicker
                      dropDownContainerStyle={{
                        backgroundColor: "white",
                        zIndex: 1000,
                        elevation: 1000,
                      }}
                      open={fontFamilyOpen}
                      onOpen={onFamilyOpen}
                      style={styles.formControlDrop}
                      value={selectedFontFamily}
                      items={fontFamilyList.length > 0 ? fontFamilyList : []}
                      setOpen={setFontFamilyOpen}
                      setValue={setSelectedFontFamily}
                      setItems={setFontFamilyList}
                      listMode="MODAL"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </View>
                <View style={[styles.controlSection, { zIndex: 2003 }]}>
                  <Text category="s1" style={styles.labelText}>
                    Font Size
                  </Text>
                  <View style={styles.sliderWrap}>
                    <DropDownPicker
                      dropDownContainerStyle={{
                        backgroundColor: "white",
                        zIndex: 1000,
                        elevation: 1000,
                      }}
                      open={fontSizeOpen}
                      onOpen={onSizeOpen}
                      style={styles.formControlDrop}
                      value={selectedFontSize}
                      items={fontSizeList.length > 0 ? fontSizeList : []}
                      setOpen={setFontSizeOpen}
                      setValue={setSelectedFontSize}
                      setItems={setFontSizeList}
                      listMode="MODAL"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </View>
                <View style={[styles.controlSection, { zIndex: 2002 }]}>
                  <Text category="s1" style={styles.labelText}>
                    Video Font Size
                  </Text>
                  <View style={styles.sliderWrap}>
                    <DropDownPicker
                      dropDownContainerStyle={{
                        backgroundColor: "white",
                        zIndex: 1000,
                        elevation: 1000,
                      }}
                      open={videoFontSizeOpen}
                      onOpen={onVideoSizeOpen}
                      style={styles.formControlDrop}
                      value={selectedVideoFontSize}
                      items={
                        videoFontSizeList.length > 0 ? videoFontSizeList : []
                      }
                      setOpen={setVideoFontSizeOpen}
                      setValue={setSelectedVideoFontSize}
                      setItems={setVideoFontSizeList}
                      listMode="MODAL"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </View>
                <Text style={styles.errorMsg} status={saveResult.color}>
                  {saveResult.message}
                </Text>
                <Button
                  style={styles.saveButton}
                  mode="contained"
                  buttonColor="orange"
                  loading={loading}
                  disabled={loading}
                  icon="content-save"
                  onPress={updateCaptionSettings}
                >
                  Update
                </Button>
              </View>
            </View>
          </ViewPager>
        </ScrollView>
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
  uploadImages: {
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  wrapTab: {
    padding: 10,
    alignItems: "center",
  },
  contentWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
  },
  toggleSection: {
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "98%",
    marginVertical: 10,
    elevation: 10,
    borderRadius: 20,
  },
  toggleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  toggleText: {
    fontSize: 14,
  },
  toggle: {
    marginLeft: 10,
  },
  saveButton: {
    margin: 10,
    alignSelf: "center",
  },
  controlSection: {
    marginVertical: 10,
    zIndex: 2001,
  },
  sliderWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  sliderStyle: { width: "95%", height: 40 },
  labelText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "bold",
    color: "#9294a5",
  },
  wrapTabSlider: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    elevation: 15,
    margin: 20,
    width: "98%",
  },
  formControl: {
    marginBottom: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    paddingLeft: 0,
    width: "95%",
  },
  formControlDrop: {
    marginTop: 10,
    marginBottom: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5e5",
    marginLeft: 10,
    width: "95%",
    zIndex: 0,
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
