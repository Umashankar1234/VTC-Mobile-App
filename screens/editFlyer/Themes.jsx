import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { axiosPost } from "../commons/Save";
import { getItem } from "../context/async-storage";
import {
  IndexPath,
  Layout,
  Select,
  SelectGroup,
  SelectItem,
} from "@ui-kitten/components";
import { Button, IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import EditThemeModal from "./Themes/EditThemeModal";
import { useIsFocused } from "@react-navigation/native";

const Themes = ({ route }) => {
  const isFocused = useIsFocused();

  const { tourid } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const [customFlyers, setCustomFlyers] = useState([]);
  const [secondTheme, setSecondTheme] = useState([]);
  const [agentId, setAgentId] = useState();
  const [flyerOneSide, setFlyerOneSide] = useState([]);
  const [flyerTwoSide, setFlyerTwoSide] = useState([]);
  const [displayTitle, setDisplayTitle] = useState("Select a Theme");
  const [displayTitle2, setDisplayTitle2] = useState("Select second Theme");
  const [flyerId, setFlyerId] = useState();
  const [list1, setList1] = useState();
  const [list2, setList2] = useState();
  const [themeName, setThemeName] = useState();
  const [themeId, setThemeId] = useState();
  const [customId, setCustomId] = useState();
  const [selectedThemeImage, setSelectedThemeImage] = useState();
  const [selectedThemeImage2, setSelectedThemeImage2] = useState();
  const [loading, setLoading] = useState(false);
  const [showTheme2, setShowTheme2] = useState(false);
  const [customImage, setCustomImage] = useState();
  const [theme2Img1, setTheme2Img1] = useState();
  const [theme2Img2, setTheme2Img2] = useState();
  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const data = { agentId: agentId, tourid: tourid };
      const result = await axiosPost("getSecond-Theme-Flyers", data);
      setSecondTheme(result.data[0].response.Data);
    };
    if (agentId) fetchData();
  }, [agentId]);
  useEffect(() => {
    const fetchData = async () => {
      const data = { agentId: agentId, tourid: tourid };
      const result = await axiosPost("getFirst-Theme-Flyers", data);
      setCustomFlyers(result.data[0].response.Data[0].custom_flyers);
      setCustomImage(result.data[0].response.Data[0].img);
      setFlyerOneSide(result.data[0].response.Data[1].One_Sided_Details);
      setFlyerTwoSide(result.data[0].response.Data[2].Two_Sided_Details);
    };
    if (agentId) fetchData();
  }, [agentId]);
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0, 1));
  const [selectedIndex1, setSelectedIndex1] = React.useState(
    new IndexPath(0, 1)
  );
  const handleFlyerChange = async (index) => {
    //   {
    //     "flyer_id": "flyer02",
    //     "authenticate_key": "abcd123XYZ",
    //     "tourId": "1303834",
    //     "agent_id": 4767,
    //     "flyerId": "flyer02",
    //     "list1": "flyer02",
    //     "list2": "",
    //     "themeName": "test-template123-258",
    //     "agentId": 4767,
    //     "tourid": "1303834",
    //     "themeId": "test-template123-258",
    //     "customid": 11933
    // }
    if (index.section === 0) {
      let selectedTheme = await customFlyers[index.row];
      setDisplayTitle(selectedTheme.templatename);
      setFlyerId(`flyer0${selectedTheme.id}`);
      setList1(`flyer0${selectedTheme.id}`);
      setThemeName(selectedTheme.templatename);
      setThemeId(selectedTheme.templatename);
      setCustomId(selectedTheme.id);
      setSelectedThemeImage(customImage);
      setSelectedThemeImage2();
      setShowTheme2(false);
    }
    if (index.section === 1) {
      let selectedTheme = await flyerOneSide[index.row];
      setDisplayTitle(selectedTheme.title);
      setFlyerId(`flyer0${selectedTheme.value}`);
      setList1(`flyer0${selectedTheme.value}`);
      setThemeName(selectedTheme.title);
      setThemeId(selectedTheme.title);
      setCustomId(selectedTheme.value);
      setSelectedThemeImage(selectedTheme.img);
      setSelectedThemeImage2();
      setShowTheme2(true);
      setDisplayTitle2("Select second theme");
    }
    if (index.section === 2) {
      let selectedTheme = await flyerTwoSide[index.row];
      setDisplayTitle(selectedTheme.title);
      setFlyerId(`flyer0${selectedTheme.value}`);
      setList1(`flyer0${selectedTheme.value}`);
      setThemeName(selectedTheme.title);
      setThemeId(selectedTheme.title);
      setCustomId(selectedTheme.value);
      setSelectedThemeImage(selectedTheme.img);
      setSelectedThemeImage2(selectedTheme.img2);
      setShowTheme2(true);
      setDisplayTitle2("Select second theme");
    }
  };
  useEffect(() => {
    // listImage-Theme-Flyers
    const fetchData = async () => {
      const data = {
        agentId: agentId,
        tourid: tourid,
        customid: customId,
        flyer_id: flyerId,
        list1: list1,
        themeId,
      };
      const result = await axiosPost("listImage-Theme-Flyers", data);
      setTheme2Img1(result.data[0].response.data[0]);
      setTheme2Img2(result.data[0].response.data[1]);
    };
    if (agentId && themeId && showTheme2) fetchData();
  }, [themeId]);
  const handleTheme2Change = async (index) => {
    const selectedSecondTheme = secondTheme[index.row];
    setDisplayTitle2(selectedSecondTheme.title);
    setThemeName(selectedSecondTheme.value);
    setThemeId(selectedSecondTheme.value);
  };
  const saveFlyerTheme = async () => {
    setLoading(true);
    // save-flyers-theme
    const data = {
      themeId: themeId,
      customid: customId,
      flyer_id: flyerId,
      agentId: agentId,
      tourid: tourid,
      list1: list1,
      tourId: tourid,
      agent_id: agentId,
      flyerId: flyerId,
      list2: "",
      themeName: themeId,
    };
    try {
      const result = await axiosPost("save-flyers-theme", data);
      setLoading(false);

      if (result.data[0].response.status == "success") {
        Toast.show({
          topOffset: 70,
          type: "success",
          text1: "Success",
          text2: result.data[0].response.message,
        });
      } else {
        Toast.show({
          topOffset: 70,
          type: "error",
          text1: "Error",
          text2: "There was some error,try again later",
        });
      }
    } catch (error) {
      setLoading(false);

      Toast.show({
        topOffset: 70,
        type: "error",
        text1: "Error",
        text2: "There was some error,try again later",
      });
    }
  };
  return (
    <>
      <View style={styles.headingWrap}>
        <Text category="h6" status="warning" style={styles.pageHeading}>
          Edit flyer theme
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.sectionWrap}>
        <View style={styles.sectionInfo}>
          <View>
            <View>
              <Text>Select Flyer Theme</Text>
            </View>
            {selectedThemeImage && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedThemeImage }}
                  key={selectedThemeImage}
                  style={[
                    styles.themeImage,
                    selectedThemeImage2 && styles.themeTwoImages,
                  ]}
                />
                {selectedThemeImage2 && (
                  <Image
                    source={{ uri: selectedThemeImage2 }}
                    key={selectedThemeImage2}
                    style={[
                      styles.themeImage,
                      selectedThemeImage2 && styles.themeTwoImages,
                    ]}
                  />
                )}
              </View>
            )}

            <Layout style={styles.container} level="1">
              <Select
                style={styles.select}
                placeholder="Select a Theme"
                selectedIndex={selectedIndex}
                value={displayTitle}
                onSelect={(index) => {
                  setSelectedIndex(index), handleFlyerChange(index);
                }}
              >
                <SelectGroup title="Custom">
                  {/* {customFlyers &&
                    customFlyers.length > 0 &&
                    customFlyers.map((customFlyer) => (
                      <SelectItem
                        title={customFlyer.templatename}
                        value={JSON.stringify(customFlyer)}
                      />
                    ))} */}
                </SelectGroup>
                <SelectGroup title="One Sided Flyer">
                  {flyerOneSide &&
                    flyerOneSide.length > 0 &&
                    flyerOneSide.map((customFlyer) => (
                      <SelectItem
                        title={customFlyer.title}
                        value={JSON.stringify(customFlyer)}
                      />
                    ))}
                </SelectGroup>
                <SelectGroup title="Two Sided Flyer">
                  {flyerTwoSide &&
                    flyerTwoSide.length > 0 &&
                    flyerTwoSide.map((customFlyer) => (
                      <SelectItem
                        title={customFlyer.title}
                        value={JSON.stringify(customFlyer)}
                      />
                    ))}
                </SelectGroup>
              </Select>
            </Layout>
          </View>
          {showTheme2 && (
            <View>
              <View>
                <Text>Select Second Theme</Text>
              </View>
              {theme2Img1 && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: theme2Img1 }}
                    key={theme2Img1}
                    style={[
                      styles.themeImage,
                      theme2Img2 && styles.themeTwoImages,
                    ]}
                  />
                  {theme2Img2 && (
                    <Image
                      source={{ uri: theme2Img2 }}
                      key={theme2Img2}
                      style={[
                        styles.themeImage,
                        theme2Img2 && styles.themeTwoImages,
                      ]}
                    />
                  )}
                </View>
              )}

              <Layout style={styles.container} level="1">
                <Select
                  style={styles.select}
                  placeholder="Select a Theme"
                  selectedIndex={selectedIndex1}
                  value={displayTitle2}
                  onSelect={(index) => {
                    setSelectedIndex1(index), handleTheme2Change(index);
                  }}
                >
                  {secondTheme &&
                    secondTheme.length > 0 &&
                    secondTheme.map((customFlyer) => (
                      <SelectItem
                        title={customFlyer.title}
                        value={customFlyer.value}
                      />
                    ))}
                </Select>
              </Layout>
            </View>
          )}
          <View style={styles.btnContainer}>
            <Button
              icon="content-save"
              mode="contained"
              buttonColor="red"
              loading={loading}
              disabled={loading}
              onPress={() => setModalVisible(true)}
            >
              Edit Saved Theme
            </Button>
            <Button
              icon="content-save"
              mode="contained"
              buttonColor="orange"
              loading={loading}
              disabled={loading}
              onPress={saveFlyerTheme}
            >
              Save
            </Button>
          </View>
        </View>
      </ScrollView>
      <EditThemeModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        tourid={tourid}
        agentId={agentId}
      />
    </>
  );
};

export default Themes;

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pickerHeading: {
    fontWeight: "bold",
    fontSize: 20,
    flexDirection: "row",
    justifyContent: "center",
    color: "purple",
  },
  select: {
    flex: 1,
    margin: 2,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    width: "100%",
  },
  themeImage: { height: 300, width: 300, padding: 8, marginHorizontal: 4 },
  themeTwoImages: { height: 300, width: 150, padding: 8, marginHorizontal: 4 },
  imageContainer: {
    padding: 8,
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    height: 300,
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    marginVertical: 6,
    marginHorizontal: 6,
    // flexDirection: "row",
    // alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "center",
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
});
