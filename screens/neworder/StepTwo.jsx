import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { getItem } from "../context/async-storage";
import { axiosPost } from "../commons/Save";
import { FlatList } from "react-native";
import { Button } from "react-native-paper";
import { getAddedPackages } from "../context/PackagesContext";
import Toast from "react-native-toast-message";
import { BackHandler } from "react-native";

const StepTwo = ({ styles, setActiveStep, setLoading, loading, isFocused }) => {
  const [agent_id, setAgentId] = useState();
  const [cartePackage, setCartePackage] = useState([]);
  const [comboPackage, setComboPackage] = useState([]);
  const result = getAddedPackages();
  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    fetch();
  }, []);
  useLayoutEffect(() => {
    const fetch = async () => {
      const data = { agent_id: agent_id };

      const result = await axiosPost("all-packages", data);
      setComboPackage(result.data[0].response.data.combopackage);
      setCartePackage(result.data[0].response.data.package);
    };
    if (agent_id) fetch();
  }, [isFocused, agent_id]);
  const proceed = () => {
    if (result.subPackage.length == 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a package",
        position: "top",
        topOffset: "70",
      });
    } else setActiveStep(2);
  };
  const handleBackButton = () => {
    setActiveStep(0);

    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );

    return () => {
      backHandler.remove();
    };
  }, [isFocused]);

  return (
    <View style={styles.stepContainer}>
      <View style={styles.packageContainer}>
        <View style={styles.packageHeadingContainer}>
          <Text style={styles.packageHeading}>A-La-Carte Package</Text>
        </View>
        <View>
          <FlatList
            data={cartePackage}
            renderItem={({ item }) => SingleItem(item, result, styles)}
          />
        </View>
      </View>
      <View style={styles.packageContainer}>
        <View style={styles.packageHeadingContainer}>
          <Text style={styles.packageHeading}>Combo Packages</Text>
        </View>
        <View>
          <FlatList
            data={comboPackage}
            renderItem={({ item }) => SingleItem(item, result, styles)}
          />
        </View>
      </View>
      <View style={styles.nextPrevBtnContainer}>
        <Button
          icon="arrow-right-bold-circle"
          mode="contained"
          buttonColor="#4e02ff"
          // disabled={
          //   errors.fname != "" ||
          //   errors.lname != "" ||
          //   errors.email != "" ||
          //   errors.officephone != "" ||
          //   loading
          // }
          onPress={(e) => setActiveStep(0)}
        >
          Go Back
        </Button>
        <Button
          icon="arrow-right-bold-circle"
          mode="contained"
          buttonColor="orange"
          // disabled={
          //   errors.fname != "" ||
          //   errors.lname != "" ||
          //   errors.email != "" ||
          //   errors.officephone != "" ||
          //   loading
          // }
          onPress={proceed}
        >
          Next
        </Button>
      </View>
    </View>
  );
};
export const SingleItem = (item, result, styles) => {
  const removeItem = async (id, price) => {
    result.removeCartePackage(item.id);
    result.removeSubPackage(id, price);
  };
  const addToCart = async (id, price) => {
    result.addCartePackage(item.id);
    result.addSubPackage(id, price);
  };
  const openModal = (id) => {
  };
  return (
    <View>
      <View style={styles.subHeadingContainer}>
        <Text style={styles.subHeading}>{item?.title}</Text>
      </View>
      <View style={styles.subPackagesContainer}>
        <FlatList
          data={item?.package_details}
          renderItem={({ item }) => {
            return (
              <View style={styles.subPackageContainer}>
                <Pressable onPress={() => openModal(item.id)}>
                  <View style={styles.subPackageImageContainer}>
                    <Image
                      source={{ uri: item?.image }}
                      style={styles.subPackageImage}
                    />
                  </View>
                  <View>
                    <Text style={styles.subPackageTitle}>{item?.title}</Text>
                  </View>
                  <View>
                    <Text>${item?.price}</Text>
                  </View>
                </Pressable>
                <View style={styles.subPackageBtnContainer}>
                  {result.subPackage.includes(item.id) ? (
                    <Button
                      onPress={() => removeItem(item.id, item.price)}
                      icon="cart"
                      mode="contained"
                    >
                      Remove Item
                    </Button>
                  ) : (
                    <Button
                      onPress={() => addToCart(item.id, item.price)}
                      icon="cart"
                      mode="contained"
                    >
                      Add To Cart
                    </Button>
                  )}
                </View>
              </View>
            );
          }}
          horizontal={true}
        />
      </View>
    </View>
  );
};
export default StepTwo;

const styles = StyleSheet.create({});
