import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { FlatList } from "react-native";
import { axiosPost } from "../commons/Save";

const Package = ({ data }) => {
  useEffect(() => {
    fetchData = async () => {
      const result = await axiosPost();
    };
  }, []);
  const renderListItem = () => {};
  const singleItem = ({ item }) => {
    return (
      <View style={styles.oneSet}>
        <View style={styles.blockHeader}>
          <ImageBackground
            style={styles.imageCover}
            source={{
              uri: item && item.image,
            }}
          >
            <View style={styles.textHead}></View>
          </ImageBackground>
        </View>
        <View style={styles.infoSection}>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "column",
              alignItems: "flex-start",
              
            }}
          >
            <View style={styles.sectionFooterSub}>
              <Text style={[styles.sectionFooterHead, styles.sectionLabels]}>
                {item && item.title}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <FlatList data={data} renderItem={singleItem} />
      <View style={styles.listContainer}>
        <FlatList
          data={data && data.list}
          numColumns={2}
          renderItem={renderListItem}
        />
      </View>
    </>
  );
};

export default Package;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  listContainer: {},
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
  editIcon: {
    marginHorizontal: 5,
    backgroundColor: "#0c722b",
    padding: 5,
    borderRadius: 50,
    color: "white",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    marginHorizontal: 5,
    backgroundColor: "#c50707",
    padding: 5,
    borderRadius: 50,
    color: "white",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
  modalViewSm: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 20,
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
    marginVertical:8,
    // borderRadius: 15,
    // margin: 10,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoSection: {
    paddingBottom: 10,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
    backgroundColor: "#000000a1",

  },
  sectionLabels: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 15,
  },
  sectionLabelsAlt: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionData: {
    backgroundColor: "#ffffff79",
    width: "100%",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#b4b2b2",
  },

  sectionFooterSub: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionFooterHead: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
    flex: 1,
    textAlign: "center",
  },
  toggle: {
    marginTop: 10,
    flex: 1,
  },
  imageCover: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    flexDirection: "row",
    alignItems: "flex-start",
    // borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  textHead: {
    padding: 10,
    justifyContent: "flex-end",
    flexDirection: "row",
    width: "100%",
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  socialIconsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    position: "absolute",
    bottom: "45%",
    right: "45%",
    fontWeight: "bold",
  },
  overlayView: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.349)",
  },
});
