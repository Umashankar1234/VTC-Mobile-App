import { StyleSheet, Text, View } from "react-native";
import React, { Children, createContext, useContext, useState } from "react";

const PackagesProvider = createContext({
  cartePackage: [],
  miscPackage: [],
  subPackage: [],
  price: 0,
  addSubPackage: () => {},
  removeSubPackage: () => {},
  addMiscPackage: () => {},
  removeMiscPackage: () => {},
  changePrice: () => {},
});

export const getAddedPackages = () => {
  const result = useContext(PackagesProvider);
  return result;
};
const PackagesContext = ({ children }) => {
  const [price, setPrice] = useState(0);
  const [miscPackage, setMiscPackage] = useState([]);
  const [subPackage, setSubPackage] = useState([]);
  const [cartePackage, setCartePackage] = useState([]);

  const addSubPackage = (id, packagePrice) => {
    setSubPackage((prevArr) => [...prevArr, id]);
    setPrice(price + +packagePrice);
  };
  const removeSubPackage = (id, packagePrice) => {
    setSubPackage((prevArr) => prevArr.filter((item) => item !== id));
    setPrice(price - +packagePrice);
  };
  const addMiscPackage = (id, packagePrice) => {
    setMiscPackage((prevArr) => [...prevArr, id]);
    setPrice(price + +packagePrice);
  };
  const removeMiscPackage = (id, packagePrice) => {
    setMiscPackage((prevArr) => prevArr.filter((item) => item !== id));
    setPrice(price - +packagePrice);
  };
  const addCartePackage = (id) => {
    setCartePackage((prevArr) => [...prevArr, id]);
  };
  const setSelectedPackage = (array) => {
    setSubPackage(array);
  };
  const setSelectedCartePackage = (array) => {
    setCartePackage(array);
  };
  const setSelectedMiscPackage = (array) => {
    setMiscPackage(array);
  };
  const removeCartePackage = (id) => {
    const prevArr = [...cartePackage];
    let idx = prevArr.findIndex((p) => p == id);
    removed = prevArr.splice(idx, 1);
    setCartePackage(prevArr);
  };
  const reset = () => {
    setPrice(0);
    setMiscPackage([]);
    setSubPackage([]);
    setCartePackage([]);
  };
  const value = {
    miscPackage: miscPackage,
    subPackage: subPackage,
    cartePackage: cartePackage,
    price: price,
    addSubPackage: addSubPackage,
    removeSubPackage: removeSubPackage,
    addMiscPackage: addMiscPackage,
    removeMiscPackage: removeMiscPackage,
    addCartePackage: addCartePackage,
    removeCartePackage: removeCartePackage,
    setSelectedPackage: setSelectedPackage,
    setSelectedCartePackage: setSelectedCartePackage,
    setSelectedMiscPackage: setSelectedMiscPackage,
    setPrice: setPrice,
    resetPackages: reset,
  };
  return (
    <PackagesProvider.Provider value={value}>
      {children}
    </PackagesProvider.Provider>
  );
};

export default PackagesContext;

const styles = StyleSheet.create({});
