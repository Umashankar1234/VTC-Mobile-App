import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { axiosPost } from "../commons/Save";
import { getAddedPackages } from "../context/PackagesContext";
import { Button, HelperText, TextInput } from "react-native-paper";
import { Image } from "react-native";
import { getItem } from "../context/async-storage";
import { getOrderInfo } from "../context/OrderInfoContext";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import { BlankValidation } from "../Methods/ValidateForms";
import { BackHandler } from "react-native";

const StepThree = ({
  styles,
  setActiveStep,
  setLoading,
  loading,
  isFocused,
  step,
  setStep,
}) => {
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [allMiscPackage, setAllMiscPackage] = useState([]);
  const [openDateOne, setOpenDateOne] = useState(false);
  const [openDateTwo, setOpenDateTwo] = useState(false);
  const [openDateThree, setOpenDateThree] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const packageCtx = getAddedPackages();
  const {
    stepOne,
    stepTwo,
    updateStepTwo,
    errorTwo,
    updateErrorTwo,
    setErrorTwo,
  } = getOrderInfo();
  const handleBackButton = () => {
    setActiveStep(1);

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
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = {
          category_list: packageCtx.cartePackage.filter(
            (item, i, ar) => ar.indexOf(item) === i
          ),
          authenticate_key: "abcd123XYZ",
        };
        const result = await axiosPost("get-order-package", "", "", data, "");
        setSelectedPackages(result.data[0].response.data.package);
      } catch (error) {
      }
    };
    if (step == 2 && packageCtx.cartePackage.length > 0) fetch();
  }, [step]);
  useEffect(() => {
    try {
      const fetch = async () => {
        const result = await axiosPost("get-miscellaneous");
        setAllMiscPackage(
          result.data[0].response.data.miscellaneous.miscellaneous_details
        );
      };
      fetch();
    } catch (error) {
    }
  }, [isFocused]);
  useEffect(() => {
    const fetch = async () => {
      const agent_id = await getItem();
      const data = {
        agent_id: agent_id,
      };
      const result = await axiosPost("user-details", data);
      setUserDetails(result.data[0].response.data.agent_profile);
    };
    fetch();
  }, [isFocused]);
  const removeItem = async (id, price) => {
    packageCtx.removeMiscPackage(id, price);
  };
  const addToCart = async (id, price) => {
    packageCtx.addMiscPackage(id, price);
  };
  const onChange = (name, value) => {
    updateStepTwo(name, value);
    if (value.length == 0) updateErrorTwo(name, "Required");
    else updateErrorTwo(name, "");
  };
  // const StepOne = () => {
  //   return (

  //   );
  // };
  const openModal = (id) => {
  };
  const StepZero = () => {
    return (
      <View>
        <View style={styles.packageContainer}>
          <View style={styles.packageHeadingContainer}>
            <Text style={styles.packageHeading}>
              Miscellaneous/Add-On Options
            </Text>
          </View>
          <View style={styles.subPackagesContainer}>
            <FlatList
              data={allMiscPackage}
              renderItem={({ item }) => {
                return (
                  <View style={styles.subPackageContainer}>
                    <Pressable onPress={() => openModal(item.id)}>
                      <View style={styles.subPackageImageContainer}>
                        <Image
                          source={{ uri: item?.image }}
                          style={styles.subPackageImage}
                        />
                      </View>
                      <View>
                        <Text style={styles.subPackageTitle}>
                          {item?.title}
                        </Text>
                      </View>
                      <View>
                        <Text>${item?.price}</Text>
                      </View>
                    </Pressable>
                    <View style={styles.subPackageBtnContainer}>
                      {packageCtx.miscPackage.includes(item.id) ? (
                        <Button
                          onPress={() => removeItem(item.id, item.price)}
                          icon="cart"
                          mode="contained"
                        >
                          Remove Item
                        </Button>
                      ) : (
                        <Button
                          onPress={() => addToCart(item.id, item.price)}
                          icon="cart"
                          mode="contained"
                        >
                          Add To Cart
                        </Button>
                      )}
                    </View>
                  </View>
                );
              }}
              numRows={2}
              numColumns={2}
            />
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
            onPress={(e) => setActiveStep(1)}
          >
            Go Back
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
            onPress={(e) => setStep(1)}
          >
            Next
          </Button>
        </View>
      </View>
    );
  };
  const validateFirstStep = async () => {
    setLoading(true);
    const result = await BlankValidation(
      stepTwo,
      proceedToStepTwo,
      errorTwo,
      setErrorTwo
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
  const proceedToStepTwo = () => {
    setStep(2);
  };
  return (
    <View style={styles.stepContainer}>
      {step == 0 && <StepZero />}
      {step == 1 && (
        <View>
          <View>
            <View style={styles.packageContainer}>
              <View style={styles.packageHeadingContainer}>
                <Text style={styles.packageHeading}>Agent Information</Text>
              </View>
            </View>
            <View style={styles.labelsContainer}>
              <View style={styles.labelHolder}>
                <Text style={styles.labelHeading}>Name : </Text>
                <Text>{userDetails.name}</Text>
              </View>
              <View style={styles.labelHolder}>
                <Text style={styles.labelHeading}>Email : </Text>
                <Text>{userDetails.email}</Text>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.packageContainer}>
              <View style={styles.packageHeadingContainer}>
                <Text style={styles.packageHeading}>Property Information </Text>
              </View>
            </View>
            <View>
              <View style={styles.smallInputContainer}>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.caption != ""}
                    style={styles.formControl}
                    label="Caption"
                    value={stepTwo.caption}
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("caption", value);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.caption != ""}>
                    {errorTwo.caption}
                  </HelperText>
                </View>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.bed_room != ""}
                    style={styles.formControl}
                    label="Bedrooms"
                    keyboardType="numeric"
                    value={stepTwo.bed_room}
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("bed_room", value);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.bed_room != ""}>
                    {errorTwo.bed_room}
                  </HelperText>
                </View>
              </View>
              <View style={styles.smallInputContainer}>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.bath_room != ""}
                    style={styles.formControl}
                    value={stepTwo.bath_room}
                    label="BathRoom"
                    keyboardType="numeric"
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("bath_room", value);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.bath_room != ""}>
                    {errorTwo.bath_room}
                  </HelperText>
                </View>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.year_built != ""}
                    style={styles.formControl}
                    label="Year Build"
                    keyboardType="numeric"
                    value={stepTwo.year_built}
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("year_built", value);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.year_built != ""}>
                    {errorTwo.year_built}
                  </HelperText>
                </View>
              </View>
              <View style={styles.smallInputContainer}>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.square_footage != ""}
                    style={styles.formControl}
                    value={stepTwo.square_footage}
                    label="Square Footage"
                    keyboardType="numeric"
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("square_footage", value);
                    }}
                  />
                  <HelperText
                    type="error"
                    visible={errorTwo.square_footage != ""}
                  >
                    {errorTwo.square_footage}
                  </HelperText>
                </View>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.mls != ""}
                    style={styles.formControl}
                    label="MLS#"
                    value={stepTwo.mls}
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("mls", value);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.mls != ""}>
                    {errorTwo.mls}
                  </HelperText>
                </View>
              </View>
              <View style={styles.smallInputContainer}>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.price != ""}
                    style={styles.formControl}
                    value={stepTwo.price}
                    label="Price"
                    keyboardType="numeric"
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("price", value);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.price != ""}>
                    {errorTwo.price}
                  </HelperText>
                </View>
                <View style={styles.formCtrlWrap}>
                  <TextInput
                    mode="outlined"
                    error={errorTwo.description != ""}
                    style={styles.formControl}
                    label="Descripton"
                    value={stepTwo.description}
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(value) => {
                      onChange("description", value);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.description != ""}>
                    {errorTwo.description}
                  </HelperText>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.packageContainer}>
              <View style={styles.packageHeadingContainer}>
                <Text style={styles.packageHeading}>Appointment</Text>
              </View>
              <View style={styles.packageHeadingContainer}>
                <Text style={styles.packageDesc}>
                  Twilight Shoots” will be scheduled same day as photo shoot 15
                  minutes prior to sunset unless otherwise notified. Weekends
                  are by special request only with limited availability
                </Text>
              </View>
            </View>
            <View>
              <View style={styles.smallInputContainer}>
                <View style={styles.formCtrlWrap}>
                  <Text
                    category="p2"
                    style={{ color: "#adadad", textAlign: "center" }}
                  >
                    Select Date One
                  </Text>
                  <Button
                    onPress={() => setOpenDateOne(true)}
                    status="basic"
                    appearance="outline"
                  >
                    {stepTwo.dateOne.toDateString()}
                  </Button>
                  <DatePicker
                    mode="date"
                    date={stepTwo.dateOne}
                    open={openDateOne}
                    modal
                    theme="light"
                    textColor="#000000"
                    onConfirm={(date) => {
                      setOpenDateOne(false);
                      onChange("dateOne", date);
                    }}
                    onCancel={() => {
                      setOpenDateOne(false);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.dateOne != ""}>
                    {errorTwo.dateOne}
                  </HelperText>
                </View>
                <View style={styles.formCtrlWrap}>
                  <View style={[styles.selectTag]}>
                    <Picker
                      selectedValue={stepTwo.timeOne}
                      label="TimeOne"
                      color="primary"
                      onValueChange={(value, itemIndex) => {
                        onChange("timeOne", value);
                      }}
                    >
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="Time"
                        value=""
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="10 am"
                        value="10:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="11 am"
                        value="11:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="12 noon"
                        value="12:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="1 pm"
                        value="13:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="2 pm"
                        value="14:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="3 pm"
                        value="15:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="Other"
                        value="other"
                      />
                    </Picker>
                  </View>
                  <HelperText type="error" visible={errorTwo.timeOne != ""}>
                    {errorTwo.timeOne}
                  </HelperText>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.smallInputContainer}>
                <View style={styles.formCtrlWrap}>
                  <Text
                    category="p2"
                    style={{ color: "#adadad", textAlign: "center" }}
                  >
                    Select Date Two
                  </Text>
                  <Button
                    onPress={() => setOpenDateTwo(true)}
                    status="basic"
                    appearance="outline"
                  >
                    {stepTwo.dateTwo.toDateString()}
                  </Button>
                  <DatePicker
                    mode="date"
                    date={stepTwo.dateTwo}
                    open={openDateTwo}
                    modal
                    theme="light"
                    textColor="#000000"
                    onConfirm={(date) => {
                      setOpenDateTwo(false);
                      onChange("dateTwo", date);
                    }}
                    onCancel={() => {
                      setOpenDateTwo(false);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.dateTwo != ""}>
                    {errorTwo.dateTwo}
                  </HelperText>
                </View>
                <View style={styles.formCtrlWrap}>
                  <View style={[styles.selectTag]}>
                    <Picker
                      selectedValue={stepTwo.timeTwo}
                      label="timeTwo"
                      color="primary"
                      onValueChange={(value, itemIndex) => {
                        onChange("timeTwo", value);
                      }}
                    >
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="Time"
                        value=""
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="10 am"
                        value="10:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="11 am"
                        value="11:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="12 noon"
                        value="12:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="1 pm"
                        value="13:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="2 pm"
                        value="14:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="3 pm"
                        value="15:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="Other"
                        value="other"
                      />
                    </Picker>
                  </View>
                  <HelperText type="error" visible={errorTwo.timeTwo != ""}>
                    {errorTwo.timeTwo}
                  </HelperText>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.smallInputContainer}>
                <View style={styles.formCtrlWrap}>
                  <Text
                    category="p2"
                    style={{
                      color: "#adadad",
                      textAlign: "center",
                    }}
                  >
                    Select Date Three
                  </Text>
                  <Button
                    onPress={() => setOpenDateThree(true)}
                    status="basic"
                    appearance="outline"
                  >
                    {stepTwo.dateThree.toDateString()}
                  </Button>
                  <DatePicker
                    mode="date"
                    date={stepTwo.dateThree}
                    open={openDateThree}
                    modal
                    theme="light"
                    textColor="#000000"
                    onConfirm={(date) => {
                      setOpenDateThree(false);
                      onChange("dateThree", date);
                    }}
                    onCancel={() => {
                      setOpenDateThree(false);
                    }}
                  />
                  <HelperText type="error" visible={errorTwo.dateThree != ""}>
                    {errorTwo.dateThree}
                  </HelperText>
                </View>
                <View style={styles.formCtrlWrap}>
                  <View style={[styles.selectTag]}>
                    <Picker
                      selectedValue={stepTwo.timeThree}
                      label="TimeThree"
                      color="primary"
                      onValueChange={(value, itemIndex) => {
                        onChange("timeThree", value);
                      }}
                    >
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="Time"
                        value=""
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="10 am"
                        value="10:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="11 am"
                        value="11:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="12 noon"
                        value="12:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="1 pm"
                        value="13:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="2 pm"
                        value="14:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="3 pm"
                        value="15:00"
                      />
                      <Picker.Item
                        style={styles.pickerItemStyle}
                        label="Other"
                        value="other"
                      />
                    </Picker>
                  </View>
                  <HelperText type="error" visible={errorTwo.timeThree != ""}>
                    {errorTwo.timeThree}
                  </HelperText>
                </View>
              </View>
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
              onPress={(e) => setStep(0)}
            >
              Go Back
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
              onPress={validateFirstStep}
            >
              Next
            </Button>
          </View>
        </View>
      )}
      {step == 2 && (
        <View>
          <View>
            {selectedPackages.map((selectedPackage) => (
              <View>
                <Text style={styles.packageHeading}>
                  {selectedPackage.title}
                </Text>
                <FlatList
                  data={selectedPackage.package_details}
                  renderItem={({ item }) => {
                    return (
                      <>
                        {packageCtx.subPackage.includes(item.id) && (
                          <View style={styles.subPackageContainer}>
                            <Pressable onPress={() => openModal(item.id)}>
                              <View style={styles.subPackageImageContainer}>
                                <Image
                                  source={{ uri: item?.image }}
                                  style={styles.subPackageImage}
                                />
                              </View>
                              <View>
                                <Text style={styles.subPackageTitle}>
                                  {item?.title}
                                </Text>
                              </View>
                              <View>
                                <Text>${item?.price}</Text>
                              </View>
                            </Pressable>
                          </View>
                        )}
                      </>
                    );
                  }}
                  numRows={2}
                  numColumns={2}
                />
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.packageHeading}>Miscellaneous packages</Text>
            <FlatList
              data={allMiscPackage}
              renderItem={({ item }) => {
                return (
                  <>
                    {packageCtx.miscPackage.includes(item.id) && (
                      <View style={styles.subPackageContainer}>
                        <Pressable onPress={() => openModal(item.id)}>
                          <View style={styles.subPackageImageContainer}>
                            <Image
                              source={{ uri: item?.image }}
                              style={styles.subPackageImage}
                            />
                          </View>
                          <View>
                            <Text style={styles.subPackageTitle}>
                              {item?.title}
                            </Text>
                          </View>
                          <View>
                            <Text>${item?.price}</Text>
                          </View>
                        </Pressable>
                      </View>
                    )}
                  </>
                );
              }}
              numRows={2}
              numColumns={2}
            />
          </View>
          <View>
            <View>
              <View style={styles.packageContainer}>
                <View style={styles.packageHeadingContainer}>
                  <Text style={styles.packageHeading}>
                    Property Information
                  </Text>
                </View>
              </View>
              <View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>Caption : </Text>
                    <Text>{stepTwo.caption}</Text>
                  </View>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>Description : </Text>
                    <Text>{stepTwo.description}</Text>
                  </View>
                </View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>Bed Room : </Text>
                    <Text>{stepTwo.bed_room}</Text>
                  </View>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>Bath Room : </Text>
                    <Text>{stepTwo.bath_room}</Text>
                  </View>
                </View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>MLS : </Text>
                    <Text>{stepTwo.mls}</Text>
                  </View>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>Price : </Text>
                    <Text>{stepTwo.price}</Text>
                  </View>
                </View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder1}>
                    <Text style={styles.labelHeading}>
                      Property Access Information :{" "}
                    </Text>
                    <Text>{stepOne.notes}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.packageContainer}>
                <View style={styles.packageHeadingContainer}>
                  <Text style={styles.packageHeading}>
                    Appointment Information
                  </Text>
                </View>
              </View>
              <View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder1}>
                    <Text style={styles.labelHeading}>Street Address : </Text>
                    <Text>{stepOne.address}</Text>
                  </View>
                  <View style={styles.labelHolder1}>
                    <Text style={styles.labelHeading}>First Choice : </Text>
                    <Text>{`${stepTwo.dateOne.toDateString()} ${
                      stepTwo.timeOne
                    }`}</Text>
                  </View>
                </View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>City : </Text>
                    <Text>{stepOne.city}</Text>
                  </View>
                  <View style={styles.labelHolder1}>
                    <Text style={[styles.labelHeading]}>Second Choice : </Text>
                    <Text>{`${stepTwo.dateTwo.toDateString()} ${
                      stepTwo.timeTwo
                    }`}</Text>
                  </View>
                </View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>Zipcode : </Text>
                    <Text>{stepOne.zip}</Text>
                  </View>
                  <View style={styles.labelHolder1}>
                    <Text style={styles.labelHeading}>Third Choice : </Text>
                    <Text>{`${stepTwo.dateThree.toDateString()} ${
                      stepTwo.timeThree
                    }`}</Text>
                  </View>
                </View>
                <View style={styles.smallInputContainer}>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>State : </Text>
                    <Text>{stepOne.state}</Text>
                  </View>
                  <View style={styles.labelHolder}>
                    <Text style={styles.labelHeading}>Interior Sq Ft: </Text>
                    <Text>{stepOne.interior_area}</Text>
                  </View>
                </View>
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
                onPress={(e) => setStep(1)}
              >
                Go Back
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
                onPress={(e) => setActiveStep(4)}
              >
                Next
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default StepThree;

const styles = StyleSheet.create({});
