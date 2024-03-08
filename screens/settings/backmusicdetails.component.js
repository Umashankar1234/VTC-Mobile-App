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
  Tab,
  TabBar,
  ViewPager,
} from '@ui-kitten/components';
import {getLocation, getUser} from '../context/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {fetchRecords} from '../commons/Services';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMusic,
  faEnvelopeOpen,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';

const MailIcon = props => (
  <FontAwesomeIcon icon={faEnvelopeOpen} size={25} color={'#FFA12D'} />
);

const PhoneIcon = props => (
  <FontAwesomeIcon icon={faPhone} size={25} color={'#FFA12D'} />
);

export const BackMusicDetailsScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
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
        <ScrollView>
          <View style={styles.headingWrap}>
            <FontAwesomeIcon icon={faMusic} size={20} color={'#adadad'} />
            <Text category="h6" status="warning" style={styles.pageHeading}>
              Background Music Default
            </Text>
          </View>
          <View>
            <Text> Background Music Details</Text>
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    height: Dimensions.get('window').height,
  },
  pageHeading: {
    color: '#adadad',
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: 'row',
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sectionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    elevation: 10,
    borderRadius: 15,
    margin: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  sectionHead: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  uploadImages: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  errorMsg: {
    marginLeft: 10,
    fontSize: 16,
  },
});
