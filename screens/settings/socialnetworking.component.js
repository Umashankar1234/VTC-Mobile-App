/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
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
import { Layout, Text } from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fetchRecords } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPeopleArrows,
  faEnvelopeOpen,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Button } from "react-native-paper";
const MailIcon = (props) => (
  <FontAwesomeIcon icon={faEnvelopeOpen} size={25} color={"#FFA12D"} />
);

const PhoneIcon = (props) => (
  <FontAwesomeIcon icon={faPhone} size={25} color={"#FFA12D"} />
);
const SaveIcon = (props) => (
  <FontAwesomeIcon icon={faSave} size={25} color={"#FFFFFF"} />
);
export const SocialNetworkingScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
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
        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          <View style={styles.headingWrap}>
            <FontAwesomeIcon
              icon={faPeopleArrows}
              size={20}
              color={"#adadad"}
            />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Setup Social Networking
            </Text>
          </View>
          <View style={styles.sectionWrap}>
            <TouchableOpacity activeOpacity={0.8} style={styles.sectionInfo}>
              <FontAwesomeIcon icon={faFacebook} size={50} color={"#FFA12D"} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.sectionInfo}>
              <FontAwesomeIcon icon={faInstagram} size={50} color={"#FFA12D"} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.sectionInfo}>
              <FontAwesomeIcon icon={faYoutube} size={50} color={"#FFA12D"} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.sectionInfo}>
              <FontAwesomeIcon icon={faTwitter} size={50} color={"#FFA12D"} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.sectionInfo}>
              <FontAwesomeIcon icon={faLinkedin} size={50} color={"#FFA12D"} />
            </TouchableOpacity>
          </View>
          <Button
            style={styles.saveButton}
            mode="contained"
            buttonColor="orange"
            loading={loading}
            disabled={loading}
            icon="content-save"
          >
            Update
          </Button>
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
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
  },
  saveButton: {
    margin: 50,
    alignSelf: "center",
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
