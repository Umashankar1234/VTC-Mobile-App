/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  View,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { Layout, Card } from "@ui-kitten/components";
import Toast from "react-native-toast-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAuthorization } from "./context/AuthProvider";
import { postMethod } from "./commons/Services";
import VTCLogo from "../assets/media/logo.png";
import { setUser } from "./context/async-storage";
import { eye, eyeoff } from "./commons/Icons";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Body from "./Login/Body";
import { Button, Text } from "react-native-paper";

export const SigninScreen = ({}) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const { signIn } = useMemo(() => useAuthorization(), []);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  // const { status, authToken } = useMemo(() => useAuthorization(), []);
  const initialUdata = {
    username: "",
    password: "",
    user_type: 1,
  };
  const [udata, setUdata] = React.useState(initialUdata);
  const [agreementVisible, setAgreementVisible] = React.useState(false);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [startSignIn, setStartSignIn] = React.useState(false);
  const [uid, setUid] = React.useState(0);
  React.useEffect(() => {
    // const apiKey = process.env['APIBASEURL'];
    // alert(apiKey);
    setLoading(false);
    setUid(0);
    setStartSignIn(false);
    setLoginResult({
      message: "",
      color: "basic",
    });
  }, [isFocused]);
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();
  const [loginResult, setLoginResult] = React.useState({
    message: "",
    color: "basic",
  });
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  React.useEffect(() => {
    let componentMounted = true;
    if (startSignIn) {
      var obj = { agent_id: uid };
      postMethod("agent-dashboard", obj).then((result) => {
        if (
          result.length > 0 &&
          result[0].response.status === "success" &&
          componentMounted
        ) {
          let userInfo = result[0].response.data;
          userInfo.agent_id = uid;
          signIn(uid);
          (async () => {
            await setUser(userInfo);

            navigation.navigate("MyDashboard");
          })();
          setLoading(false);
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, [startSignIn]);
  const handleLoginSubmit = (data) => {
    setAgreementVisible(false);
    postMethod("agent-login", data)
      .then((res) => {
        if (res.length > 0) {
          if (res[0].response.status === "success") {
            setLoading(false);
            Toast.show({
              topOffset: 70,
              type: "success",
              text1: "Success",
              text2: res[0].response.message,
            });
            setUid(res[0].response.data.agentId);
            setStartSignIn(true);
          } else {
            setLoading(false);
            Toast.show({
              topOffset: 70,
              type: "error",
              text1: "Error",
              text2: res[0].response.message,
            });
          }
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const onSubmit = (data) => {
    setLoading(true);
    setUdata(data);
    data.user_type = 1;
    // navigation.navigate('MyDashboard');
    handleLoginSubmit(data);
  };
  const renderIcon = (props) => (
    <Pressable onPress={() => toggleSecureEntry()}>
      {secureTextEntry ? eyeoff : eye}
    </Pressable>
  );
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
          {/* <KeyboardAvoidingView behavior="position"> */}
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
                    Welcome
                  </Text>
                  <Text style={styles.heading} variant="headlineLarge">
                    Back!
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.formSection}>
              <Body
                loading={loading}
                setLoading={setLoading}
                userData={userData}
                setUserData={setUserData}
                errors={errors}
                setErrors={setErrors}
                handleLoginSubmit={onSubmit}
                secureTextEntry={secureTextEntry}
                toggleSecureEntry={toggleSecureEntry}
              />
              <View style={styles.loginContainer}>
                <Button
                  mode="text"
                  style={styles.loginBtn}
                  // size="large"
                  labelStyle={{ fontWeight: 700, fontSize: 16 }}
                  onPress={() => navigation.navigate("ForgotPassword")}
                  // accessoryRight={RegisterIcon}
                >
                  Forgot password?
                </Button>
              </View>
              <View style={styles.registerBtnContainer}>
                <View style={styles.loginContainer}>
                  <Button
                    mode="text"
                    style={styles.loginBtn}
                    // size="large"
                    labelStyle={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: "orange",
                    }}
                    onPress={() => navigation.navigate("SignUp")}
                    // accessoryRight={RegisterIcon}
                  >
                    Click here to register
                  </Button>
                </View>
                <View style={styles.loginBtnContainer}>
                  <Button
                    icon="account-circle"
                    mode="contained"
                    buttonColor="orange"
                    style={styles.loginBtn1}
                    loading={loading}
                    disabled={
                      errors.username != "" || errors.password != "" || loading
                    }
                    onPress={(e) => onSubmit(userData)}
                  >
                    Login
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
          {/* </KeyboardAvoidingView> */}
        </Layout>
      </SafeAreaView>
    </>
  );
};
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
  loginBtnContainer: { marginHorizontal: 20, alignItems: "flex-end" },
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
    backgroundColor: "transparent",
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
