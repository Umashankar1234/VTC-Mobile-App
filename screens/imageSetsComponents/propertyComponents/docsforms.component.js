/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Card,
  Button,
  TopNavigationAction,
  Toggle,
  Input,
} from "@ui-kitten/components";
import { useIsFocused } from "@react-navigation/native";
// import {useForm, Controller} from 'react-hook-form';
// import {getLocation, getUser} from '../../context/async-storage';
// import {useIsFocused} from '@react-navigation/native';
// import {fetchRecords} from '../../commons/Services';
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export const DocsFormsScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const { tourid } = route.params;

  return <Text>DocsForms</Text>;
};
