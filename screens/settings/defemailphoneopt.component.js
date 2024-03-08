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
  Toggle,
  Spinner,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAuthorization } from "../context/AuthProvider";
import {
  faMailBulk,
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
export const DefEmailPhoneOptScreen = ({ navigation }) => {
  const initialEmailData = {
    type: "email",
    flyermail: 0,
    mycafegalleryemail: 0,
    touremail: 0,
    videoemail: 0,
  };
  const initialPhoneData = {
    type: "phone",
    allowcell: 0,
    allowfax: 0,
    allowoffice: 0,
    allowphone: 0,
  };
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [userData, setUserData] = React.useState({});
  const [emailData, setEmailData] = React.useState(initialEmailData);
  const [PhoneData, setPhoneData] = React.useState(initialPhoneData);
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
    postMethod("agent-default-phone", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          setEmailData(res[0].response.data.email);
          setPhoneData(res[0].response.data.phone);
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  const onTourEmailChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setEmailData({ ...emailData, touremail: dt });
  };
  const onVideoEmailChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setEmailData({ ...emailData, videoemail: dt });
  };
  const onFlyerEmailChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setEmailData({ ...emailData, flyermail: dt });
  };
  const onCafeEmailChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setEmailData({ ...emailData, mycafegalleryemail: dt });
  };

  const onAllowPhoneChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setPhoneData({ ...PhoneData, allowphone: dt });
  };
  const onAllowCellChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setPhoneData({ ...PhoneData, allowcell: dt });
  };
  const onAllowFaxChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setPhoneData({ ...PhoneData, allowfax: dt });
  };

  const onAllowOfficeChange = (isChecked) => {
    let dt = isChecked ? 1 : 0;
    setPhoneData({ ...PhoneData, allowoffice: dt });
  };

  const updateDefaultEmail = () => {
    setLoading(true);
    emailData.agent_id = userData.agent_id;
    emailData.type = "email";
    postMethod("agent-default-email-update", emailData).then((res) => {
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
  const updateDefaultPhone = () => {
    setLoading(true);
    PhoneData.agent_id = userData.agent_id;
    PhoneData.type = "phone";
    postMethod("agent-default-phone-update", PhoneData).then((res) => {
      if (res.length > 0) {
        if (res[0].response.status === "error") {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: res[0].response.message,
            position: "top",
            topOffset: "70",
          });
          // setSaveResult({
          //   message: res[0].response.message || "error",
          //   color: "danger",
          // });
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
            <FontAwesomeIcon icon={faMailBulk} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Default Email/Phone Options
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
            <Tab title="Default Email" icon={MailIcon} />
            <Tab title="Default Phone" icon={PhoneIcon} />
          </TabBar>
          <ViewPager
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <View style={styles.wrapTab} level="2">
              <Text category="s1">
                Use Below Switches To Show/Hide Your Email Address On Any Of The
                Services.
              </Text>
              <View style={styles.contentWrapper}>
                <View style={styles.toggleSection}>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Tour Service</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={emailData.touremail === 1}
                      onChange={onTourEmailChange}
                    />
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Video Service</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={emailData.videoemail === 1}
                      onChange={onVideoEmailChange}
                    />
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Flyer Service</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={emailData.flyermail === 1}
                      onChange={onFlyerEmailChange}
                    />
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>My Cafe Gallery</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={emailData.mycafegalleryemail === 1}
                      onChange={onCafeEmailChange}
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
                    onPress={updateDefaultEmail}
                  >
                    Update
                  </Button>
                </View>
              </View>
            </View>
            <View style={styles.wrapTab} level="2">
              <Text category="s1">
                Use Below Switches To Show/Hide Your Phone Number On Any Of The
                Services.
              </Text>
              <View style={styles.contentWrapper}>
                <View style={styles.toggleSection}>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Use Phone</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={PhoneData.allowphone === 1}
                      onChange={onAllowPhoneChange}
                    />
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Use Fax Number</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={PhoneData.allowfax === 1}
                      onChange={onAllowFaxChange}
                    />
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Use Office Phone</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={PhoneData.allowoffice === 1}
                      onChange={onAllowOfficeChange}
                    />
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleText}>Use Cell Number</Text>
                    <Toggle
                      style={styles.toggle}
                      checked={PhoneData.allowcell === 1}
                      onChange={onAllowCellChange}
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
                    onPress={updateDefaultPhone}
                  >
                    Update
                  </Button>
                </View>
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
    width: "95%",
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
    fontSize: 16,
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
