import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { axiosPost } from "../commons/Save";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { Icon } from "@ui-kitten/components";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

const TourThemes = ({
  agentId,
  tourThemes,
  selectedTourTheme,
  setSelectedTourTheme,
  loading,
  setLoading,
}) => {
  const saveTourSettings = async () => {
    setLoading(true);

    const data = {
      agent_id: agentId,
      type: "tour-theme",
      tourtheme: selectedTourTheme,
    };
    const result = await axiosPost(
      "agent-update-theme-default-tour-theme",
      data
    );
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
  };
  return (
    <View style={styles.container}>
      <Button
        style={styles.saveButton}
        mode="contained"
        buttonColor="orange"
        loading={loading}
        disabled={loading}
        icon="content-save"
        onPress={saveTourSettings}
      >
        Update
      </Button>
      <View style={styles.formWrapTab} level="2">
        <ScrollView style={styles.formWrapCard}>
          {tourThemes &&
            tourThemes.length > 0 &&
            tourThemes.map((pt, i) => (
              <Pressable
                onPress={() => setSelectedTourTheme(pt.themeId)}
                key={pt.themeId}
                style={{
                  width: "100%",
                  height: 200,
                  backgroundColor:
                    selectedTourTheme === pt.themeId ? "#FFA12D" : "#ffffff",
                  marginBottom: 20,
                  justifyContent: "space-between",
                  alignItems: "center",
                  elevation: 5,
                }}
              >
                <Image
                  source={{ uri: pt.url }}
                  resizeMode="stretch"
                  style={{ width: "100%", height: 150 }}
                />
                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedTourTheme === pt.themeId && (
                    <Icon
                      name="done-all-outline"
                      style={styles.tabButton}
                      fill="#FFFFFF"
                    />
                  )}
                  <Text
                    category="h6"
                    style={{
                      color:
                        selectedTourTheme === pt.themeId
                          ? "#ffffff"
                          : "#FFA12D",
                      marginLeft: 10,
                    }}
                  >
                    {pt.caption}
                  </Text>
                </View>
              </Pressable>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TourThemes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlayBg: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.8)",
    position: "absolute",
    top: 0,
    left: 0,
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
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
  },
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
  },
  tabButton: {
    width: 32,
    height: 32,
  },
  actionButton: {
    width: 25,
    height: 25,
  },
  buttonWrap: { marginHorizontal: 5 },
  buttonWrapInset: {
    margin: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    width: Dimensions.get("window").width - 20,
    flexWrap: "wrap",
  },
  modalHeading: {
    width: "100%",
    marginBottom: 20,
    marginLeft: 10,
    fontSize: 20,
    color: "#adadad",
  },
  modalText: {
    marginTop: 10,
    textAlign: "center",
    color: "#555555",
    fontSize: 16,
  },
  modalPressable: {
    width: "46%",
    height: 100,
    marginHorizontal: "2%",
    marginVertical: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "rgba(0,0,0,0.8)",
    elevation: 10,
  },
  modalIcon: {
    width: 50,
    height: 50,
  },
  closeIcon: {
    width: 40,
    height: 40,
  },
  modalPressableClose: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  oneSet: {
    padding: 0,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 10,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoSection: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: "space-between",
  },
  sectionLabels: {
    color: "#adadad",
    fontSize: 14,
    marginTop: 15,
  },
  sectionLabelsAlt: {
    color: "#adadad",
    fontSize: 14,
  },
  sectionData: {
    color: "#555555",
    fontSize: 15,
  },
  sectionFooterSub: {
    alignItems: "center",
  },
  sectionFooterHead: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
  },
  toggle: {
    marginTop: 10,
  },
  imageCover: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 15,
  },
  textHead: {
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  formWrapTab: {
    padding: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    margin: 15,
    borderRadius: 15,
  },
  formWrapCard: {
    backgroundColor: "#ffffff",
    // elevation: 10,
    padding: 10,
    height: Dimensions.get("window").height - 330,
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
    marginTop: 20,
    alignSelf: "center",
  },
});
