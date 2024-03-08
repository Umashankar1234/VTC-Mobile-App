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
  Animated,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Card,
  Button,
  TopNavigationAction,
} from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faInfoCircle,
  faMailBulk,
  faAirFreshener,
  faVideo,
  faDirections,
  faBookOpen,
  faPaste,
  faTv,
  faVrCardboard,
  faSlidersH,
  faPaintBrush,
  faMusic,
  faCreditCard,
  faPeopleArrows,
  faEnvelopeOpenText,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { getLocation, getUser } from "./context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fetchRecords } from "./commons/Services";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const PlusIcon = (props) => <Icon {...props} name="plus-outline" />;
export const SettingsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  return (
    <>
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
            <FontAwesomeIcon icon={faGear} size={20} color={"#adadad"} />

            <Text category="h6" status="warning" style={styles.pageHeading}>
              Settings
            </Text>
          </View>
          <View style={styles.sectionWrap}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("AgentProfile")}
            >
              <FontAwesomeIcon icon={faUser} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Agent Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("CompanyInfo")}
            >
              <FontAwesomeIcon
                icon={faInfoCircle}
                size={30}
                color={"#FFA12D"}
              />
              <Text category="h6" style={styles.sectionHead}>
                Company Information
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("DefEmailPhone")}
            >
              <FontAwesomeIcon icon={faMailBulk} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Default Email/ Phone Options
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("Preferences")}
            >
              <FontAwesomeIcon icon={faSlidersH} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Preferences
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("VideoOptions")}
            >
              <FontAwesomeIcon icon={faVideo} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Video Options
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("TourOptions")}
            >
              <FontAwesomeIcon
                icon={faDirections}
                size={30}
                color={"#FFA12D"}
              />
              <Text category="h6" style={styles.sectionHead}>
                Tour Options
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("FlyerOptions")}
            >
              <FontAwesomeIcon icon={faBookOpen} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Flyer Options
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("TrafficReports")}
            >
              <FontAwesomeIcon icon={faPaste} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Traffic Reports
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("SlideShowDefaults")}
            >
              <FontAwesomeIcon icon={faTv} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Slide Show Defaults
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("PanoramaDefaults")}
            >
              <FontAwesomeIcon
                icon={faVrCardboard}
                size={30}
                color={"#FFA12D"}
              />
              <Text category="h6" style={styles.sectionHead}>
                Panorama Defaults
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("ThemesDefaults")}
            >
              <FontAwesomeIcon
                icon={faPaintBrush}
                size={30}
                color={"#FFA12D"}
              />
              <Text category="h6" style={styles.sectionHead}>
                Themes Defaults
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("BackgroundMusicScreen")}
            >
              <FontAwesomeIcon icon={faMusic} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Background Music Defaults
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("PaymentProfile")}
            >
              <FontAwesomeIcon
                icon={faCreditCard}
                size={30}
                color={"#FFA12D"}
              />
              <Text category="h6" style={styles.sectionHead}>
                Payment Profiles
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("SocialNetworking")}
            >
              <FontAwesomeIcon
                icon={faPeopleArrows}
                size={30}
                color={"#FFA12D"}
              />
              <Text category="h6" style={styles.sectionHead}>
                Setup Social Networking
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.sectionInfo}>
              <FontAwesomeIcon icon={faYoutube} size={30} color={"#FFA12D"} />
              <Text category="h6" style={styles.sectionHead}>
                Youtube Channel
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sectionInfo}
              onPress={() => navigation.navigate("NewsletterForm")}
            >
              <FontAwesomeIcon
                icon={faEnvelopeOpenText}
                size={30}
                color={"#FFA12D"}
              />
              <Text category="h6" style={styles.sectionHead}>
                Add Newsletter Form
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    // justifyContent: "space-between",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "center",
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    marginVertical: 6,
    marginHorizontal: 6,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "44%",
    height: 120,
  },
  sectionHead: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  iconStyle: {
    fontSize: 30,
    color: "#FFA12D",
  },
  floatingButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 70,
    borderRadius: 5,
  },
  counterCards: {
    flexDirection: "row",
    width: "100%",
  },
  countCard: {
    width: Dimensions.get("window").width / 2 - 20,
    margin: 10,
    justifyContent: "center",
  },
  countText: {
    textAlign: "center",
  },
  recentList: {
    flexDirection: "column",
    width: "100%",
    height: 500,
    padding: 10,
  },
  listCard: {
    width: Dimensions.get("window").width - 20,
    marginBottom: 5,
  },
});
