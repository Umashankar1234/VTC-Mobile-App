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
} from "react-native";
import {
  Layout,
  Text,
  Tab,
  TabBar,
  ViewPager,
  Input,
  Spinner,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import Slider from "@react-native-community/slider";
import { useAuthorization } from "../context/AuthProvider";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faVrCardboard,
  faCog,
  faPalette,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "react-native-toast-message";
import { Button } from "react-native-paper";

const CogIcon = (props) => (
  <FontAwesomeIcon icon={faCog} size={25} color={"#FFA12D"} />
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

export const PanoramaDefaultsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const initialPanoramaSettings = {
    acceleration: 3,
    endzoom: 86,
    hfov: 200,
    hlookat: 0,
    maxzoom: 100,
    minzoom: 40,
    panospeed: 5,
    panotype: "partial",
    startzoom: 50,
    vlookat: 0,
    waittime: 5,
  };
  const initialCaptionSettings = {
    panofontcolor: "FFFFFF",
    panofontlocation: "bottom",
    panofontsize: 22,
    panofontstyle: "georgia",
  };
  const [panoramaSettings, setPanoramaSettings] = React.useState(
    initialPanoramaSettings
  );
  const [captionSettings, setCaptionSettings] = React.useState(
    initialCaptionSettings
  );
  const [panoTypeOpen, setPanoTypeOpen] = React.useState(false);
  const [selectedPanoType, setSelectedPanoType] = React.useState("");
  const [panoTypeList, setPanoTypeList] = React.useState([
    { label: "Spherical", value: "spherical" },
    { label: "Cubic", value: "cubic" },
    { label: "Cylindrical", value: "cylindrical" },
    { label: "Flat", value: "flat" },
    { label: "Partial", value: "partial" },
  ]);
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
    postMethod("agent-get-default-panorama-settings", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          setPanoramaSettings(res[0].response.data.panoramaFrm);
          setCaptionSettings(res[0].response.data.caption);
          setSelectedPanoType(res[0].response.data.panoramaFrm.panotype);
          setSelectedFontFamily(
            res[0].response.data.caption.panofontstyle.toString()
          );
          setSelectedFontSize(
            res[0].response.data.caption.panofontsize.toString()
          );
          // caption
          // panoramaFrm
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  const updatePanoramaSettings = () => {
    setLoading(true);
    panoramaSettings.agent_id = userData.agent_id;
    panoramaSettings.type = "panoramaFrm";
    panoramaSettings.panotype = selectedPanoType;
    postMethod("agent-update-default-panorama-settings", panoramaSettings).then(
      (res) => {
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
      }
    );
  };
  const updateCaptionSettings = () => {
    setLoading(true);
    let obj = {
      agent_id: userData.agent_id,
      type: "caption",
      panofontstyle: selectedFontFamily,
      panofontsize: selectedFontSize,
      panofontcolor: "ffffff",
      panofontlocation: "bottom",
    };
    postMethod("agent-update-default-caption-settings", obj).then((res) => {
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
    // setVideoFontSizeOpen(false);
  }, []);
  const onSizeOpen = React.useCallback(() => {
    setFontFamilyOpen(false);
    // setVideoFontSizeOpen(false);
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
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.headingWrap}>
            <FontAwesomeIcon icon={faVrCardboard} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Panorama Defaults
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
            <Tab title="Panorama" icon={CogIcon} />
            <Tab title="Caption" icon={CaptionIcon} />
          </TabBar>
          <ViewPager
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <View style={styles.tabWrapper} level="2">
              <View style={styles.wrapTab}>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Waiting
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.waittime}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          waittime: sliderValue,
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
                      value={panoramaSettings.panospeed}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          panospeed: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Acceleration
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.acceleration}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          acceleration: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Horizontal Look
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.hlookat}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          hlookat: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Vertical Look
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.vlookat}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          vlookat: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Min Zoom
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.minzoom}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          minzoom: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Max Zoom
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.maxzoom}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          maxzoom: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Start Zoom
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.startzoom}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          startzoom: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    End Zoom
                  </Text>
                  <View style={styles.sliderWrap}>
                    <Slider
                      style={styles.sliderStyle}
                      minimumValue={0}
                      maximumValue={100}
                      minimumTrackTintColor="#adadad"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#FFA12D"
                      value={panoramaSettings.endzoom}
                      onValueChange={(sliderValue) =>
                        setPanoramaSettings({
                          ...panoramaSettings,
                          endzoom: sliderValue,
                        })
                      }
                    />
                  </View>
                </View>
                <View style={styles.controlSection}>
                  <Text category="s1" style={styles.labelText}>
                    Type
                  </Text>
                  <View style={styles.sliderWrap}>
                    <DropDownPicker
                      open={panoTypeOpen}
                      style={styles.formControlDrop}
                      value={selectedPanoType}
                      items={panoTypeList.length > 0 ? panoTypeList : []}
                      setOpen={setPanoTypeOpen}
                      setValue={setSelectedPanoType}
                      setItems={setPanoTypeList}
                      listMode="SCROLLVIEW"
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
                  onPress={updatePanoramaSettings}
                >
                  Update
                </Button>
              </View>
            </View>
            <View style={styles.tabWrapper} level="2">
              <View style={styles.wrapTab}>
                <View style={[styles.controlSection, { zIndex: 2005 }]}>
                  <Text category="s1" style={styles.labelText}>
                    Font
                  </Text>
                  <View style={styles.sliderWrap}>
                    <DropDownPicker
                      open={fontFamilyOpen}
                      onOpen={onFamilyOpen}
                      style={styles.formControlDrop}
                      value={selectedFontFamily}
                      items={fontFamilyList.length > 0 ? fontFamilyList : []}
                      setOpen={setFontFamilyOpen}
                      setValue={setSelectedFontFamily}
                      setItems={setFontFamilyList}
                      listMode="SCROLLVIEW"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </View>
                <View style={[styles.controlSection, { zIndex: 2004 }]}>
                  <Text category="s1" style={styles.labelText}>
                    Font Size
                  </Text>
                  <View style={styles.sliderWrap}>
                    <DropDownPicker
                      open={fontSizeOpen}
                      onOpen={onSizeOpen}
                      style={styles.formControlDrop}
                      value={selectedFontSize}
                      items={fontSizeList.length > 0 ? fontSizeList : []}
                      setOpen={setFontSizeOpen}
                      setValue={setSelectedFontSize}
                      setItems={setFontSizeList}
                      listMode="SCROLLVIEW"
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
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    elevation: 15,
    margin: 15,
  },
  controlSection: {
    marginVertical: 10,
    zIndex: 2000,
  },
  sliderWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  sliderStyle: { width: "95%", height: 40 },
  labelText: {
    marginLeft: 15,
    fontSize: 16,
  },
  saveButton: {
    margin: 10,
    alignSelf: "center",
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
    marginBottom: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5e5",
    marginLeft: 20,
    width: "90%",
    zIndex: 0,
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
