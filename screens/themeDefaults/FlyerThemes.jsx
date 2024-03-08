import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";
import {
  IndexPath,
  Select,
  SelectGroup,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import { Button } from "react-native-paper";

const FlyerThemes = ({
  styles,
  flyerTheme,
  setFlyerTheme,
  agentId,
  loading,
  setLoading,
}) => {
  const [selectedIndex1, setSelectedIndex1] = React.useState(0);
  const [selectedIndex2, setSelectedIndex2] = React.useState(0);
  const [flyerOneSide, setFlyerOneSide] = useState([]);
  const [flyerTwoSide, setFlyerTwoSide] = useState([]);
  const [secondTheme, setSecondTheme] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = { agentId: agentId, tourid: 1303834 };
      const result = await axiosPost("getFirst-Theme-Flyers", data);
      setFlyerOneSide(result.data[0].response.Data[1].One_Sided_Details);
      setFlyerTwoSide(result.data[0].response.Data[2].Two_Sided_Details);
    };
    if (agentId) fetchData();
  }, [agentId]);
  useEffect(() => {
    const fetchData = async () => {
      const data = { agentId: agentId, tourid: 1303834 };
      const result = await axiosPost("getSecond-Theme-Flyers", data);
      setSecondTheme(result.data[0].response.Data);
    };
    if (agentId) fetchData();
  }, [agentId]);
  const handleTheme2Change = (index) => {
    setFlyerTheme({
      ...flyerTheme,
      themeTwo: secondTheme[index.row].value,
    });
  };
  const saveFlyerSettings = async () => {
    // agent-update-theme-default-flyer-theme
    setLoading(true);
    const data = {
      flyertheme_pagename: flyerTheme.themeOne,
      flyertheme: flyerTheme.themeTwo,
      type: "flyer-theme",
      agent_id: agentId,
    };
    const result = await axiosPost(
      "agent-update-theme-default-flyer-theme",
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
  const handleFlyerChange = (index) => {
    if (index.section === 0) {
      setFlyerTheme({
        ...flyerTheme,
        themeOne: flyerOneSide[index.row].title.replace(/\s/g, ""),
      });
    } else
      setFlyerTheme({
        ...flyerTheme,
        themeOne: flyerTwoSide[index.row].title.replace(/\s/g, ""),
      });
  };
  return (
    <View style={styles.container1}>
      <View style={styles.formWrapTab} level="2">
        <View style={styles.uploadImages}>
          <Text category="h5">Flyer</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Select
            style={styles.select}
            placeholder="Select a Theme"
            selectedIndex={selectedIndex1}
            value={flyerTheme.themeOne}
            onSelect={(index) => {
              setSelectedIndex1(index), handleFlyerChange(index);
            }}
          >
            <SelectGroup title="One Sided Flyer">
              {flyerOneSide &&
                flyerOneSide.length > 0 &&
                flyerOneSide.map((customFlyer) => (
                  <SelectItem
                    title={customFlyer.title}
                    value={customFlyer.title.replace(/\s/g, "")}
                  />
                ))}
            </SelectGroup>
            <SelectGroup title="Two Sided Flyer">
              {flyerTwoSide &&
                flyerTwoSide.length > 0 &&
                flyerTwoSide.map((customFlyer) => (
                  <SelectItem
                    title={customFlyer.title}
                    value={customFlyer.title.replace(/\s/g, "")}
                  />
                ))}
            </SelectGroup>
          </Select>
          <Select
            style={styles.select}
            placeholder="Select a Theme"
            selectedIndex={selectedIndex2}
            value={flyerTheme.themeTwo}
            onSelect={(index) => {
              setSelectedIndex2(index), handleTheme2Change(index);
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
        </View>
        <View>
          <Button
            style={styles.saveButton}
            mode="contained"
            buttonColor="orange"
            loading={loading}
            disabled={loading}
            icon="content-save"
            onPress={saveFlyerSettings}
          >
            Update
          </Button>
        </View>
      </View>
    </View>
  );
};

export default FlyerThemes;

// const styles = StyleSheet.create({});
