/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import BrandLogo from "../assets/media/logo.png";
import backImage from "../assets/media/vtcAnimation2.gif";
import topVector from "../assets/media/topVector.png";
import bottomVector from "../assets/media/bottomVector.png";

export const SplashScreen = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
        // showHideTransition={statusBarTransition}
        hidden={true}
      />
      <Layout
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9F9F9",
        }}
      >
        <Image source={backImage} style={styles.bgImage} resizeMode="contain" />
      </Layout>
      {/* <ImageBackground
        source={backImage}
        resizeMode="cover"
        style={styles.image}>
        <Image source={BrandLogo} style={styles.logoImage} />
      </ImageBackground> */}
    </>
  );
};
var styles = StyleSheet.create({
  logoImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  waveBgTop: {
    width: 200,
    height: 350,
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.1,
  },
  waveBgBottom: {
    width: 200,
    height: 250,
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.1,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
