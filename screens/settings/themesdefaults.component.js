/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
} from "react-native";
import { Layout, Text, Tab, TabBar, ViewPager } from "@ui-kitten/components";
import { getItem, getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAuthorization } from "../context/AuthProvider";
import {
  faPaintBrush,
  faBookOpen,
  faDirections,
  faHighlighter,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-native-paper";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";
import FlyerThemes from "../themeDefaults/FlyerThemes";
import TourThemes from "../themeDefaults/TourThemes";
import PremiumTourTheme from "../themeDefaults/PremiumTourTheme";

const FlyerIcon = (props) => (
  <FontAwesomeIcon icon={faBookOpen} size={25} color={"#FFA12D"} />
);

const TourIcon = (props) => (
  <FontAwesomeIcon icon={faDirections} size={25} color={"#FFA12D"} />
);

const PreTourIcon = (props) => (
  <FontAwesomeIcon icon={faHighlighter} size={25} color={"#FFA12D"} />
);

export const ThemesDefaultsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [agentId, setAgentId] = React.useState({});
  const [flyerTheme, setFlyerTheme] = React.useState({
    themeOne: "",
    themeTwo: "",
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [loading, setLoading] = React.useState(false);
  const [tourThemes, setTourThemes] = React.useState({});
  const [selectedTourTheme, setSelectedTourTheme] = React.useState();
  const [selectedPremiumTourTheme, setselectedPremiumTourTheme] =
    React.useState({
      enabled: "",
      themeid: "",
    });
  const [premiumThemes, setPremiumThemes] = React.useState({});
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });
  React.useEffect(() => {
    let componentMounted = true;
    let obj = { agent_id: agentId };
    postMethod("agent-get-theme-default-settings", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          const flyerTheme =
            res[0].response.data.flyer_theme.flyertheme_pagename;
          setFlyerTheme({
            themeOne: flyerTheme.split("-")[0],
            themeTwo: flyerTheme.split("-")[1],
          });
          setSelectedTourTheme(res[0].response.data.tour_theme.tourtheme);
          setselectedPremiumTourTheme({
            enabled:
              res[0].response.data.premium_tour_theme.is_premium_tour_theme,
            themeid: res[0].response.data.premium_tour_theme.premium_tour_theme,
          });
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [agentId]);

  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const data = { agentId: agentId };
      const result = await axiosPost("get-setting-Themes", data);
      setTourThemes(result.data[0].response.dataTotalArray[0].datathemeArray);
      setPremiumThemes(result.data[0].response.dataTotalArray[0].premiumArry);
    };
    fetchData();
  }, [agentId]);
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
        <View style={styles.headingWrap}>
          <View style={[styles.headingWrap,{margin:0}]}>
            <FontAwesomeIcon icon={faPaintBrush} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Themes Defaults
            </Text>
          </View>
        </View>
        <View>
          <TabBar
            style={{
              paddingVertical: 15,
              backgroundColor: "#fff",
              elevation: 2,
            }}
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <Tab title="Flyer Themes" icon={FlyerIcon} />
            <Tab title="Tour Themes" icon={TourIcon} />
            <Tab title="Premium Tour Themes" icon={PreTourIcon} />
          </TabBar>
          <ViewPager
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <FlyerThemes
              styles={styles}
              flyerTheme={flyerTheme}
              setFlyerTheme={setFlyerTheme}
              agentId={agentId}
              loading={loading}
              setLoading={setLoading}
            />
            <TourThemes
              tourThemes={tourThemes}
              agentId={agentId}
              loading={loading}
              setLoading={setLoading}
              selectedTourTheme={selectedTourTheme}
              setSelectedTourTheme={setSelectedTourTheme}
            />
            <PremiumTourTheme
              agentId={agentId}
              loading={loading}
              setLoading={setLoading}
              premiumThemes={premiumThemes}
              setselectedPremiumTourTheme={setselectedPremiumTourTheme}
              selectedPremiumTourTheme={selectedPremiumTourTheme}
            />
          </ViewPager>
        </View>
      </Layout>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  select: {
    flex: 1,
    margin: 2,
    width: "100%",
    marginVertical: 16,
    marginBottom:70,
  },
  container1: {
    flex: 1,
    backgroundColor: "transparent",
  },
  formWrapTab: {
    padding: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    margin: 15,
    borderRadius: 15,
  },

  pickerContainer: { marginBottom:50 },
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
    margin: 8,
    // height: 400,
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    alignSelf: "center",
  },
});
