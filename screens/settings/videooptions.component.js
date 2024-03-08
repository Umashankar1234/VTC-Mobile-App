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
  Radio,
  RadioGroup,
  CheckBox,
  Spinner,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAuthorization } from "../context/AuthProvider";
import {
  faVideo,
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
export const VideoOptionsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedRadioIndex, setSelectedRadioIndex] = React.useState(0);
  const [activeChecked, setActiveChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
    postMethod("agent-get-video-option", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          if (res[0].response.data.video_option.videophonetouse === 1) {
            setSelectedIndex(0);
          } else if (res[0].response.data.video_option.videophonetouse === 2) {
            setSelectedIndex(1);
          } else {
            setSelectedIndex(2);
          }

          res[0].response.data.video_option.videoshowprice === 1
            ? setActiveChecked(true)
            : setActiveChecked(false);
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  const updateVideoOption = () => {
    setLoading(true);
    let vp = 2;
    if (selectedRadioIndex === 0) {
      vp = 1;
    } else if (selectedRadioIndex === 1) {
      vp = 2;
    } else {
      vp = 0;
    }
    let vsp = activeChecked ? 1 : 0;
    let obj = {
      agent_id: userData.agent_id,
      videophonetouse: vp,
      videoshowprice: vsp,
    };
    // PhoneData.agent_id = userData.agent_id;
    // PhoneData.type = 'phone';
    postMethod("agent-update-video-option", obj).then((res) => {
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
        <ScrollView>
          <View style={styles.headingWrap}>
            <FontAwesomeIcon icon={faVideo} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Video Options
            </Text>
          </View>
          <View style={styles.wrapTab}>
            <Text category="s1">
              Use Below Options To Show/Hide Your Phone Or Price From The Video
              That System Compiles For Your Tours.
            </Text>
            <View style={styles.toggleSection}>
              <Text style={styles.toggleText}>Phone to Use?</Text>
              <RadioGroup
                style={{ flexDirection: "row" }}
                selectedIndex={selectedRadioIndex}
                onChange={(index) => setSelectedRadioIndex(index)}
              >
                <Radio key={0}>Office</Radio>
                <Radio key={1}>Mobile</Radio>
                <Radio key={2}>None</Radio>
              </RadioGroup>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={styles.toggleText}>Show Price?</Text>
                <CheckBox
                  style={styles.checkbox}
                  checked={activeChecked}
                  onChange={(nextChecked) => setActiveChecked(nextChecked)}
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
                onPress={updateVideoOption}
              >
                Update
              </Button>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
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
    justifyContent: "center",
    alignItems: "center",
  },
  toggleSection: {
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "90%",
    marginVertical: 10,
    elevation: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  toggleText: {
    fontSize: 14,
    marginTop: 10,
  },
  checkbox: {
    marginHorizontal: 20,
    marginTop: 10,
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
