import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@ui-kitten/components";
// import { Button } from "@ui-kitten/components";
import { BlankValidation, emailOnly } from "../Methods/ValidateForms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { axiosPost } from "../commons/Save";
import { ToastAndroid } from "react-native";
import { ActivityIndicator, Button, HelperText } from "react-native-paper";
import { SaveIcon } from "../commons/Icons";
import { TextInput } from "react-native-paper";

const StepOne = ({
  styles,
  setActiveStep,
  setLoading,
  loading,
  LoginButton,
}) => {
  const initalState = {
    fname: "",
    lname: "",
    email: "",
    officephone: "",
  };
  const [stepOneData, setStepOneData] = useState({});
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    officephone: "",
  });
  const validate = () => {
    setLoading(true);
    const result = BlankValidation(stepOneData, checkEmail, errors, setErrors);
    if (result == false) {
      setLoading(false);

      ToastAndroid.show(
        "Please fill all the mandatory fields",
        ToastAndroid.SHORT
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem("stepOne");
        if (value !== null) {
          setStepOneData(JSON.parse(value));
        } else {
          setStepOneData(initalState);
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    fetchData();
  }, []);
  const checkEmail = async () => {
    const data = { email: stepOneData.email };
    const result = await axiosPost("check-email", data);
    if (result.data[0].response.status == "error") {
      setErrors({ ...errors, email: "Email already exists" });

      ToastAndroid.show(result.data[0].response.message, ToastAndroid.SHORT);
      setLoading(false);
    } else proceed();
  };
  const proceed = async () => {
    try {
      await AsyncStorage.setItem("stepOne", JSON.stringify(stepOneData));
      setLoading(false);
      setActiveStep(1);
    } catch (error) {
      setLoading(false);
      // Error saving data
    }
  };
  return (
    <>
      <View style={styles.stepContainer}>
        <View style={styles.formCtrlWrap}>
          <TextInput
            mode="outlined"
            error={errors.fname != ""}
            style={styles.formControl}
            label="First Name"
            value={stepOneData.fname}
            name="fname"
            right={<TextInput.Icon icon="account" />}
            onChangeText={(value) => {
              setStepOneData({ ...stepOneData, fname: value });
              if (value.length == 0)
                setErrors({ ...errors, fname: "Required" });
              else setErrors({ ...errors, fname: "" });
            }}
          />
          <HelperText type="error" visible={errors.fname != ""}>
            {errors.fname}
          </HelperText>
        </View>
        <View style={styles.formCtrlWrap}>
          <TextInput
            mode="outlined"
            error={errors.lname != ""}
            style={styles.formControl}
            label="Last Name"
            value={stepOneData.lname}
            name="fname"
            right={<TextInput.Icon icon="account" />}
            onChangeText={(value) => {
              setStepOneData({ ...stepOneData, lname: value });
              if (value.length == 0)
                setErrors({ ...errors, lname: "Required" });
              else setErrors({ ...errors, lname: "" });
            }}
          />
          <HelperText type="error" visible={errors.lname != ""}>
            {errors.lname}
          </HelperText>
        </View>

        <View style={styles.formCtrlWrap}>
          <TextInput
            mode="outlined"
            error={errors.email != ""}
            style={styles.formControl}
            label="E-Mail"
            value={stepOneData.email}
            name="email"
            right={<TextInput.Icon icon="email" />}
            onChangeText={(value) => {
              setStepOneData({ ...stepOneData, email: value });
              emailOnly(value, setErrors, errors, "email");
            }}
          />
          <HelperText type="error" visible={errors.email != ""}>
            {errors.email}
          </HelperText>
        </View>
        <View style={styles.formCtrlWrap}>
          <TextInput
            mode="outlined"
            error={errors.officephone != ""}
            style={styles.formControl}
            label="Phone Number"
            maxLength={11}
            keyboardType="numeric"
            value={stepOneData.officephone}
            name="officephone"
            right={<TextInput.Icon icon="phone" />}
            onChangeText={(value) => {
              setStepOneData({ ...stepOneData, officephone: value });
              if (value.length == 0)
                setErrors({ ...errors, officephone: "Required" });
              else setErrors({ ...errors, officephone: "" });
            }}
          />
          <HelperText type="error" visible={errors.officephone != ""}>
            {errors.officephone}
          </HelperText>
        </View>
        <View style={styles.nextPrevBtnContainer}>
          <Button
            icon="arrow-right-bold-circle"
            mode="contained"
            buttonColor="orange"
            disabled={
              errors.fname != "" ||
              errors.lname != "" ||
              errors.email != "" ||
              errors.officephone != "" ||
              loading
            }
            onPress={(e) => validate()}
          >
            Next
          </Button>
        </View>
      </View>
        <LoginButton />
    </>
  );
};

export default StepOne;
