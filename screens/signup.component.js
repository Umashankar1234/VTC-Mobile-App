/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import Spinner from "react-native-loading-spinner-overlay";
// import LinearGradient from 'react-native-linear-gradient';
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

import StepOne from "./Register/StepOne";
import StepTwo from "./Register/StepTwo";
import StepThree from "./Register/StepThree";
import { ActivityIndicator, Button } from "react-native-paper";
const EMAIL_REGEX = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
export const SignupScreen = ({ navigation }) => {
  // const {signIn} = useAuthorization();
  // const { signIn } = useAuthorization();
  // const initialUdata = {
  //   fname: "",
  //   lname: "",
  //   email: "",
  //   officephone: "",
  //   password: "",
  //   cnfpassword: "",
  //   user_type: 1,
  // };
  const [loading, setLoading] = useState(false);

  const [activeStep, setActiveStep] = React.useState(0);
  const [udata, setUdata] = React.useState({});
  const [isComplete, setIsComplete] = React.useState(false);
  const LoginButton = () => {
    return (
      <View style={styles.loginBtnContainer}>
        <View style={styles.loginContainer}>
          <Text>Already a member?</Text>

          <Button
            mode="text"
            style={styles.loginBtn}
            // size="large"
            labelStyle={{ fontWeight: 700, fontSize: 16 }}
            onPress={() => navigation.navigate("SignIn")}
            // accessoryRight={RegisterIcon}
          >
            Login
          </Button>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar
        animated={true}
        translucent
        backgroundColor="#000000"
        barStyle="light-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <SafeAreaView style={styles.AndroidSafeArea}>
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
          // customIndicator={<ActivityIndicator color={"#ffa124"}/>}
        />
        <Layout style={styles.container}>
          {/* <View style={styles.backdrop}></View> */}
          <View style={styles.mainHeading}>
            <Text category="h4" status="basic" style={styles.secHeading}>
              Register
            </Text>
          </View>
          <ScrollView nestedScrollEnabled={true}>
            <View style={styles.formAndBtnContainer}>
              <View style={styles.formSteps}>
                <ProgressSteps
                  activeStepIconBorderColor="orange"
                  progressBarColor="orange"
                  activeStep={activeStep}
                  isComplete={isComplete}
                  activeLabelColor="orange"
                >
                  <ProgressStep
                    label="Personal Information"
                    nextBtnStyle={{ display: "none" }}
                    activeStep={activeStep}
                  >
                    <StepOne
                      styles={styles}
                      setUdata={setUdata}
                      udata={udata}
                      setActiveStep={setActiveStep}
                      setLoading={setLoading}
                      loading={loading}
                      LoginButton={LoginButton}
                    />
                  </ProgressStep>
                  <ProgressStep
                    label="Address"
                    nextBtnStyle={{ display: "none" }}
                    previousBtnStyle={{ display: "none" }}
                    onPrevious={(e) => setActiveStep(0)}
                  >
                    <StepTwo
                      styles={styles}
                      setUdata={setUdata}
                      udata={udata}
                      setActiveStep={setActiveStep}
                      setIsComplete={setIsComplete}
                      setLoading={setLoading}
                      loading={loading}
                      LoginButton={LoginButton}
                    />
                  </ProgressStep>
                  <ProgressStep
                    label="Completion Page"
                    nextBtnStyle={{ display: "none" }}
                    previousBtnStyle={{ display: "none" }}
                  >
                    <StepThree navigation={navigation} />
                  </ProgressStep>
                </ProgressSteps>
              </View>
            </View>
          </ScrollView>
        </Layout>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  selectTag: {
    borderWidth: 0.7,
    borderColor: "#000000",
    borderRadius: 8,
  },
  spinnerTextStyle: {
    color: "#ffffff",
  },
  container: {
    flex: 1,
    // justifyContent: "flex-end",
    // alignItems: "center",
    // marginTop: 100,
  },
  formAndBtnContainer: {
    alignContent: "center",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  stepContainer: {
    backgroundColor: "#ffffffff",
    elevation: 10,
    shadowColor: "#52006A",
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  formSteps: { justifyContent: "space-around" },
  mainHeading: {
    backgroundColor: "black",
    width: "100%",
    justifyContent: "center",
    // alignItems: "center",
    paddingLeft: 20,
  },
  loginCard: {
    backgroundColor: "#rgba(255,255,255,0)",
    borderWidth: 0,
    width: Dimensions.get("window").width,
    // shadowColor: 'rgba(255,255,255,0.1)',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.8,
    // shadowRadius: 20,
    // elevation: 20,
    borderRadius: 2,
    paddingVertical: 20,
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 100,
  },
  secHeading: {
    // marginLeft: 15,
    color: "white",
    marginVertical: 20,
    fontSize: 20,
  },
  formControl: {
    // margin: 10,
    // borderRightWidth: 0,
    // borderLeftWidth: 0,
    // borderTopWidth: 0,
    // backgroundColor: "transparent",
    // // borderBottomWidth: 1,
    // borderBottomColor: "#4d4848",
    // paddingLeft: 0,
  },
  textStyle: { color: "black" },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",

    // minHeight: 192,
  },
  modalCard: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalButtonWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    width: Dimensions.get("window").width / 2 - 50,
    margin: 15,
  },
  cardHeading: { marginTop: 10, marginBottom: 10 },
  paragraph: { marginTop: 10, marginBottom: 10 },
  buttonWrap: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: Dimensions.get("window").width,
  },
  loginBtn: {
    borderRadius: 10,
  },
  logoImage: {
    width: 250,
    resizeMode: "contain",
    marginVertical: 5,
    // marginTop: 100,
    // position: 'absolute',
    // top: 10,
    // right: 0,
  },
  loadingWrap: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 50,
    alignItems: "center",
    top: 0,
    left: 0,
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    zIndex: 3,
    // opacity: 0.5,
  },
  errorMsg: {
    marginLeft: 20,
    marginBottom: 10,
    width: "100%",
    textAlign: "left",
    color: "#FF5403",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // flex:1,
  },
  patternWrap: {
    top: 0,
    left: 0,
    width: "100%",
    position: "absolute",
    height: "100%",
    justifyContent: "flex-start",
  },
  patternHoney: {
    height: "90%",
    width: "90%",
    resizeMode: "cover",
    opacity: 0.5,
  },
  waveBgTop: {
    width: 200,
    height: 350,
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    left: 0,
  },
  waveBgBottom: {
    width: 200,
    height: 250,
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  formCtrlWrap: {
    // marginTop: 10,
    // borderBottomColor: "rgba(0,0,0,0.1)",
    // borderBottomWidth: 1,
    // padding: 0,
    // marginHorizontal: 20,
  },
  textInputStyle: {
    // color: 'white',
  },
  formLabel: {
    color: "#rgba(0,0,0,0.3)",
    marginBottom: 0,
    marginTop: 20,
    marginLeft: 10,
  },
  pickerItemStyle: { backgroundColor: "#FFF", color: "#000" },
  nextPrevBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginHorizontal: 10,
    marginTop: 20,
  },
  loginBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // marginBottom: 20,
    // position: "absolute",
    // // marginBottom: 20,
    // bottom: 20,
    // width: "100%",
    // left: 0,
    // right: 0,
    marginTop: 20,
  },
  loginContainer: {
    alignItems: "center",
    flexDirection: "row",
    // justifyContent:"space-between",
  },
});
