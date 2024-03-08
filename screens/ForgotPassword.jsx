import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Layout } from "@ui-kitten/components";
import { ScrollView } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";
import { Image } from "react-native";
import VTCLogo from "../assets/media/logo.png";
import { Dimensions } from "react-native";
import { emailOnly } from "./Methods/ValidateForms";
import { axiosPost } from "./commons/Save";
import Toast from "react-native-toast-message";

const ForgotPassword = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await axiosPost("forgotpassword", {
        email: userData.username,
      });
      setLoading(false);
      if (result.data[0].response.status === "success")
        Toast.show({
          type: "success",
          position: "top",
          topOffset: "70",
          text1: result.data[0].response.message,
        });
      else
        Toast.show({
          type: "error",
          position: "top",
          topOffset: "70",
          text1: result.data[0].response.message,
        });
    } catch (error) {
      setLoading(false);

      Toast.show({
        type: "error",
        position: "top",
        topOffset: "70",
        text1: "There was some error",
      });
    }

  };
  const [userData, setUserData] = useState({
    username: "",
  });
  const [errors, setErrors] = useState({
    username: "",
  });
  return (
    <>
      <StatusBar
        animated={true}
        translucent
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <SafeAreaView style={styles.AndroidSafeArea}>
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        <Layout style={styles.container}>
          <ScrollView nestedScrollEnabled={true}>
            <View style={styles.logoAndTextcontainer}>
              {/* <ImageBackground
              source={orange}
              style={{
                width: 80,
                height: 80,
                resizeMode: "contain",
                marginRight: 15,
              }}
            ></ImageBackground> */}
              <View style={styles.formAndBtnContainer}>
                <Card style={styles.loginCard}>
                  <View style={styles.logoContainer}>
                    <Image source={VTCLogo} style={styles.logoImage} />
                  </View>
                </Card>
              </View>
              <View style={styles.welBckContainer}>
                <View style={styles.welBck}>
                  <Text style={styles.heading} variant="headlineLarge">
                    Forgot
                  </Text>
                  <Text style={styles.heading} variant="headlineLarge">
                    Password?
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.formCtrlWrap}>
                <TextInput
                  mode="outlined"
                  error={errors.username != ""}
                  outlineStyle={styles.formControlOutdoor}
                  style={styles.formControl}
                  label="Username"
                  value={userData.username}
                  name="username"
                  right={<TextInput.Icon icon="account" />}
                  onChangeText={(value) => {
                    setUserData({ ...userData, username: value });
                    emailOnly(value, setErrors, errors, "username");
                  }}
                />
                <HelperText type="error" visible={errors.username != ""}>
                  {errors.username}
                </HelperText>
              </View>
              <View style={styles.loginBtnContainer}>
                <Button
                  icon="keyboard-backspace"
                  mode="contained"
                  buttonColor="orange"
                  style={styles.loginBtn1}
                  onPress={(e) => navigation.navigate("SignIn")}
                >
                  Back to Login
                </Button>
                <Button
                  icon="send"
                  mode="contained"
                  buttonColor="orange"
                  style={styles.loginBtn1}
                  disabled={errors.username != "" || loading}
                  onPress={(e) => onSubmit(userData)}
                >
                  Send Link
                </Button>
              </View>
            </View>
          </ScrollView>
        </Layout>
      </SafeAreaView>
    </>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  loginBtn1: { borderRadius: 4 },
  formAndBtnContainer: {},
  loginContainer: { alignItems: "flex-end" },
  formSection: { justifyContent: "space-around" },
  registerBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50,
    // alignSelf: "flex-end",
  },
  loginBtnContainer: {
    marginHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  heading: { fontWeight: "bold", fontFamily: "monospace", color: "orange" },
  logoAndTextcontainer: { backgroundColor: "black" },
  welBckContainer: {
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    backgroundColor: "white",
  },
  welBck: {
    margin: 20,
    marginTop: 20,
    marginBottom: 50,
  },
  logoContainer: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    marginHorizontal: "auto",
  },
  spinnerTextStyle: {
    color: "#ffffff",
  },
  mainHeading: {
    backgroundColor: "black",
    width: "100%",
    justifyContent: "center",
    // alignItems: "center",
    paddingLeft: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  image: {
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loginCard: {
    backgroundColor: "#rgba(0, 0, 0, 1)",
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
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 2,
    paddingVertical: 20,
    paddingBottom: 0,
    flex: 1,
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 100,
  },
  secHeading: {
    // marginLeft: 15,
    color: "#fff",
    marginVertical: 20,
  },
  formControl: {
    margin: 10,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    // backgroundColor: "transparent",
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  textStyle: { color: "#fff" },
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
    width: Dimensions.get("window").width - 65,
  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginVertical: 5,
    marginHorizontal: "auto",
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
});
