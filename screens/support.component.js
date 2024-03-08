/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { StyleSheet, StatusBar, View, Dimensions, Linking } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { useIsFocused } from "@react-navigation/native";
import { CallIcon, EmaillIcon, LocationIcon } from "./commons/Icons";
import { Pressable } from "react-native";
export const SupportScreen = ({ navigation }) => {
  const handleCallPress = () => {
    const phoneNumber = "925-609-2408";
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const handleGmailPress = () => {
    const recipient = "support@VirtualTourCafe.com";
    const url = `mailto:${recipient}`;
    Linking.openURL(url);
  };
  const handleLocationPress = () => {
    const latitude = 37.6961441702836;
    const longitude = -121.924539457672;
    const label = "VirtualTourCafe, LLC";
    const url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    Linking.openURL(url);
  };
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
        {/* <ScrollView contentContainerStyle={{paddingBottom: 50}}> */}
        <View style={styles.headingWrap}>
          <Text category="h6" status="warning" style={styles.pageHeading}>
            VirtualTourCafe Training And Support
          </Text>
        </View>
        <View style={styles.sectionWrap}>
          <Pressable onPress={handleCallPress} style={styles.sectionInfo}>
            <View style={styles.iconWrap}>
              <CallIcon />
            </View>
            <View style={styles.textWrap}>
              <Text category="h6" style={styles.sectionHead}>
                Call Us
              </Text>
              <Text category="s1" style={styles.sectionText}>
                925-609-2408
              </Text>
              <Text category="s1" style={styles.sectionText}>
                877-744-8285 Toll Free
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={handleGmailPress} style={styles.sectionInfo}>
            <View style={styles.iconWrap}>
              <EmaillIcon />
            </View>
            <View style={styles.textWrap}>
              <Text category="h6" style={styles.sectionHead}>
                Email Us
              </Text>
              <Text category="s1" style={styles.sectionText}>
                support@VirtualTourCafe.com
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={handleLocationPress} style={styles.sectionInfo}>
            <View style={styles.iconWrap}>
              <LocationIcon />
            </View>
            <View style={styles.textWrap}>
              <Text category="h6" style={styles.sectionHead}>
                Location
              </Text>
              <Text category="s1" style={styles.sectionText}>
                VirtualTourCafe, LLC 6200 Stoneridge Mall Road, Suite 300,
                Pleasanton, CA 94588
              </Text>
              <Text category="s1" style={styles.sectionText}>
                Mon-Fri 8am – 6pm
              </Text>
              <Text category="s1" style={styles.sectionText}>
                Saturday, 9am-4pm
              </Text>
              <Text category="s1" style={styles.sectionText}>
                Sunday Closed
              </Text>
            </View>
          </Pressable>
        </View>
        {/* </ScrollView> */}
      </Layout>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    // justifyContent: "center",
  },
  pageHeading: {
    color: "#FFA12D",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "center",
  },
  sectionText: { color: "gray", marginVertical: 2 },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    marginVertical: 6,
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
  },
  iconWrap: {
    backgroundColor: "#000000",
    padding: 20,
    borderRadius: 10,
  },
  textWrap: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 20,
    flex: 1,
    flexWrap: "wrap",
  },
  sectionHead: {
    color: "gray",
    fontSize: 20,
    fontWeight: "700",
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
