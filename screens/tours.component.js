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
  Modal,
  Pressable,
  Alert,
  Image,
  ImageBackground,
  ActivityIndicator,
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
  Toggle,
} from "@ui-kitten/components";
import { getLocation, getUser } from "./context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { fetchRecords, postMethod, fileUploadMethod } from "./commons/Services";
import { useAuthorization } from "./context/AuthProvider";
import ImagesetComponent, {
  RenderActiveImageSet,
} from "./imageSetsComponents/imageset.component";
import { BottomNavigator } from "../assets/layers/bottomnav.component";
import { useMemo } from "react";
const loopVar = [1, 2, 3, 4, 5];

const useToggleState = (initialState = false) => {
  const [checked, setChecked] = React.useState(initialState);

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  return { checked, onChange: onCheckedChange };
};
export const TourScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [noOfPages, setNoOfPages] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [refresh, setRefresh] = React.useState(true);
  const [sharemodalVisible, setShareModalVisible] = React.useState(false);
  const [activeImageSets, setActiveImageSets] = React.useState([]);
  const [userData, setUserData] = React.useState({});
  const [numCols, setNumCols] = React.useState(1);
  const activateToggleState = useToggleState();
  const liveDateToggleState = useToggleState();
  const primaryToggleState = useToggleState();
  React.useEffect(() => {
    setModalVisible(false);
    setShareModalVisible(false);
    setRefresh(true);
  }, [isFocused]);
  const fetchUser = React.useCallback(async () => {
    if (status === "signOut") {
    } else {
      var myInfo = await getUser();
      setUserData(myInfo);
    }
  }, [status]);
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  React.useEffect(() => {
    let componentMounted = true;
    if (Object.entries(userData).length > 0 && refresh) {
      let obj = { agent_id: userData.agent_id,pageNumber };
      postMethod("get-imagesetlist", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            setActiveImageSets(
              res[0].response.data.filter((x) => x.virtualtourservice === 1)
            );
            setNoOfPages(Math.ceil(+res[0].response.datacount));
            setLoading(false);
            setRefresh(false);
          }
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [userData, refresh, isFocused]);
 
  const fetchMoreData = () => {
    if (pageNumber < noOfPages && !loading) {
      setLoading(true);
      let obj = { agent_id: userData.agent_id, pageNumber: pageNumber + 1 };
      postMethod("get-imagesetlist", obj).then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "success") {
            setPageNumber((prevState) => prevState + 1);
            setActiveImageSets((prevData) => [
              ...prevData,
              ...res[0].response.data,
            ]);
            setLoading(false);
            setRefresh(false);
          }
        }
      });
    }
  };
  React.useEffect(() => {
    return () => {
      setPageNumber(1);
      setActiveImageSets([]);
    };
  }, [isFocused]);
  const footerComponent = () => {
    if (loading && pageNumber == noOfPages) {
      return (
        <View style={styles.flatListFooter}>
          <Text>No More Data</Text>
        </View>
      );
    } else if (loading) {
      return (
        <View style={styles.flatListFooter}>
          <ActivityIndicator />
        </View>
      );
    }
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
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Layout style={styles.container}>
          <View style={styles.headingWrap}>
            <View style={{ flexDirection: "row" }}>
              <Icon
                name="film-outline"
                style={styles.tabButton}
                fill="#FFA12D"
              />
              <Text category="h6" status="warning" style={styles.pageHeading}>
                Tours
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.buttonWrap}
                onPress={() => navigation.navigate("Imagesets")}
              >
                <Icon
                  name="image-outline"
                  style={styles.actionButton}
                  fill="#FFA12D"
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.buttonWrap}
                onPress={() => setShareModalVisible(true)}>
                <Icon
                  name="share-outline"
                  style={styles.actionButton}
                  fill="#adadad"
                />
              </TouchableOpacity> */}
            </View>
          </View>
          <View style={{ flexDirection: "column", paddingBottom: 200,
            marginBottom: 50 }}>
            {activeImageSets.length > 0 ? (
              <FlatList
                data={activeImageSets}
                renderItem={({ item }) => {
                  return (
                    <ImagesetComponent
                      key={item.id}
                      imageset={item}
                      userData={userData}
                      setRefresh={setRefresh}
                      navigation={navigation}
                    />
                  );
                }}
                keyExtractor={(item) => item.id}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={footerComponent}
              /> // <FlatList
            ) : //   key={'#' + numCols}
            //   data={activeImageSets}
            //   numColumns={numCols}
            //   ListFooterComponent={
            //     <View style={{height: 0, marginBottom: 80}} />
            //   }
            //   contentContainerStyle={{paddingBottom: 20}}
            //   renderItem={({item}) => renderActiveImageSets(item)}
            //   keyExtractor={item => '_' + item.id}
            // />
            !loading ? (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: Dimensions.get("window").height - 200,
                }}
              >
                <Text>No data found</Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "column",
                  height: Dimensions.get("window").height - 200,
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <ActivityIndicator size="large" color="#FFA12D" />
              </View>
            )}
          </View>
        </Layout>
        {(modalVisible || sharemodalVisible) && (
          <View style={styles.overlayBg} />
        )}
      </ScrollView>
      <View
        style={{
          position: "static",
          zIndex: 9999,
          bottom: 100,
          width: "100%",
        }}
      >
        <BottomNavigator navigation={navigation} />
      </View>
      <View style={styles.centeredView}>
        <Modal
          useNativeDriver={true}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeading}>Options</Text>
              <Pressable
                style={styles.modalPressable}
                onPress={() => {
                  navigation.navigate("CreateImageSets");
                }}
              >
                <Icon
                  name="image-outline"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Create Tour</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon
                  name="edit-outline"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Edit ImageSet</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon
                  name="trash-outline"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Delete ImageSet</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon
                  name="copy-outline"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Duplicate ImageSet</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon
                  name="link-2-outline"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Service Links</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon
                  name="external-link-outline"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Other Links</Text>
              </Pressable>
              <Pressable
                style={styles.modalPressableClose}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Icon
                  name="close-square"
                  style={styles.closeIcon}
                  fill="#FFA12D"
                />
              </Pressable>
              {/* <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}
            </View>
          </View>
        </Modal>
      </View>
      {/* Share Modal */}

      <View style={styles.centeredView}>
        <Modal
          useNativeDriver={true}
          animationType="slide"
          transparent={true}
          visible={sharemodalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setShareModalVisible(!sharemodalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeading}>Distribute</Text>
              <Pressable style={styles.modalPressable}>
                <Icon name="shake" style={styles.modalIcon} fill="#FFA12D" />
                <Text style={styles.modalText}>Distribute Tour</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon name="file-add" style={styles.modalIcon} fill="#FFA12D" />
                <Text style={styles.modalText}>Post to Craigslist</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon name="video" style={styles.modalIcon} fill="#FFA12D" />
                <Text style={styles.modalText}>Video Promotion</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon
                  name="play-circle"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Distribute Video</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon name="npm" style={styles.modalIcon} fill="#FFA12D" />
                <Text style={styles.modalText}>Single Property Domain</Text>
              </Pressable>
              <Pressable style={styles.modalPressable}>
                <Icon
                  name="person-done"
                  style={styles.modalIcon}
                  fill="#FFA12D"
                />
                <Text style={styles.modalText}>Domain Manager</Text>
              </Pressable>
              <Pressable
                style={styles.modalPressableClose}
                onPress={() => setShareModalVisible(!sharemodalVisible)}
              >
                <Icon
                  name="close-square"
                  style={styles.closeIcon}
                  fill="#FFA12D"
                />
              </Pressable>
              {/* <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
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
  flatListFooter: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
