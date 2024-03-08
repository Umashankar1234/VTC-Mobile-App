/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Divider, Icon, Layout, Text } from "@ui-kitten/components";
import { BottomNavigator } from "../assets/layers/bottomnav.component";
import { getItem, getUser } from "./context/async-storage";
import { useAuthorization } from "./context/AuthProvider";
// import SyncStorage from 'sync-storage';
// import recent1 from '../assets/media/hm-banner-1-min.jpg';
// import recent2 from '../assets/media/bgimg1.jpg';
// import recent3 from '../assets/media/hm-banner-new-2-min.jpg';
// import recent4 from '../assets/media/hm-banner-new-3-min.jpg';
import { Image } from "react-native";
import MenuTiles from "./buttons/MenuTiles";
import { useIsFocused } from "@react-navigation/native";
import { axiosPost } from "./commons/Save";
import { Pressable } from "react-native";
import { ActivityIndicator } from "react-native-paper";
export const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [agentId, setAgentId] = useState();
  const [userData, setUserData] = React.useState({});

  const { status } = useMemo(() => useAuthorization(), [isFocused]);
  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    if (isFocused) fetch();
  }, [isFocused]);
  React.useEffect(() => {
    const fetchUser = async () => {
      let obj = { agent_id: agentId };
      const result = await axiosPost("agent-dashboard", obj);
      if (result.data[0].response.status === "success") {
        setUserData(result.data[0].response.data);
      }
    };
    if (agentId) fetchUser();
  }, [agentId]);
  if (Object.entries(userData).length === 0) {
    return (
      <Image
        source={require("../assets/media/Loading3.gif")}
        resizeMode="stretch"
        resizeMethod="scale"
        style={{ alignSelf: "center" }}
      />
    );
  }
  return (
    <>
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <ScrollView bounces={false} nestedScrollEnabled={true}>
        <Layout style={styles.container}>
          <View style={styles.userHeadBanner}>
            <View style={styles.userHeadText}>
              <View style={styles.colorHeading}>
                <Text status="basic" category="h6" style={styles.lightText}>
                  Welcome{" "}
                </Text>
                <Text status="primary" category="h5">
                  {userData &&
                    Object.entries(userData).length !== 0 &&
                    userData.agent_profile.name}
                </Text>
              </View>
            </View>
            <View style={styles.userHeadImage}>
              <Pressable
                onPress={() => navigation.navigate("AgentProfile")}
                android_ripple={{
                  color: "#e4e4e4",
                  radius: 40,
                  borderless: true,
                }}
              >
                <Icon
                  name="person"
                  style={styles.userProfiledefIcon}
                  fill="#FFA12D"
                />
              </Pressable>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={styles.buttonlgWrap}
          >
            <MenuTiles
              iconName="paper-plane-outline"
              onPress={() => navigation.navigate("CreateImageSets")}
            >
              Get Started
            </MenuTiles>
            <MenuTiles
              iconName="play-circle-outline"
              onPress={() => navigation.navigate("Imagesets")}
            >
              Your First Tour
            </MenuTiles>
            <MenuTiles
              iconName="color-palette-outline"
              onPress={() => navigation.navigate("Imagesets")}
            >
              Manage Image Sets
            </MenuTiles>
            <MenuTiles
              iconName="color-palette-outline"
              onPress={() => navigation.navigate("OrdersList")}
            >
              Orders
            </MenuTiles>
            <MenuTiles
              iconName="person-done-outline"
              onPress={() => navigation.navigate("Account")}
            >
              My account status
            </MenuTiles>
            <MenuTiles
              iconName="archive-outline"
              onPress={() => navigation.navigate("NewOrder")}
            >
              Schedule an appointment
            </MenuTiles>
          </ScrollView>
          <Divider />
          {Object.entries(userData).length !== 0 && (
            <View style={styles.aboutContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: userData.agent_profile.profile_img }}
                  style={styles.agentImage}
                />
                <Text style={styles.agentLicense}>
                  #{userData.agent_profile.licenceno}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.aboutHeading}>About</Text>
                <ScrollView
                  nestedScrollEnabled={true}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <Text>{userData.agent_profile.profile_content}</Text>
                </ScrollView>
              </View>
            </View>
          )}
          {Object.entries(userData).length !== 0 &&
            userData.tour.tour_image && (
              <View style={styles.favorites}>
                <Text style={styles.favoritesHeader}>Your Favorites</Text>
                <View style={styles.favorites}>
                  <TouchableOpacity
                    style={styles.recentBlock}
                    onPress={() => {}}
                  >
                    <ImageBackground
                      source={{ uri: userData.tour.tour_image }}
                      resizeMode="cover"
                      style={styles.recentImage}
                    >
                      <View style={styles.overlay}></View>
                    </ImageBackground>
                    <View style={styles.recentText}>
                      <Text style={styles.lightText}>
                        {userData.tour.city}, {userData.tour.statename},{" "}
                        {userData.tour.countryname}, {userData.tour.zipcode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </Layout>
      </ScrollView>
      <View
        style={{
          position: "static",
          zIndex: 9999,
          bottom: 0,
          width: "100%",
        }}
      >
        <BottomNavigator navigation={navigation} />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  userHeadBanner: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  userHeadText: {
    flexDirection: "column",
  },
  userHeadImage: {
    backgroundColor: "#ffffff",
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 20,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  userProfiledefIcon: {
    width: 50,
    height: 50,
  },
  colorHeading: {
    // width: '100%',
    paddingHorizontal: 10,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pageHeading: {
    width: "100%",
    padding: 10,
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
  recentBlock: {
    width: "100%",
    height: 180,
    elevation: 10,
    padding: 0,
    flexDirection: "column",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  recentImage: {
    width: "100%",
    height: 120,
    marginBottom: 5,
    resizeMode: "cover",
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    height: 50,
    width: 60,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    margin: 5,
  },
  overlayIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "80%",
  },
  recentText: {
    paddingHorizontal: 10,
  },
  lightText: {
    color: "gray",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonlgWrap: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    marginVertical: 20,
  },
  buttonLg: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 4,
    margin: 10,
    elevation: 10,
    backgroundColor: "#fff",
    height: 100,
    width: 100,
  },
  lgbtnText: {
    textAlign: "center",
    color: "gray",
  },
  largeIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  aboutContainer: {
    flex: 1,
    flexDirection: "row",
  },
  imageContainer: {
    flex: 0.5,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    padding: 8,
    height: 200,
  },
  agentImage: {
    height: 130,
    width: 130,
    // minHeight: 140,
    // height: '100%',
    // width: "100%",
    borderRadius: 65,
  },
  agentLicense: {
    textAlign: "center",
    backgroundColor: "#102e7a",
    width: "70%",
    color: "#ffffff",
    marginTop: 10,
  },
  aboutHeading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  favorites: {
    marginTop: 20,
    padding: 8,
  },
  favoritesHeader: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  favoriteImages: {
    width: "100%",
    height: "100%",
  },
});
