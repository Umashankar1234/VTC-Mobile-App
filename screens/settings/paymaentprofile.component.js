/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Divider,
  Layout,
  Text,
  Tab,
  Input,
  Spinner,
  TabBar,
  ViewPager,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { getLocation, getUser } from "../context/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { postMethod } from "../commons/Services";
import { useAuthorization } from "../context/AuthProvider";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useForm, Controller } from "react-hook-form";
import {
  faCreditCard,
  faEnvelopeOpen,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { CardIcon, SettingsIcon, UserIcon } from "../commons/Icons";
import { Button } from "react-native-paper";
import { axiosPost } from "../commons/Save";
import Toast from "react-native-toast-message";
DropDownPicker.setListMode("MODAL");

const MailIcon = (props) => (
  <FontAwesomeIcon icon={faEnvelopeOpen} size={25} color={"#FFA12D"} />
);

const PhoneIcon = (props) => (
  <FontAwesomeIcon icon={faPhone} size={25} color={"#FFA12D"} />
);
const SaveIcon = (props) => (
  <FontAwesomeIcon icon={faSave} size={25} color={"#FFA12D"} />
);

const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);
export const PaymentProfileScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [selectedIndex1, setSelectedIndex1] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedState, setSelectedState] = React.useState(null);
  const [stateOpen, setStateOpen] = React.useState(false);
  const [expMonthOpen, setExpMonthOpen] = React.useState(false);
  const [expYearOpen, setExpYearOpen] = React.useState(false);
  const [expMonth, setExpMonth] = React.useState();
  const [expYear, setExpYear] = React.useState();
  const [months, setMonths] = React.useState([
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]);
  const [years, setYears] = React.useState([
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
    { label: "2028", value: "2028" },
    { label: "2029", value: "2029" },
    { label: "2030", value: "2030" },
    { label: "2031", value: "2031" },
    { label: "2032", value: "2032" },
  ]);

  const { status, authToken } = useMemo(() => useAuthorization(), []);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const initialPaymentdata = {
    address: "",
    cc_month: null,
    cc_n: null,
    cc_no: null,
    cc_year: null,
    city: "",
    code: null,
    countryid: "",
    cvv: null,
    email: "",
    fname: "",
    lname: "",
    officephone: "",
    stateid: "",
    zipcode: "",
  };
  const [userData, setUserData] = React.useState({});
  const [countries, setCountries] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const [countryOpen, setCountryOpen] = React.useState(false);
  const [states, setStates] = React.useState([]);
  const [paymentInfo, setPaymentInfo] = React.useState(initialPaymentdata);
  const [saveResult, setSaveResult] = React.useState({
    message: "",
    color: "basic",
  });
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
  React.useEffect(() => {
    let componentMounted = true;
    let obj = { agent_id: userData.agent_id };
    postMethod("get-countries", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          let cdata = [];
          res[0].response.data.forEach((x) => {
            cdata.push({ label: x.name, value: x.id });
          });
          setCountries(cdata);
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  React.useEffect(() => {
    // const displayValue = countries[selectedIndex.row];
  }, [selectedCountry]);
  React.useEffect(() => {
    let componentMounted = true;
    let obj = { agent_id: userData.agent_id };
    postMethod("agent-get-payment-profile-details", obj).then((res) => {
      if (res.length > 0 && componentMounted) {
        if (res[0].response.status === "success") {
          setPaymentInfo(res[0].response.data);
          setSelectedCountry(res[0].response.data.countryid);
          setSelectedState(res[0].response.data.stateid);
          setExpYear(res[0].response.data.cc_year);
          setExpMonth(res[0].response.data.cc_month);

          let agObj = res[0].response.data;
          for (const [key, value] of Object.entries(agObj)) {
            let val = "";
            if (!`${value}` || `${value}` !== "null") {
              val = `${value}`;
            }

            if (`${key}` !== "countryid") {
              setValue(`${key}`, val);
            }
          }
        }
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [userData]);
  const savePaymentProfileInformation = async (data) => {
    data.agent_id = userData.agent_id;
    data.countryid = selectedCountry;
    data.stateid = selectedState;
    data.cc_year = expYear;
    data.cc_month = expMonth;
    setLoading(true);
    const res = await axiosPost("agent-update-payment-profile", data);
    setLoading(false);
    if (res.data[0].response.status === "error") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.data[0].response.message,
        position: "top",
        topOffset: "70",
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.data[0].response.message,
        position: "top",
        topOffset: "70",
      });
    }

  };
  const onCountryOpen = React.useCallback(() => {
    setStateOpen(false);
  }, []);
  const onStateOpen = React.useCallback(() => {
    setCountryOpen(false);
  }, []);
  const onExpMonthOpen = React.useCallback(() => {
    setExpMonthOpen(false);
  }, []);
  React.useEffect(() => {
    // const displayValue = countries[selectedIndex.row];
    let componentMounted = true;
    let obj = { agent_id: userData.agent_id, country_id: selectedCountry };
    selectedCountry &&
      postMethod("get-states", obj).then((res) => {
        if (res.length > 0 && componentMounted) {
          if (res[0].response.status === "success") {
            let cdata = [];
            res[0].response.data.forEach((x) => {
              cdata.push({ label: x.name, value: x.id });
            });
            setStates(cdata);
          }
        }
      });
    return () => {
      componentMounted = false;
    };
  }, [selectedCountry, userData]);
  return (
    <SafeAreaView>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />

      <Layout style={styles.container}>
        <View style={styles.headingWrap}>
          <View style={styles.headingWrap}>
            <FontAwesomeIcon icon={faCreditCard} size={20} color={"#adadad"} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Payment Profile
            </Text>
          </View>
          <Button
            style={styles.saveButton}
            mode="contained"
            buttonColor="orange"
            loading={loading}
            disabled={loading}
            icon="content-save"
            onPress={handleSubmit(savePaymentProfileInformation)}
          >
            Update
          </Button>
        </View>

        <TabBar
          style={{
            paddingVertical: 15,
            backgroundColor: "#fff",
            elevation: 2,
          }}
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <Tab title="USER DETAILS" icon={UserIcon} />
          <Tab title="CREDIT CARD INFORMATION" icon={CardIcon} />
        </TabBar>
        <ViewPager
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <View >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 300, zIndex: 1 }}
            >
              <View style={{ alignItems: "center" }}>
                <View style={styles.formWrapCard}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="First Name"
                        label="First Name"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="fname"
                    rules={{
                      required: { value: true, message: "Name is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.fname && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.fname?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Last Name"
                        label="Last Name"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="lname"
                    rules={{
                      required: { value: true, message: "Name is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.lname && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.lname?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Email"
                        label="Email"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="email"
                    rules={{
                      required: { value: true, message: "Email is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.email && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.email?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Mobile"
                        label="Mobile"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                        keyboardType="number-pad"
                      />
                    )}
                    name="officephone"
                    rules={{
                      required: { value: true, message: "Mobile is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.mobile && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.mobile?.message}
                    </Text>
                  )}
                  <View style={{ zIndex: 2001 }}>
                    <Text style={styles.caption}>Country</Text>

                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DropDownPicker
                          dropDownContainerStyle={{
                            backgroundColor: "white",
                            zIndex: 1000,
                            elevation: 1000,
                          }}
                          placeholder="Select a Country"
                          open={countryOpen}
                          onOpen={onCountryOpen}
                          style={styles.formControlDrop}
                          value={selectedCountry}
                          items={countries.length > 0 ? countries : []}
                          setOpen={setCountryOpen}
                          setValue={setSelectedCountry}
                          setItems={setCountries}
                        />
                      )}
                      name="countryid"
                      rules={{
                        required: {
                          value: false,
                          message: "Country is required",
                        },
                      }}
                      defaultValue=""
                    />
                  </View>
                  {errors.countryid && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.countryid?.message}
                    </Text>
                  )}
                  <View style={{ zIndex: 2000 }}>
                    <Text style={styles.caption}>State</Text>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DropDownPicker
                          dropDownContainerStyle={{
                            backgroundColor: "white",
                            zIndex: 1000,
                            elevation: 1000,
                          }}
                          placeholder="Select a State"
                          onOpen={onStateOpen}
                          open={stateOpen}
                          style={styles.formControlDrop}
                          value={selectedState}
                          items={states.length > 0 ? states : []}
                          setOpen={setStateOpen}
                          setValue={setSelectedState}
                          setItems={setStates}
                        />
                      )}
                      name="stateid"
                      rules={{
                        required: {
                          value: false,
                          message: "State is required",
                        },
                      }}
                      defaultValue=""
                    />
                  </View>
                  {errors.stateid && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.stateid?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="City"
                        label="City"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="city"
                    rules={{
                      required: { value: true, message: "City is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.city && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.city?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Zip"
                        label="Zip"
                        style={styles.formControl}
                        textStyle={styles.textInputStyle}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        size="large"
                      />
                    )}
                    name="zipcode"
                    rules={{
                      required: { value: true, message: "Zipcode is required" },
                    }}
                    defaultValue=""
                  />
                  {errors.zipcode && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.zipcode?.message}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Address"
                        label="Address"
                        style={styles.formControl}
                        textStyle={{ minHeight: 100 }}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        multiline={true}
                      />
                    )}
                    name="address"
                    rules={{
                      required: {
                        value: false,
                        message: "Address is required",
                      },
                    }}
                    defaultValue=""
                  />
                  {errors.address && (
                    <Text style={styles.errorMsg} status="danger">
                      {errors?.address?.message}
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={styles.formWrapCard}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Card Number"
                    label="Card Number"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="cc_no"
                rules={{
                  required: { value: true, message: "Name is required" },
                }}
                defaultValue=""
              />
              {errors.cc_no && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.cc_no?.message}
                </Text>
              )}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="CVV"
                    label="CVV"
                    style={styles.formControl}
                    textStyle={styles.textInputStyle}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="large"
                  />
                )}
                name="cvv"
                rules={{
                  required: { value: true, message: "CVV is required" },
                }}
                defaultValue=""
              />
              {errors.cvv && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.cvv?.message}
                </Text>
              )}
              <View style={{ zIndex: 2001 }}>
                <Text style={styles.caption}>Expiry Month</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DropDownPicker
                      dropDownContainerStyle={{
                        backgroundColor: "white",
                        zIndex: 1000,
                        elevation: 1000,
                      }}
                      placeholder="Select Expiry Month"
                      open={expMonthOpen}
                      style={styles.formControlDrop}
                      value={expMonth}
                      items={months.length > 0 ? months : []}
                      setOpen={setExpMonthOpen}
                      setValue={setExpMonth}
                      setItems={setMonths}
                    />
                  )}
                  name="cc_month"
                  rules={{
                    required: { value: false, message: "State is required" },
                  }}
                  defaultValue=""
                />
              </View>
              {errors.cc_month && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.cc_month?.message}
                </Text>
              )}
              <View style={{ zIndex: 2000 }}>
                <Text style={styles.caption}>Expiry Year</Text>

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DropDownPicker
                      dropDownContainerStyle={{
                        backgroundColor: "white",
                        zIndex: 1000,
                        elevation: 1000,
                      }}
                      placeholder="Select Expiry Year"
                      open={expYearOpen}
                      style={styles.formControlDrop}
                      value={expYear}
                      items={years.length > 0 ? years : []}
                      setOpen={setExpYearOpen}
                      setValue={setExpYear}
                      setItems={setYears}
                    />
                  )}
                  name="cc_year"
                  rules={{
                    required: { value: false, message: "State is required" },
                  }}
                  defaultValue=""
                />
              </View>
              {errors.cc_year && (
                <Text style={styles.errorMsg} status="danger">
                  {errors?.cc_year?.message}
                </Text>
              )}
            </View>
          </View>
        </ViewPager>
      </Layout>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
  },
  pageHeading: {
    color: "#adadad",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    margin: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  sectionHead: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  uploadImages: {
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  formWrapCard: {
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    padding: 20,
    width: "95%",
  },
  formControl: {
    margin: 5,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  saveButton: {
    margin: 10,
    alignSelf: "center",
  },
  activeLabels: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
  formControlDrop: {
    // marginTop: 10,
    marginBottom: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5e5",
    marginLeft: 10,
    width: "95%",
    zIndex: 0,
  },
  caption: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "bold",
    color: "#9294a5",
  },
});
