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
import DocumentPicker from "react-native-document-picker";
import { APIURL, axiosPost } from "../commons/Save";

const SendFlyer = ({ navigation, route }) => {

  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [csvFile, setCsvFile] = React.useState();
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

  const sendEmail = async () => {
    setLoading(true);
    let obj = {
      authenticate_key: "abcd123XYZ",
      agent_id: userData.agent_id,
      emails: emailRecipients,
      tourId: tourid,
      email_file: csvFile ? csvFile : "",
    };
    try {
      const res = await axiosPost("send-flyer-mail", "", "", obj, "");
      setLoading(false);
      if (res[0].response.status === "error") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res[0].response.message,
          position: "top",
          topOffset: "70",
        });
        setSaveResult({
          message: res[0].response.message || "error",
          color: "danger",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res[0].response.message,
          position: "top",
          topOffset: "70",
        });
        setSaveResult({
          message: res[0].response.message || "Saved Successfully",
          color: "success",
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was some error,try again later",
        position: "top",
        topOffset: "70",
      });
    }
    setLoading(false);
  };
  const { tourid } = route.params;
  const pickCSVFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setCsvFile(res[0].uri);

      if (res.type === "file") {
        const content = await readFile(res[0].uri);
        // Process the CSV content here
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User canceled the file picker
      } else {
        // Handle other errors
      }
    }
  };

  const readFile = async (uri) => {
    const response = await fetch(uri);
    const fileContent = await response.text();
    return fileContent;
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
              Send Flyer
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
              OR
            </Text>
            <View style={styles.toggleWrapper}>
              <Text style={styles.toggleText}>Upload CSV file</Text>
              <Button
                style={styles.saveButton1}
                size="large"
                buttonColor="orange"
                mode="contained"
                onPress={pickCSVFile}
              >
                Choose File
              </Button>
            </View>
            <Text style={styles.errorMsg} status={saveResult.color}>
              {saveResult.message}
            </Text>
            <Button
              style={styles.saveButton}
              size="large"
              loading={loading}
              disabled={loading}
              buttonColor="orange"
              mode="contained"
              onPress={sendEmail}
            >
              Update
            </Button>
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

export default SendFlyer;

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
    margin: 10,
    width: "95%",
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
