/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  Card,
  Button,
  TopNavigationAction,
} from '@ui-kitten/components';
import {getLocation, getUser} from './context/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {fetchRecords} from './commons/Services';

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const PlusIcon = props => <Icon {...props} name="plus-outline" />;
export const PolicyScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  return (
    <SafeAreaView>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <ScrollView>
        <Layout style={styles.container}>
          <Text>Policy</Text>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHeading: {
    width: '100%',
    padding: 10,
  },
  floatingButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 70,
    borderRadius: 5,
  },
  counterCards: {
    flexDirection: 'row',
    width: '100%',
  },
  countCard: {
    width: Dimensions.get('window').width / 2 - 20,
    margin: 10,
    justifyContent: 'center',
  },
  countText: {
    textAlign: 'center',
  },
  recentList: {
    flexDirection: 'column',
    width: '100%',
    height: 500,
    padding: 10,
  },
  listCard: {
    width: Dimensions.get('window').width - 20,
    marginBottom: 5,
  },
});
