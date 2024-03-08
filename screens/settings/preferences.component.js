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
  Image,
} from "react-native";
import {
  Layout,
  Text,
  Spinner,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import { useAuthorization } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Slider from "@react-native-community/slider";
import testImage from "../../assets/media/hm-banner-new-3-min.jpg";
import {
  ColorMatrix,
  concatColorMatrices,
  invert,
  contrast,
  saturate,
  grayscale,
  brightness,
  hueRotate,
  sepia,
} from "react-native-color-matrix-image-filters";
import {
  faSlidersH,
  faEnvelopeOpen,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";


const MailIcon = (props) => (
  <FontAwesomeIcon icon={faEnvelopeOpen} size={25} color={"#FFA12D"} />
);

const PhoneIcon = (props) => (
  <FontAwesomeIcon icon={faPhone} size={25} color={"#FFA12D"} />
);
const SaveIcon = (props) => (
  <FontAwesomeIcon icon={faSave} size={25} color={"#FFA12D"} />
);

const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);
export const PreferencesScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });
  const initialPreferenceData = {
    blur: 0,
    grayscale: 0,
    brightness: 10,
    contrast: 1,
    huerotate: 0,
    invert: 1,
    opacity: 1,
    saturation: 20,
    sepia: 0,
  };
  const [preference, setPreference] = React.useState(initialPreferenceData);
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
  // React.useEffect(() => {
  //   let componentMounted = true;
  //   let obj = {agent_id: userData.agent_id};
  //   postMethod('get-countries', obj).then(res => {
  //     if (res.length > 0 && componentMounted) {
  //     }
  //   });
  //   return () => {
  //     componentMounted = false;
  //   };
  // }, [userData]);
  const savePreferences = () => {
    setLoading(true);
    // let obj = {agent_id: userData.agent_id, mycafegallery: myCafeGallery};
    preference.agent_id = userData.agent_id;
    postMethod("agent-update-image-preferene-setting", preference).then(
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
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.headingWrap}>
            <FontAwesomeIcon icon={faSlidersH} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Preferencecs
            </Text>
          </View>
          <View style={styles.wrapTab}>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Blur
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.blur}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, blur: sliderValue })
                  }
                />
              </View>
            </View>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Grayscale
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={1}
                  maximumValue={10}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.grayscale}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, grayscale: sliderValue })
                  }
                />
              </View>
            </View>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Brightness
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.brightness}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, brightness: sliderValue })
                  }
                />
              </View>
            </View>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Contrast
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={1}
                  maximumValue={100}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.contrast}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, contrast: sliderValue })
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.wrapImage}>
            <ColorMatrix
              matrix={
                preference.invert === 0
                  ? concatColorMatrices(
                      saturate(preference.saturation / 10),
                      contrast(preference.contrast),
                      brightness(preference.brightness / 10),
                      sepia(preference.sepia),
                      grayscale(preference.grayscale / 10),
                      hueRotate(preference.huerotate)
                    )
                  : concatColorMatrices(
                      saturate(preference.saturation / 10),
                      contrast(preference.contrast),
                      brightness(preference.brightness / 10),
                      sepia(preference.sepia),
                      grayscale(preference.grayscale / 10),
                      invert(),
                      hueRotate(preference.huerotate)
                    )
              }
              // alt: matrix={[saturate(-0.9), contrast(5.2), invert()]}
            >
              <Image
                source={testImage}
                blurRadius={preference.blur / 10}
                style={{
                  width: "100%",
                  height: 200,
                  resizeMode: "cover",
                  borderRadius: 20,
                  opacity: preference.opacity,
                }}
              />
            </ColorMatrix>
          </View>
          <View style={styles.wrapTab}>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Huerotate
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.huerotate}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, huerotate: sliderValue })
                  }
                />
              </View>
            </View>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Invert
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  step={1}
                  maximumValue={1}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.invert}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, invert: sliderValue })
                  }
                />
              </View>
            </View>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Opacity
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.opacity}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, opacity: sliderValue })
                  }
                />
              </View>
            </View>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Saturate
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.saturation}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, saturation: sliderValue })
                  }
                />
              </View>
            </View>
            <View style={styles.controlSection}>
              <Text category="s1" style={styles.labelText}>
                Sepia
              </Text>
              <View style={styles.sliderWrap}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#adadad"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#FFA12D"
                  value={preference.sepia}
                  onValueChange={(sliderValue) =>
                    setPreference({ ...preference, sepia: sliderValue })
                  }
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
              onPress={savePreferences}              
            >
              Update
            </Button>
          </View>
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
  propImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 20,
  },
  wrapImage: {
    margin: 15,
    backgroundColor: "#ffffff",
    elevation: 15,
    borderRadius: 20,
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
  },
  sliderWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  sliderStyle: { width: "95%", height: 20 },
  labelText: {
    marginLeft: 15,
    fontSize: 16,
  },
  saveButton: {
    alignSelf: "center",
    margin: 10,
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
