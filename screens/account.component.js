/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from "react";
import {

  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import {
  Icon,
  Layout,
  Text,
  Toggle,
  Input,
} from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import { getLocation, getUser } from "./context/async-storage";
import { useAuthorization } from "./context/AuthProvider";
import { APIURL, axiosPost } from "./commons/Save";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "react-native-paper";


export const AccountScreen = ({ navigation }) => {
  const [accountInfo, setAccountInfo] = useState({});
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [initalFetch, setInitalFetch] = React.useState(true);

  const { status, authToken } = useMemo(() => useAuthorization(), []);

  const fetchUser = React.useCallback(async () => {
    if (status === "signOut") {
    } else {
      var myInfo = await getUser();
      setUserData(myInfo);
    }
  }, [status]);
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const [checked, setChecked] = React.useState(false);
  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };
  useEffect(() => {
    if (Object.entries(userData).length > 0) {
      var status = 0;
      if (checked) var status = 1;

      let obj = { agent_id: userData.agent_id, status: status };
      axiosPost("change-agent-status", obj)
        .then((res) => {
          if (!initalFetch)
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Succesfully changed agent status",
              position: "top",
              topOffset: "70",
            });
          setInitalFetch(false);
        })
        .catch((err) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "There was some error",
            position: "top",
            topOffset: "70",
          });
        });
    }
  }, [checked]);
  useEffect(() => {
    if (Object.entries(userData).length > 0) {
      setLoading(true);
      let obj = { agent_id: userData.agent_id, status: status };
      axiosPost("user-details", obj).then((res) => {
        if (res.data[0].response) {
          setAccountInfo(res.data[0].response);
          if (res.data[0].response.data.agent_profile.status == 1)
            setChecked(true);
          setLoading(false);
        }
      });
    }
  }, [userData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const initialCompanydata = {
    refcode: "",
  };
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });
  const onSubmit = async (data) => {
    let obj = { agent_id: userData.agent_id, code: data.refcode };
    setBtnLoading(true);
    const result = await axiosPost("get-broker", obj);
    setBtnLoading(false);
    if (result.data[0].response.status == "error") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: result.data[0].response.message,
        position: "top",
        topOffset: "70",
      });
    } else if (result.data[0].response.status == "success") {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result.data[0].response.message,
        position: "top",
        topOffset: "70",
      });
    }
  };
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <Layout style={styles.container}>
        {/* <ScrollView contentContainerStyle={{paddingBottom: 50}}> */}
        <View style={styles.headingWrap}>
          <Text category="h6" status="warning" style={styles.pageHeading}>
            Account Status
          </Text>
        </View>
        {!loading ? (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionInfo}>
              <Text category="h6" style={styles.sectionHead}>
                Active
              </Text>
              <View style={[styles.textWrap, { flexDirection: "row" }]}>
                <Toggle
                  style={styles.toggle}
                  status="info"
                  onChange={onCheckedChange}
                  checked={checked}
                />
              </View>
            </View>
            <View style={styles.sectionInfo}>
              <View style={styles.textWrap}>
                <Text category="h6" style={styles.sectionHead}>
                  Link to Broker
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Referral Code"
                      label="Broker Referral Code"
                      style={styles.formControl}
                      textStyle={styles.textInputStyle}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      size="large"
                    />
                  )}
                  name="refcode"
                  rules={{
                    required: {
                      value: true,
                      message: "Referral Code is required",
                    },
                  }}
                  defaultValue=""
                />
                {errors.refcode && (
                  <Text style={styles.errorMsg} status="danger">
                    {errors?.refcode?.message}
                  </Text>
                )}
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  style={styles.modalPressableSave}
                  icon="link"
                  buttonColor="orange"
                  loading={btnLoading}
                  disabled={btnLoading}
                >
                  Link
                </Button>
                <Pressable
                  style={styles.modalPressableSave}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Icon
                    name="link"
                    style={styles.modalIconSave}
                    fill="#FFFFFF"
                  />
                  <Text style={styles.modalTextSave}>Liink</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#FFA12D" />
        )}

        {/* </ScrollView> */}
      </Layout>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  pageHeading: {
    color: "#FFA12D",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "center",
  },
  sectionText: { color: "gray", marginVertical: 2 },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    marginVertical: 6,
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  toggle: {
    marginTop: 10,
  },
  iconWrap: {
    backgroundColor: "#FFA12D",
    padding: 20,
    borderRadius: 10,
  },
  formControl: {
    margin: 5,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  textWrap: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // marginLeft: 20,
    flex: 1,
    flexWrap: "wrap",
  },
  sectionHead: {
    color: "gray",
    fontSize: 20,
    fontWeight: "700",
  },
  iconStyle: {
    fontSize: 30,
    color: "#FFA12D",
  },
  floatingButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 70,
    borderRadius: 5,
  },
  counterCards: {
    flexDirection: "row",
    width: "100%",
  },
  countCard: {
    width: Dimensions.get("window").width / 2 - 20,
    margin: 10,
    justifyContent: "center",
  },
  countText: {
    textAlign: "center",
  },
  recentList: {
    flexDirection: "column",
    width: "100%",
    height: 500,
    padding: 10,
  },
  listCard: {
    width: Dimensions.get("window").width - 20,
    marginBottom: 5,
  },
  modalTextSave: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalText: {
    marginTop: 10,
    textAlign: "center",
    color: "#555555",
    fontSize: 16,
  },
  modalPressableSave: {
    // width: "50%",
    // flexDirection: "row",
    margin: 10,
    // padding: 10,
    // backgroundColor: "#FFA12D",
    // justifyContent: "center",
    // alignItems: "center",
    // borderRadius: 20,
    // shadowColor: "rgba(0,0,0,0.8)",
    // elevation: 10,
    // alignSelf: "flex-end",
  },
  modalIconSave: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
});
