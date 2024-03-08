import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { BlankValidation, emailOnly } from "../Methods/ValidateForms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { getOrderInfo } from "../context/OrderInfoContext";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { axiosPost } from "../commons/Save";
import { BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";

const StepOne = ({ styles, setActiveStep, setLoading, loading, isFocused }) => {
  const {
    stepOne,
    updateStepOne,
    errorOne,
    updateErrorOne,
    reset,
    setErrorOne,
  } = getOrderInfo();

  const navigation = useNavigation();

  const handleBackButton = () => {
    reset();
    navigation.navigate("Home");

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

  const validate = async () => {
    setLoading(true);
    const result = await BlankValidation(
      stepOne,
      checkEmail,
      errorOne,
      setErrorOne
    );
    setLoading(false);
    if (result == false) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Fill all the required fields",
        position: "top",
        topOffset: "70",
      });
    }
  };
  const checkEmail = async () => {
    const url = "check-zipcode";
    const data = { zipcode: stepOne.zip };
    const result = await axiosPost(url, data);
    if (result.data[0].response.status == "error") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: result.data[0].response.message,
        position: "top",
        topOffset: "70",
      });
    } else proceed();
  };
  const proceed = () => {
    setActiveStep(1);
  };
  const onChange = (name, value) => {
    updateStepOne(name, value);
    if (value.length == 0) updateErrorOne(name, "Required");
    else updateErrorOne(name, "");
  };

  return (
    <>
      <View style={styles.stepContainer}>
        <View style={styles.section}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Appointment Information</Text>
          </View>
          <View style={styles.smallInputContainer}>
            <View style={styles.formCtrlWrap}>
              <TextInput
                mode="outlined"
                error={errorOne.broker_zipcode != ""}
                style={styles.formControl}
                label="Broker ZIP"
                keyboardType="numeric"
                value={stepOne.broker_zipcode}
                name="fname"
                right={<TextInput.Icon icon="account" />}
                onChangeText={(value) => {
                  onChange("broker_zipcode", value);
                }}
              />
              <HelperText type="error" visible={errorOne.broker_zipcode != ""}>
                {errorOne.broker_zipcode}
              </HelperText>
            </View>
            <View style={styles.formCtrlWrap}>
              <TextInput
                mode="outlined"
                error={errorOne.zip != ""}
                keyboardType="numeric"
                style={styles.formControl}
                label="Listing ZIP"
                value={stepOne.zip}
                name="fname"
                right={<TextInput.Icon icon="account" />}
                onChangeText={(value) => {
                  onChange("zip", value);
                }}
              />
              <HelperText type="error" visible={errorOne.zip != ""}>
                {errorOne.zip}
              </HelperText>
            </View>
          </View>
          <View style={styles.selectTagContainer}>
            <View style={[styles.selectTag]}>
              <Picker
                selectedValue={stepOne.interior_area}
                label="Square Feet"
                color="primary"
                onValueChange={(value, itemIndex) => {
                  onChange("interior_area", value);
                }}
              >
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="Select Sqft"
                  value=""
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="Under 2000 Sq Ft"
                  value="Under 2000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="2001-3000 Sq Ft"
                  value="2001-3000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="3001-4000 Sq Ft"
                  value="3001-4000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="4001-5000 Sq Ft"
                  value="4001-5000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="5001-6000 Sq Ft"
                  value="5001-6000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="6001-7000 Sq Ft"
                  value="6001-7000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="7001-8000 Sq Ft"
                  value="7001-8000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="Over 8000 Sq Ft"
                  value="Over 8000 Sq Ft"
                />
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label="Vacant Lot"
                  value="Vacant Lot"
                />
              </Picker>
            </View>
            <HelperText type="error" visible={errorOne.interior_area != ""}>
              {errorOne.interior_area}
            </HelperText>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Address</Text>
          </View>
          <View style={styles.smallInputContainer}>
            <View style={styles.formCtrlWrap}>
              <TextInput
                mode="outlined"
                error={errorOne.address != ""}
                style={styles.formControl}
                label="Address"
                value={stepOne.address}
                name="fname"
                right={<TextInput.Icon icon="account" />}
                onChangeText={(value) => {
                  onChange("address", value);
                }}
              />
              <HelperText type="error" visible={errorOne.address != ""}>
                {errorOne.address}
              </HelperText>
            </View>
            <View style={styles.formCtrlWrap}>
              <TextInput
                mode="outlined"
                error={errorOne.city != ""}
                style={styles.formControl}
                label="City"
                value={stepOne.city}
                name="fname"
                right={<TextInput.Icon icon="account" />}
                onChangeText={(value) => {
                  onChange("city", value);
                }}
              />
              <HelperText type="error" visible={errorOne.city != ""}>
                {errorOne.city}
              </HelperText>
            </View>
          </View>
          <View style={styles.smallInputContainer}>
            <View style={styles.selectTagContainer}>
              <View style={[styles.selectTag, styles.formCtrlWrap]}>
                <Picker
                  selectedValue={stepOne.state}
                  label="State"
                  color="primary"
                  onValueChange={(value, itemIndex) => {
                    onChange("state", value);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select State"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="AL"
                    value="AL"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="AK"
                    value="AK"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="AZ"
                    value="AZ"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="AR"
                    value="AR"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="CA"
                    value="CA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="CO"
                    value="CO"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="CT"
                    value="CT"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="DE"
                    value="DE"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="DC"
                    value="DC"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="FL"
                    value="FL"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="GA"
                    value="GA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="HI"
                    value="HI"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="IB"
                    value="IB"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="IL"
                    value="IL"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="IN"
                    value="IN"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="IA"
                    value="IA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="KS"
                    value="KS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="KY"
                    value="KY"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="LA"
                    value="LA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="ME"
                    value="ME"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="MD"
                    value="MD"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="MA"
                    value="MA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="MI"
                    value="MI"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="MM"
                    value="MM"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="MS"
                    value="MS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="MO"
                    value="MO"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="MT"
                    value="MT"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="NE"
                    value="NE"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="NV"
                    value="NV"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="NH"
                    value="NH"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="NJ"
                    value="NJ"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="NM"
                    value="NM"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="NY"
                    value="NY"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="NC"
                    value="NC"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="ND"
                    value="ND"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="OH"
                    value="OH"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="OK"
                    value="OK"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="PA"
                    value="PA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="RI"
                    value="RI"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="SC"
                    value="SC"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="SD"
                    value="SD"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="TN"
                    value="TN"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="TX"
                    value="TX"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="UT"
                    value="UT"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="VT"
                    value="VT"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="VI"
                    value="VI"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="VA"
                    value="VA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="WA"
                    value="WA"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="WV"
                    value="WV"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="WI"
                    value="WI"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="WY"
                    value="WY"
                  />
                </Picker>
              </View>
              <HelperText type="error" visible={errorOne.state != ""}>
                {errorOne.state}
              </HelperText>
            </View>
            <View style={styles.formCtrlWrap}>
              <TextInput
                mode="outlined"
                error={errorOne.zip != ""}
                keyboardType="numeric"
                style={styles.formControl}
                label="ZipCode"
                value={stepOne.zip}
                name="fname"
                right={<TextInput.Icon icon="account" />}
                onChangeText={(value) => {
                  onChange("zip", value);
                }}
              />
              <HelperText type="error" visible={errorOne.zip != ""}>
                {errorOne.zip}
              </HelperText>
            </View>
          </View>
          <View>
            <TextInput
              mode="outlined"
              error={errorOne.notes != ""}
              style={styles.formControl}
              label="Landmark"
              value={stepOne.notes}
              name="fname"
              right={<TextInput.Icon icon="account" />}
              onChangeText={(value) => {
                onChange("notes", value);
              }}
            />
            <HelperText type="error" visible={errorOne.notes != ""}>
              {errorOne.notes}
            </HelperText>
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
            onPress={(e) => reset()}
          >
            Reset
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
            onPress={(e) => validate()}
          >
            Next
          </Button>
        </View>
      </View>
    </>
  );
};

export default StepOne;

const styles = StyleSheet.create({});
