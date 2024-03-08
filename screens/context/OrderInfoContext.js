import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useCallback, useContext, useState } from "react";
import PackagesContext from "./PackagesContext";

const OrderInfo = createContext();

export const getOrderInfo = () => {
  const result = useContext(OrderInfo);
  if (result) return result;
  else return null;
};

const OrderInfoContext = ({ children }) => {
  const initialStepOne = {
    broker_zipcode: "",
    zip: "",
    interior_area: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  };
  const initialStepTwo = {
    caption: "",
    bed_room: "",
    bath_room: "",
    year_built: "",
    square_footage: "",
    mls: "",
    price: "",
    description: "",
    dateOne: new Date(),
    timeOne: "",
    dateTwo: new Date(),
    timeTwo: "",
    dateThree: new Date(),
    timeThree: "",
  };

  const [stepOne, setStepOne] = useState(initialStepOne);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    postalCode: "",
    type: "",
  });
  const [cardErrors, setCardErrors] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    postalCode: "",
    type: "",
  });
  const [stepTwo, setStepTwo] = useState(initialStepTwo);
  const [errorOne, setErrorOne] = useState(initialStepOne);
  const [errorTwo, setErrorTwo] = useState({
    ...initialStepTwo,
    dateOne: "",
    dateTwo: "",
    dateThree: "",
  });
  const updateStepOne = (name, value) => {
    setStepOne({ ...stepOne, [name]: value });
  };
  const updateStepTwo = (name, value) => {
    setStepTwo({ ...stepTwo, [name]: value });
  };
  const updateErrorOne = (name, value) => {
    setErrorOne({ ...errorOne, [name]: value });
  };
  const updateErrorTwo = (name, value) => {
    setErrorTwo({ ...errorTwo, [name]: value });
  };
  const updateCardDetails = (cardDetails) => {
    setCardDetails(cardDetails);
  };
  const updateCardErrors = (cardErrors) => {
    setCardErrors(cardErrors);
  };
  const reset = () => {
    setStepOne(initialStepOne);
    setErrorOne(initialStepOne);
    setStepTwo(initialStepTwo);
    setErrorTwo(initialStepTwo);
    setCardDetails({
      number: "",
      expiry: "",
      cvc: "",
      name: "",
      postalCode: "",
      type: "",
    });
    setCardErrors({
      number: "",
      expiry: "",
      cvc: "",
      name: "",
      postalCode: "",
      type: "",
    });
  };

  const value = {
    stepOne: stepOne,
    setStepOne: setStepOne,
    updateStepOne: updateStepOne,
    errorOne: errorOne,
    updateErrorOne: updateErrorOne,
    setErrorOne: setErrorOne,
    stepTwo: stepTwo,
    setStepTwo: setStepTwo,
    updateStepTwo: updateStepTwo,
    errorTwo: errorTwo,
    updateErrorTwo: updateErrorTwo,
    setErrorTwo: setErrorTwo,
    cardDetails: cardDetails,
    updateCardDetails: updateCardDetails,
    cardErrors: cardErrors,
    updateCardErrors: updateCardErrors,
    reset: reset,
  };

  return (
    <OrderInfo.Provider value={value}>
      <PackagesContext>{children}</PackagesContext>
    </OrderInfo.Provider>
  );
};

export default OrderInfoContext;

const styles = StyleSheet.create({});
