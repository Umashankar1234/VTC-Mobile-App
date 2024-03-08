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
} from "react-native";
import { Layout, Text, Input, Toggle, Spinner } from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAuthorization } from "../context/AuthProvider";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
// import {
//   faPaste,
//   faEnvelopeOpen,
//   faPhone,
//   faSave,
// } from '@fortawesome/free-solid-svg-icons';

export const TrafficReportsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [emailRecipients, setEmailRecipients] = React.useState(null);
  const [activeChecked, setActiveChecked] = React.useState(false);
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
    postMethod("agent-get-traffic", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          setEmailRecipients(res[0].response.data.traffic.reportrecipients);
          res[0].response.data.traffic.emailtrafficreport
            ? setActiveChecked(true)
            : setActiveChecked(false);
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  const onActiveCheckedChange = (isChecked) => {
    setActiveChecked(isChecked);
  };
  const updateTrafficReport = () => {
    setLoading(true);
    let obj = {
      agent_id: userData.agent_id,
      emailtrafficreport: activeChecked,
      reportrecipients: emailRecipients,
    };

    postMethod("agent-update-traffic", obj).then((res) => {
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
            {/* <FontAwesomeIcon icon={faPaste} size={20} color={"#adadad"} /> */}
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Traffic Reports
            </Text>
          </View>
          <View style={styles.wrapTab}>
            <Text category="h6" style={styles.paraText}>
              Email Recipients (Comma Seperated)
            </Text>
            <Text category="s1" style={styles.paraText}>
              You Could Enter Multiple Email Addresses Separated By Commas.
            </Text>
            <Text category="h6" style={styles.paraText}>
              To:
            </Text>
            <Input
              placeholder=""
              label=""
              value={emailRecipients}
              onChangeText={(nextValue) => setEmailRecipients(nextValue)}
              style={styles.formControl}
              size="large"
            />
            <Text category="h6" style={styles.paraText}>
              Auto Forward
            </Text>
            <View style={styles.toggleWrapper}>
              <Text style={styles.toggleText}>Email report every week</Text>
              <Toggle
                style={styles.toggle}
                checked={activeChecked}
                onChange={onActiveCheckedChange}
              />
            </View>
            <Text style={styles.errorMsg} status={saveResult.color}>
              {saveResult.message}
            </Text>
            <Button
              style={styles.saveButton}
              loading={loading}
              disabled={loading}
              buttonColor="orange"
              mode="contained"
              icon="content-save"
              onPress={updateTrafficReport}
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
    padding: 20,
    alignItems: "center",
  },
  paraText: {
    textAlign: "left",
    width: "98%",
    marginBottom: 10,
  },
  formControl: {
    marginBottom: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  toggleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 20,
    width: "98%",
  },
  toggleText: {
    fontSize: 18,
  },
  toggle: {
    marginLeft: 10,
  },
  saveButton: {
    alignSelf: "center",
    margin: 10,
    // width: "95%",
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
