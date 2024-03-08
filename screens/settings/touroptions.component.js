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
  Spinner,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAuthorization } from "../context/AuthProvider";
import {
  faDirections,
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
export const TourOptionsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});

  const [loading, setLoading] = React.useState(false);
  const [allowAgentPhoto, setAllowAgentPhoto] = React.useState(0);
  const [allowCompanyLogo, setAllowCompanyLogo] = React.useState(0);
  const [allowLeadCapture, setAllowLeadCapture] = React.useState(0);
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
    postMethod("agent-get-tour-option", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          res[0].response.data.tour_option.showleadcapture === 0
            ? setAllowLeadCapture(1)
            : setAllowLeadCapture(0);
          res[0].response.data.tour_option.use_agent_company_photo === 0
            ? setAllowCompanyLogo(1)
            : setAllowCompanyLogo(0);
          res[0].response.data.tour_option.use_agent_photo === 0
            ? setAllowAgentPhoto(1)
            : setAllowAgentPhoto(0);
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  const updateTourOption = () => {
    setLoading(true);
    let obj = {
      agent_id: userData.agent_id,
      showleadcapture: allowLeadCapture === 0 ? 1 : 0,
      use_agent_company_photo: allowCompanyLogo === 0 ? 1 : 0,
      use_agent_photo: allowAgentPhoto === 0 ? 1 : 0,
    };

    postMethod("agent-update-tour-option", obj).then((res) => {
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
            <FontAwesomeIcon icon={faDirections} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Tour Options
            </Text>
          </View>
          <View styles={styles.wrapTab}>
            <Text category="s1" style={{ padding: 10 }}>
              Use Below Options To Show/Hide Your Photo Or Company Logo From The
              Tours That System Compiles For Your Tours.
            </Text>
            <View style={styles.contentWrapper}>
              <View style={styles.toggleSection}>
                <View style={styles.toggleWrapper}>
                  <Text style={styles.toggleText}>Phone to Use?</Text>
                  <RadioGroup
                    style={{ flexDirection: "row" }}
                    selectedIndex={allowAgentPhoto}
                    onChange={(index) => setAllowAgentPhoto(index)}
                  >
                    <Radio>Yes</Radio>
                    <Radio>No</Radio>
                  </RadioGroup>
                </View>
                <View style={styles.toggleWrapper}>
                  <Text style={styles.toggleText}>Company Logo to Use?</Text>
                  <RadioGroup
                    style={{ flexDirection: "row" }}
                    selectedIndex={allowCompanyLogo}
                    onChange={(index) => setAllowCompanyLogo(index)}
                  >
                    <Radio>Yes</Radio>
                    <Radio>No</Radio>
                  </RadioGroup>
                </View>
                <View style={styles.toggleWrapper}>
                  <Text style={styles.toggleText}>Show Lead Capture?</Text>
                  <RadioGroup
                    style={{ flexDirection: "row" }}
                    selectedIndex={allowLeadCapture}
                    onChange={(index) => setAllowLeadCapture(index)}
                  >
                    <Radio>Yes</Radio>
                    <Radio>No</Radio>
                  </RadioGroup>
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
                  onPress={updateTourOption}
                >
                  Update
                </Button>
              </View>
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
  contentWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
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
    alignSelf: "center",
    margin: 10,
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
