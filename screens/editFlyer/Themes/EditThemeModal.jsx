import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { axiosPost } from "../../commons/Save";
import { Button, TextInput } from "react-native-paper";
import { ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

const EditThemeModal = ({ modalVisible, setModalVisible, tourid, agentId }) => {
  const [customEditFlyThemeData, setCustomEditFlythemeData] = useState({});
  const [editFlyerThemeData, setEditFlyerThemeData] = useState({});
  const [themeDataInfo, setThemeDataInfo] = useState([]);
  const [themesId, setThemesId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = { agentId: agentId, tourid: tourid };
      const result = await axiosPost("get-Theme-Flyers", data);
      setEditFlyerThemeData(result.data[0].response);
      setThemeDataInfo(result.data[0].response.data);
      setThemesId(result.data[0].response.data[0].theme_id);
    };
    if (tourid && agentId) fetchData();
  }, [tourid, agentId]);
  useEffect(() => {
    const fetchData = async () => {
      const data = { agentid: agentId, tourId: tourid, themeId: "0" };
      const result = await axiosPost("get-customizeThemeFlyers", data);
      setCustomEditFlythemeData(result.data[0].response.data[0]);
    };
    if (tourid && agentId) fetchData();
  }, [tourid, agentId]);
  const onChange = (name, value) => {
    setCustomEditFlythemeData({ ...customEditFlyThemeData, [name]: value });
  };
  const closeModal = () => {
    setModalVisible(!modalVisible);
  };
  const saveChanges = async () => {
    try {
      customEditFlyThemeData.authenticate_key = "abcd123XYZ";
      customEditFlyThemeData.agent_id = agentId;
      customEditFlyThemeData.tourId = tourid;
      customEditFlyThemeData.hdnCustomeThemeId =
        customEditFlyThemeData.customthemeid;
      customEditFlyThemeData.txtFlyerName = customEditFlyThemeData.templateName;
      const result = await axiosPost(
        "update-FlyerTemplate",
        "",
        "",
        customEditFlyThemeData,
        ""
      );
      if (result.data[0].response.status == "success") {
        Alert.alert("Data Saved Successfully");
        setModalVisible(!modalVisible);
      } else Alert.alert("There was an error saving");
    } catch (error) {
      Alert.alert("There was an error saving");
    }
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalView}>
            <View style={styles.modalHeading}>
              <Text style={styles.modalHeadingText}>Flyer Designer</Text>
            </View>
            {editFlyerThemeData.data && (
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: editFlyerThemeData.data[0]?.url }}
                />
              </View>
            )}

            <View style={styles.modalEditContent}>
              <Text style={styles.packageHeading}>Flyer Name </Text>
              <View style={styles.modalSubEditContent}>
                <Text>Template Name</Text>
                <TextInput
                  value={customEditFlyThemeData.templateName}
                  onChangeText={(value) => {
                    onChange("templateName", value);
                  }}
                />
              </View>
            </View>
            <View style={styles.modalEditContent}>
              <Text style={styles.packageHeading}>Title </Text>
              <View style={styles.modalSubEditContent}>
                <Text>Text Align</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.align}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("align", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Align"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="LEFT"
                    label="LEFT"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="RIGHT"
                    label="RIGHT"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="CENTER"
                    label="CENTER"
                  />
                </Picker>
              </View>
              <View style={styles.modalSubEditContent}>
                <Text>Font Size</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.fontSize}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("fontSize", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Size"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="10"
                    label="10"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="11"
                    label="11"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="12"
                    label="12"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="14"
                    label="14"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="16"
                    label="16"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="18"
                    label="18"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="20"
                    label="20"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="24"
                    label="24"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="26"
                    label="26"
                  />
                </Picker>
              </View>
              <View style={styles.modalSubEditContent}>
                <Text>Font Family</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.fontFamily}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("fontFamily", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Font Family"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Roboto"
                    label="Roboto"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Verdana"
                    label="Verdana"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="RoboGeorgiato"
                    label="Georgia"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Courier New"
                    label="Courier New"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Arial"
                    label="Arial"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Tahoma"
                    label="Tahoma"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Trebuchet MS"
                    label="Trebuchet MS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Times New Roman"
                    label="Times New Roman"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Palatino Linotype"
                    label="Palatino Linotype"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Lucida Sans Unicode"
                    label="Lucida Sans Unicode"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Lucida Console"
                    label="Lucida Console"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="MS Serif"
                    label="MS Serif"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Comic Sans MS"
                    label="Comic Sans MS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Helvetica"
                    label="Helvetica"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Impact"
                    label="Impact"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Andale"
                    label="Andale"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Futura"
                    label="Futura"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Gill Sans"
                    label="Gill Sans"
                  />
                </Picker>
              </View>
            </View>
            <View style={styles.modalEditContent}>
              <Text style={styles.packageHeading}>Agent Information </Text>
              <View style={styles.modalSubEditContent}>
                <Text>Font Size</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.agentFontSize}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("agentFontSize", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Size"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="10"
                    label="10"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="11"
                    label="11"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="12"
                    label="12"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="14"
                    label="14"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="16"
                    label="16"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="18"
                    label="18"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="20"
                    label="20"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="24"
                    label="24"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="26"
                    label="26"
                  />
                </Picker>
              </View>
              <View style={styles.modalSubEditContent}>
                <Text>Font Family</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.agentFontFamily}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("agentFontFamily", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Font Family"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Roboto"
                    label="Roboto"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Verdana"
                    label="Verdana"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="RoboGeorgiato"
                    label="Georgia"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Courier New"
                    label="Courier New"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Arial"
                    label="Arial"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Tahoma"
                    label="Tahoma"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Trebuchet MS"
                    label="Trebuchet MS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Times New Roman"
                    label="Times New Roman"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Palatino Linotype"
                    label="Palatino Linotype"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Lucida Sans Unicode"
                    label="Lucida Sans Unicode"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Lucida Console"
                    label="Lucida Console"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="MS Serif"
                    label="MS Serif"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Comic Sans MS"
                    label="Comic Sans MS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Helvetica"
                    label="Helvetica"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Impact"
                    label="Impact"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Andale"
                    label="Andale"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Futura"
                    label="Futura"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Gill Sans"
                    label="Gill Sans"
                  />
                </Picker>
              </View>
            </View>
            <View style={styles.modalEditContent}>
              <Text style={styles.packageHeading}>Company Information </Text>
              <View style={styles.modalSubEditContent}>
                <Text>Font Size</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.companyFontSize}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("companyFontSize", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Size"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="10"
                    label="10"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="11"
                    label="11"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="12"
                    label="12"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="14"
                    label="14"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="16"
                    label="16"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="18"
                    label="18"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="20"
                    label="20"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="24"
                    label="24"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="26"
                    label="26"
                  />
                </Picker>
              </View>
              <View style={styles.modalSubEditContent}>
                <Text>Font Family</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.companyfontFamily}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("companyfontFamily", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Font Family"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Roboto"
                    label="Roboto"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Verdana"
                    label="Verdana"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="RoboGeorgiato"
                    label="Georgia"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Courier New"
                    label="Courier New"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Arial"
                    label="Arial"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Tahoma"
                    label="Tahoma"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Trebuchet MS"
                    label="Trebuchet MS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Times New Roman"
                    label="Times New Roman"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Palatino Linotype"
                    label="Palatino Linotype"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Lucida Sans Unicode"
                    label="Lucida Sans Unicode"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Lucida Console"
                    label="Lucida Console"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="MS Serif"
                    label="MS Serif"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Comic Sans MS"
                    label="Comic Sans MS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Helvetica"
                    label="Helvetica"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Impact"
                    label="Impact"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Andale"
                    label="Andale"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Futura"
                    label="Futura"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="Gill Sans"
                    label="Gill Sans"
                  />
                </Picker>
              </View>
            </View>
            <View style={styles.modalEditContent}>
              <Text style={styles.packageHeading}>Description</Text>
              <View style={styles.modalSubEditContent}>
                <Text>Font Size</Text>
                <Picker
                  themeVariant="light"
                  selectedValue={customEditFlyThemeData.descfontsize}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    onChange("descfontsize", itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select Size"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="10"
                    label="10"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="11"
                    label="11"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="12"
                    label="12"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="14"
                    label="14"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="16"
                    label="16"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="18"
                    label="18"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="20"
                    label="20"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="24"
                    label="24"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="26"
                    label="26"
                  />
                </Picker>
              </View>
            </View>
            <View style={styles.btnContainer}>
              <Button mode="contained" buttonColor="red" onPress={closeModal}>
                Back
              </Button>
              <Button
                mode="contained"
                buttonColor="orange"
                onPress={saveChanges}
              >
                Save
              </Button>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default EditThemeModal;

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { height: 200, width: 200 },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  formControl: {
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#dddbdb",
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  packageHeading: { fontWeight: 800 },
  modalSubEditContent: { margin: 10 },
  modalEditContent: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    marginVertical: 10,
  },
  modalHeadingText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  modalContent: { flex: 1 },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
