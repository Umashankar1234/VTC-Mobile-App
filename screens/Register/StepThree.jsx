import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";
import { Icon } from "@ui-kitten/components";
import { Button } from "react-native-paper";

const StepThree = ({ navigation }) => {
  const Result = () => {
    return (
      <View style={styles.container}>
        <View style={styles.congrats}>
          <Icon name="checkmark-circle-outline" fill="#FFA12D" />
        </View>
        <Text style={styles.heading}>Congratulations</Text>
        <View>
          <Text>You Free trial has done Successfully</Text>
          <Text>Please check your mail for Login Credentials</Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={styles.stepContainer}>
        <View style={styles.tyPage}>
          <Result />
        </View>
      </View>
      <View style={styles.loginBtnContainer}>
        <View style={styles.loginContainer}>
          <Button
            icon="account"
            mode="contained"
            buttonColor="orange"
            style={styles.loginBtn}
            // size="large"
            labelStyle={{ fontWeight: 700, fontSize: 16 }}
            onPress={() => navigation.navigate("SignIn")}
            // accessoryRight={RegisterIcon}
          >
            Go to Login
          </Button>
        </View>
      </View>
    </>
  );
};

export default StepThree;

const styles = StyleSheet.create({
  container: {},
  stepContainer: {
    backgroundColor: "#ffffffff",
    elevation: 10,
    shadowColor: "#52006A",
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  tyPage: {
    alignItems: "center",
    justifyContent: "center",
  },
  congrats: {
    height: 150,
  },
  icon: {},
  heading: {
    color: "black",
    fontSize: 25,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 20,
    // height: 120,
  },
  loginBtnContainer:{
    flex:1,
    alignItems:"center",
    marginTop:50,
  }
});
