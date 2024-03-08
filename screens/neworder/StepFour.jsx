import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "react-native-paper";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";
import { getOrderInfo } from "../context/OrderInfoContext";
import { getAddedPackages } from "../context/PackagesContext";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";
import { getItem } from "../context/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";

const StepFour = ({
  styles,
  setActiveStep,
  setLoading,
  loading,
  isFocused,
}) => {
  const navigation = useNavigation();
  const [agent_id, setAgentId] = useState();
  const [validCard, setValidCard] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const {
    cardDetails,
    updateCardDetails,
    stepOne,
    stepTwo,
    updateCardErrors,
    cardErrors,
    reset,
  } = getOrderInfo();
  const packageCtx = getAddedPackages();
  const onChangeHandler = (form) => {
    updateCardDetails(form.values);
    updateCardErrors(form.status);
    setValidCard(form.valid);
  };
  useLayoutEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();

      setAgentId(agent_id);
    };
    fetch();
  }, []);
  const submitForm = async () => {
    if (validCard) {
      setLoadingBtn(true);
      const data = {
        number: cardDetails.number,
        name: cardDetails.name,
        expiry: cardDetails.expiry,
        cvc: cardDetails.cvc,
        authenticate_key: "abcd123XYZ",
        agent_id: agent_id,
        street_address: stepOne.address,
        city: stepOne.city,
        zipcode: stepOne.zip,
        notes: stepOne.notes,
        combocategories: [],
        categories: packageCtx.cartePackage.filter(
          (item, i, ar) => ar.indexOf(item) === i
        ),
        packageid: packageCtx.subPackage,
        combopackageid: null,
        miscellaneousids: packageCtx.miscPackage,
        parent_category: packageCtx.cartePackage,
        cc_month: cardDetails.expiry.split("/")[0],
        cc_year: `20${cardDetails.expiry.split("/")[1]}`,
        card_no: cardDetails.number,
        card_holder: cardDetails.name,
        cvv_no: cardDetails.cvc,
        amount: packageCtx.price,
        bed_room: stepTwo.bed_room,
        bath_room: stepTwo.bath_room,
        square_footage: stepTwo.square_footage,
        mls: stepTwo.mls,
        caption: stepTwo.caption,
        year_built: stepTwo.year_built,
        state: stepOne.state,
        interior_area: stepOne.interior_area,
        first_time: stepTwo.timeOne,
        second_time: stepTwo.timeTwo,
        third_time: stepTwo.timeThree,
      };
      const result = await axiosPost("appointment-save", "", "", data, "");
      setLoadingBtn(false);

      if (result.data[0].response.status == "success") {
        resetForm();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Payment Successful",
          position: "top",
          topOffset: "70",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "There was some error 👋",
          position: "top",
          topOffset: "70",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invaid card Details",
        position: "top",
        topOffset: "70",
      });
    }
  };
  const resetForm = () => {
    packageCtx.resetPackages();
    reset();
    setActiveStep(0);
    navigation.navigate("OrdersList");
  };
  const saveForLater = async () => {
    setLoadingBtn(true);
    const data = {
      authenticate_key: "abcd123XYZ",
      agent_id: agent_id,
      street_address: stepOne.address,
      city: stepOne.city,
      zipcode: stepOne.zip,
      notes: stepOne.notes,
      combocategories: [],
      categories: packageCtx.cartePackage.filter(
        (item, i, ar) => ar.indexOf(item) === i
      ),
      packageid: packageCtx.subPackage,
      combopackageid: null,
      miscellaneousids: packageCtx.miscPackage,
      parent_category: packageCtx.cartePackage,
      amount: packageCtx.price,
      bed_room: stepTwo.bed_room,
      bath_room: stepTwo.bath_room,
      square_footage: stepTwo.square_footage,
      mls: stepTwo.mls,
      caption: stepTwo.caption,
      year_built: stepTwo.year_built,
      state: stepOne.state,
      interior_area: stepOne.interior_area,
      first_time: stepTwo.timeOne,
      second_time: stepTwo.timeTwo,
      third_time: stepTwo.timeThree,
      first_choice: stepTwo.dateOne.toDateString(),
      second_choice: stepTwo.dateTwo.toDateString(),
      third_choice: stepTwo.dateThree.toDateString(),
    };
    const result = await axiosPost("save-for-later", "", "", data, "");
    setLoadingBtn(false);
    if (result.data[0].response.status == "success") {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Saved Successfully",
        position: "top",
        topOffset: "70",
      });
      resetForm();
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was some error 👋",
        position: "top",
        topOffset: "70",
      });
    }
  };
  const handleBackButton = () => {
    setActiveStep(2);

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
          <Text style={styles.packageHeading}>Checkout</Text>
        </View>
        <View>
          <Text>Amount : $ {packageCtx.price.toFixed(2)}</Text>
          <Text>Estimated Tax : $ 0.00</Text>
        </View>
        <View>
          <Text>Order Total : $ {packageCtx.price.toFixed(2)}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          allowScroll={true}
          cardScale={1.0}
          placeholderColor={"darkgray"}
          onChange={onChangeHandler}
        />
      </View>
      <View style={styles.nextPrevBtnContainer}>
        <Button
          icon="arrow-right-bold-circle"
          mode="contained"
          buttonColor="#4e02ff"
          onPress={resetForm}
        >
          Cancel
        </Button>
        <Button
          icon="arrow-right-bold-circle"
          mode="contained"
          buttonColor="orange"
          onPress={submitForm}
          loading={loadingBtn}
        >
          Next
        </Button>
      </View>
      <View style={styles.nextPrevBtnContainer}>
        <Button
          icon="arrow-right-bold-circle"
          mode="contained"
          buttonColor="#028dff"
          onPress={saveForLater}
          loading={loadingBtn}
        >
          Save for later
        </Button>
      </View>
    </View>
  );
};

export default StepFour;

const styles = StyleSheet.create({});
