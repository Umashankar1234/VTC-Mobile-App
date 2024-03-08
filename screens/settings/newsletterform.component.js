/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect, useState } from "react";
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
import { Layout, Text, Input } from "@ui-kitten/components";
import { getItem, getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fetchRecords } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelopeOpenText,
  faEnvelopeOpen,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-native-paper";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";

const MailIcon = (props) => (
  <FontAwesomeIcon icon={faEnvelopeOpen} size={25} color={"#FFA12D"} />
);

const PhoneIcon = (props) => (
  <FontAwesomeIcon icon={faPhone} size={25} color={"#FFA12D"} />
);
const SaveIcon = (props) => (
  <FontAwesomeIcon icon={faSave} size={25} color={"#FFFFFF"} />
);

export const NewsletterFormScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [formcode, setFormcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentId, setAgentId] = useState({});
  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const data = { agent_id: agentId };
      const result = await axiosPost("agent-get-newsletter-seetings", data);
      if(result.data[0].response.status === "success") 
      setFormcode(result.data[0].response.data.formcode)
    };
    if (agentId) fetchData();
  }, [agentId]);
  const updateNewsLetter = async () => {
    setLoading(true);
    const data = { agent_id: agentId, formcode: formcode };
    const res = await axiosPost("agent-update-newsletter", data);
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
    setLoading(false);

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
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
          <View style={styles.headingWrap}>
            <FontAwesomeIcon
              icon={faEnvelopeOpenText}
              size={20}
              color={"#adadad"}
            />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Newsletter Form
            </Text>
          </View>
          <View style={styles.formWrapCard}>
            <Text category="s1" style={styles.labelText}>
              Form
            </Text>
            <Input
              placeholder="type here"
              style={styles.formControl}
              textStyle={{ minHeight: 150 }}
              multiline={true}
              onChangeText={(value) => setFormcode(value)}
              value={formcode}
            />
            <Button
              style={styles.saveButton}
              icon="content-save"
              mode="contained"
              buttonColor="orange"
              loading={loading}
              disabled={loading}
              onPress={updateNewsLetter}
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
  formWrapCard: {
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    padding: 20,
    width: "95%",
    alignSelf: "center",
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
    alignSelf: "center",
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
