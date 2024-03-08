import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { axiosPost } from "../commons/Save";
import { BlankValidation, emailOnly } from "../Methods/ValidateForms";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";
import { ToastAndroid } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem("stepTwo");
    await AsyncStorage.removeItem("stepOne");
    return true;
  } catch (error) {
    return false;
    // Error retrieving data
  }
};
const StepTwo = ({
  styles,
  setActiveStep,
  setIsComplete,
  setLoading,
  loading,
  LoginButton,
}) => {
  const [allStates, setAllStates] = React.useState([]);
  const [allCountries, setAllCountries] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState(0);
  const initalState = {
    countryid: "",
    stateid: "",
    city: "",
    zipcode: "",
    address: "",
  };
  const [stepOneData, setStepOneData] = useState({});
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    city: "",
    zipcode: "",
    address: "",
  });

  const registerAgent = () => {
    const fetch = async () => {
      const stepOne = JSON.parse(await AsyncStorage.getItem("stepOne"));
      const data = { ...stepOne, ...stepOneData };
      register(data);
    };
    const register = (data) => {
      setLoading(true);
      axiosPost("register-agent", data)
        .then((res) => {
          setLoading(false);
          if (res.data[0].response.status == "success") {
            clearStorage();
            setActiveStep(2);
            setIsComplete(true);
          } else
            ToastAndroid.show(res.data[0].response.message, ToastAndroid.SHORT);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    fetch();
  };
  React.useEffect(() => {
    if (stepOneData.countryid !== "") {
      let obj = { country_id: stepOneData.countryid };

      axiosPost("get-states", obj).then((res) => {
        if (res.data[0].response) {
          if (res.data[0].response.status === "success") {
            setAllStates(res.data[0].response.data);
          }
        }
      });
    }
  }, [stepOneData.countryid]);
  React.useEffect(() => {
    axiosPost("get-countries").then((res) => {
      if (res.data[0].response) {
        if (res.data[0].response.status === "success") {
          setAllCountries(res.data[0].response.data);
        }
      }
    });
  }, []);
  const validate = () => {
    const result = BlankValidation(stepOneData, proceed, errors, setErrors);
    if (result == false) {
      setLoading(false);
      ToastAndroid.show(
        "Please fill all the mandatory fields",
        ToastAndroid.SHORT
      );
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem("stepTwo");
        if (value !== null) {
          // We have data!!
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
  const proceed = async () => {
    try {
      await AsyncStorage.setItem("stepTwo", JSON.stringify(stepOneData));
      registerAgent();
    } catch (error) {
      setLoading(false);

      // Error saving data
    }
  };

  return (
    <>
      <View style={styles.stepContainer}>
        <View style={styles.selectTag}>
          <Picker
            selectedValue={stepOneData.countryid}
            label="Country"
            style={styles.selectTag}
            // itemStyle={{backgroundColor: '#FFFFFF', color: '#000000'}}
            color="primary"
            // mode="dropdown"
            onValueChange={(value, itemIndex) => {
              setStepOneData({ ...stepOneData, countryid: value });
              if (value.length == 0)
                setErrors({ ...errors, countryid: "Cannot be empty" });
              else setErrors({ ...errors, countryid: "" });
            }}
          >
            <Picker.Item
              style={styles.pickerItemStyle}
              label="Select Country"
              value=""
            />

            {allCountries &&
              allCountries.length > 0 &&
              allCountries.map((country) => (
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label={country.name}
                  value={country.id}
                  key={country.id}
                />
              ))}
          </Picker>
        </View>
        <HelperText type="error" visible={errors.countryid != ""}>
          {errors.countryid}
        </HelperText>
        <View style={styles.selectTag}>
          <Picker
            selectedValue={stepOneData.stateid}
            label="Country"
            style={styles.selectTag}
            // itemStyle={{backgroundColor: '#FFFFFF', color: '#000000'}}
            color="primary"
            // mode="dropdown"
            onValueChange={(value, itemIndex) => {
              setStepOneData({ ...stepOneData, stateid: value });
              if (value.length == 0)
                setErrors({ ...errors, stateid: "Cannot be empty" });
              else setErrors({ ...errors, stateid: "" });
            }}
          >
            <Picker.Item
              style={styles.pickerItemStyle}
              label="Select State"
              value=""
            />

            {allStates &&
              allStates.length > 0 &&
              allStates.map((state) => (
                <Picker.Item
                  style={styles.pickerItemStyle}
                  label={state.name}
                  value={state.id}
                  key={state.id}
                />
              ))}
          </Picker>
        </View>
        <HelperText type="error" visible={errors.stateid != ""}>
          {errors.stateid}
        </HelperText>
        <View style={styles.formCtrlWrap}>
          <TextInput
            mode="outlined"
            error={errors.city != ""}
            style={styles.formControl}
            label="City"
            value={stepOneData.city}
            name="fname"
            onChangeText={(value) => {
              setStepOneData({ ...stepOneData, city: value });
              if (value.length == 0)
                setErrors({ ...errors, city: "Cannot be empty" });
              else setErrors({ ...errors, city: "" });
            }}
          />
          <HelperText type="error" visible={errors.city != ""}>
            {errors.city}
          </HelperText>
        </View>

        <View style={styles.formCtrlWrap}>
          <TextInput
            mode="outlined"
            error={errors.zipcode != ""}
            style={styles.formControl}
            label="Zip Code"
            value={stepOneData.zipcode}
            name="zipcode"
            keyboardType="numeric"
            maxLength={6}
            onChangeText={(value) => {
              setStepOneData({ ...stepOneData, zipcode: value });
              if (value.length == 0)
                setErrors({ ...errors, zipcode: "Cannot be empty" });
              else setErrors({ ...errors, zipcode: "" });
            }}
          />
          <HelperText type="error" visible={errors.zipcode != ""}>
            {errors.zipcode}
          </HelperText>
        </View>
        <View style={styles.formCtrlWrap}>
          <TextInput
            mode="outlined"
            error={errors.address != ""}
            style={styles.formControl}
            label="Address"
            value={stepOneData.address}
            name="address"
            onChangeText={(value) => {
              setStepOneData({ ...stepOneData, address: value });
              if (value.length == 0)
                setErrors({ ...errors, address: "Cannot be empty" });
              else setErrors({ ...errors, address: "" });
            }}
          />
          <HelperText type="error" visible={errors.address != ""}>
            {errors.address}
          </HelperText>
        </View>

        <View style={styles.nextPrevBtnContainer}>
          <Button
            icon="arrow-right-bold-circle"
            mode="contained"
            buttonColor="orange"
            disabled={loading}
            onPress={async (e) => {
              setActiveStep(0);
              await AsyncStorage.setItem(
                "stepTwo",
                JSON.stringify(stepOneData)
              );
            }}
          >
            Previous
          </Button>
          <Button
            icon="arrow-right-bold-circle"
            mode="contained"
            buttonColor="orange"
            disabled={
              errors.address != "" ||
              errors.zipcode != "" ||
              errors.city != "" ||
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

export default StepTwo;

const styles = StyleSheet.create({});
