import * as React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./screens/home.component";
import { SigninScreen } from "./screens/signin.component";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AccountScreen } from "./screens/account.component";
import { ImageSetsScreen } from "./screens/imagesets.component";
import { fromLeft } from "react-navigation-transitions/src";
import { SignupScreen } from "./screens/signup.component";
import {
  Drawer,
  DrawerItem,
  Divider,
  IndexPath,
  Button,
} from "@ui-kitten/components";

import { ImageBackground, Image } from "react-native";
import {
  AccountIcon,
  DrawerIcon,
  FlyerIcon,
  ForwardIcon,
  HomeIcon,
  ImageIcon,
  LogoutIcon,
  SettingsIcon,
  SupportIcon,
  VideoIcon,
} from "./screens/commons/Icons";
// import { FlyersScreen } from "./screens/flyers.component";
import { SettingsScreen } from "./screens/settings.component";
import { SupportScreen } from "./screens/support.component";
// import { PolicyScreen } from './screens/policy.component';
import { CreateImageSetsScreen } from "./screens/createimagesets.component";
import EditImageSet from "./screens/editImageSet";
import { DescriptionScreen } from "./screens/imageSetsComponents/propertyComponents/description.component";
import { PricingScreen } from "./screens/imageSetsComponents/propertyComponents/pricing.component";
import { LocationInfoScreen } from "./screens/imageSetsComponents/propertyComponents/locationinfo.component";
import { FeaturesScreen } from "./screens/imageSetsComponents/propertyComponents/features.component";
import { DocsFormsScreen } from "./screens/imageSetsComponents/propertyComponents/docsforms.component";
import { AppliancesScreen } from "./screens/imageSetsComponents/amenitiesComponents/appliances.component";
import { InteriorsScreen } from "./screens/imageSetsComponents/amenitiesComponents/interioramenities.component";
import { ExteriorsScreen } from "./screens/imageSetsComponents/amenitiesComponents/exterioramenities.component";
import { CommunityScreen } from "./screens/imageSetsComponents/amenitiesComponents/communityamenities.component";
import { ServiceLinksScreen } from "./screens/imageSetsComponents/actionComponents/servicelinks.component";
import { OtherLinksScreen } from "./screens/imageSetsComponents/actionComponents/otherlinks.component";
import { TrafficReportsScreen } from "./screens/settings/trafficreports.component";
import { MenuOptionsScreen } from "./screens/imageSetsComponents/advancedComponents/menuoptions.component";
// import { BackgroundMusicScreen } from "./screens/imageSetsComponents/advancedComponents/backgroundmusic.component";
import { AnnouncementScreen } from "./screens/imageSetsComponents/advancedComponents/announcement.component";
import { NewsletterScreen } from "./screens/imageSetsComponents/advancedComponents/newsletter.component";
import { ThemesScreen } from "./screens/imageSetsComponents/advancedComponents/themes.component";
import { CompanyBannerScreen } from "./screens/imageSetsComponents/advancedComponents/companbybanner.component";
import { ColistingAgentScreen } from "./screens/imageSetsComponents/advancedComponents/colistingagent.component";
import { YoutubeLinksScreen } from "./screens/imageSetsComponents/advancedComponents/youtubelinks.component";
import { WalkthroughScreen } from "./screens/imageSetsComponents/advancedComponents/walkthrough.component";
import { BackgroundMusicScreen } from "./screens/imageSetsComponents/advancedComponents/backgroundmusic.component";
import { AgentProfileScreen } from "./screens/settings/agenprofile.component";

import { useAuthorization } from "./screens/context/AuthProvider";
import ForgotPassword from "./screens/ForgotPassword";
import DownloadImages from "./screens/DownloadImages";
import TourNarration from "./screens/imageSetsComponents/advancedComponents/TourNarration";
import OrderList from "./screens/orders/OrderList";
import OrderDetails from "./screens/orders/OrderDetails";
import NewOrder from "./screens/NewOrder";
import OrderInfoContext from "./screens/context/OrderInfoContext";
import logoIcon from "./assets/media/vtc-logo2.png";
import OrdersTabNavigation from "./assets/layers/TabNavigation";
import Flyercomponent, { FlyersScreen } from "./screens/flyers.component";
import FlyerEdit from "./screens/FlyerEdit";
import SendFlyer from "./screens/editFlyer/SendFlyer";
import Themes from "./screens/editFlyer/Themes";
import { CompanyInfoScreen } from "./screens/settings/companyinfo.component";
import PostToCraigslist from "./screens/editFlyer/PostToCraigslist";
import { DefEmailPhoneOptScreen } from "./screens/settings/defemailphoneopt.component";
import { PreferencesScreen } from "./screens/settings/preferences.component";
import { VideoOptionsScreen } from "./screens/settings/videooptions.component";
import { TourOptionsScreen } from "./screens/settings/touroptions.component";
import { FlyerOptionsScreen } from "./screens/settings/flyeroptions.component";
import { SlideShowDefaultsScreen } from "./screens/settings/slideshowdefaults.component";
import { PanoramaDefaultsScreen } from "./screens/settings/panoramadefaults.component";
import { BackMusicDetailsScreen } from "./screens/settings/backmusicdetails.component";
import { PaymentProfileScreen } from "./screens/settings/paymaentprofile.component";
import { ThemesDefaultsScreen } from "./screens/settings/themesdefaults.component";
import { SocialNetworkingScreen } from "./screens/settings/socialnetworking.component";
import { NewsletterFormScreen } from "./screens/settings/newsletterform.component";
import { StatusBar } from "react-native";
import VideosScreen from "./screens/videos.component";
import VideoPromotion from "./screens/editVideo/VideoPromotion";
import { Text } from "react-native-paper";

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = createDrawerNavigator();

const Header = (props) => (
  <View
    style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }}
  >
    <ImageBackground
      resizeMode="contain"
      style={[props.style, styles.header]}
      source={require("./assets/media/logo.png")}
    />
    <Divider />
  </View>
);
const Footer = (props) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View>
      <Text
        style={{
          fontWeight: "bold",
        }}
      >
        Copyright © 2010-2023
      </Text>
    </View>
    <View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        VirtualTourCafe, LLC
      </Text>
    </View>
  </View>
);
const DrawerContent = ({ navigation, state }) => {
  return (
    <Drawer
      header={Header}
      footer={Footer}
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
    >
      <DrawerItem
        title="MY CAFE"
        accessoryLeft={HomeIcon}
        accessoryRight={ForwardIcon}
      />
      <DrawerItem
        title="ACCOUNT"
        accessoryLeft={AccountIcon}
        accessoryRight={ForwardIcon}
      />
      <DrawerItem
        title="TOURS"
        accessoryLeft={ImageIcon}
        accessoryRight={ForwardIcon}
      />
      <DrawerItem
        title="FLYERS"
        accessoryLeft={FlyerIcon}
        accessoryRight={ForwardIcon}
      />
      <DrawerItem
        title="VIDEOS"
        accessoryLeft={VideoIcon}
        accessoryRight={ForwardIcon}
      />
      <DrawerItem
        title="SETTINGS"
        accessoryLeft={SettingsIcon}
        accessoryRight={ForwardIcon}
      />
      <DrawerItem
        title="SUPPORT"
        accessoryLeft={SupportIcon}
        accessoryRight={ForwardIcon}
      />
      {/* <DrawerItem
      title="HELP"
      accessoryLeft={HelpIcon}
      accessoryRight={ForwardIcon}
    /> */}
      {/* <DrawerItem
        title="POLICY"
        accessoryLeft={PolicyIcon}
        accessoryRight={ForwardIcon}
      /> */}
    </Drawer>
  );
};

export const DrawerNavigator = () => {
  const { signOut } = React.useMemo(() => useAuthorization(), []);
  return (
    <OrderInfoContext>
      <Navigator
        backBehavior="history"
        screenOptions={({ navigation, route }) => ({
          // headerShown: false,
          title: false,
          headerRight: () => {
            return (
              <Button
                style={styles.headButton}
                appearance="ghost"
                status="basic"
                accessoryLeft={LogoutIcon}
                onPress={() => {
                  signOut();
                  navigation.navigate("SignIn");
                }}
              />
            );
          },

          headerLeft: () => {
            return (
              <View style={styles.headerLeftContainer}>
                <Button
                  style={styles.headButton}
                  appearance="ghost"
                  status="primary"
                  accessoryLeft={DrawerIcon}
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}
                />
                <Image style={styles.logo} source={logoIcon} />
              </View>
            );
          },
        })}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Screen name="Home" component={HomeScreen} />
        <Screen name="Account" component={AccountScreen} />
        <Screen name="Imagesets" component={ImageSetsScreen} />
        {/* <Screen name="Tours" component={DownloadImages} /> */}
        <Screen name="Flyers" component={Flyercomponent} />
        <Screen name="Videos" component={VideosScreen} />
        {/* <Screen name="Help" component={HelpScreen} /> */}
        {/* <Screen name="Policy" component={PolicyScreen} /> */}
        {/* <Screen name="CreateImageSets" component={CreateImageSetsScreen} /> */}
        {/* Imagesets --- Actions Screens */}
        <Screen name="Settings" component={SettingsScreen} />
        <Screen name="Support" component={SupportScreen} />
        <Screen name="SendFlyer" component={SendFlyer} />
        <Screen name="AgentProfile" component={AgentProfileScreen} />
        <Screen name="CompanyInfo" component={CompanyInfoScreen} />
        <Screen name="DefEmailPhone" component={DefEmailPhoneOptScreen} />
        <Screen name="Preferences" component={PreferencesScreen} />
        <Screen name="VideoOptions" component={VideoOptionsScreen} />
        <Screen name="TourOptions" component={TourOptionsScreen} />
        <Screen name="SlideShowDefaults" component={SlideShowDefaultsScreen} />
        <Screen name="PanoramaDefaults" component={PanoramaDefaultsScreen} />
        <Screen name="BackMusicDetails" component={BackMusicDetailsScreen} />
        <Screen name="PaymentProfile" component={PaymentProfileScreen} />
        <Screen name="ThemesDefaults" component={ThemesDefaultsScreen} />
        <Screen name="SocialNetworking" component={SocialNetworkingScreen} />
        <Screen name="NewsletterForm" component={NewsletterFormScreen} />
        <Screen name="FlyerOptions" component={FlyerOptionsScreen} />
        <Screen name="FlyerThemes" component={Themes} />
        <Screen name="PostToCraigslist" component={PostToCraigslist} />
        <Screen name="TrafficReports" component={TrafficReportsScreen} />

        <Screen name="ServiceLinksScreen" component={ServiceLinksScreen} />
        <Screen name="OtherLinksScreen" component={OtherLinksScreen} />
        {/* Imagesets --- Property Information Screens */}
        <Screen name="DescriptionScreen" component={DescriptionScreen} />

        <Screen name="FeaturesScreen" component={FeaturesScreen} />

        <Screen name="PricingScreen" component={PricingScreen} />
        <Screen name="LocationInfoScreen" component={LocationInfoScreen} />
        <Screen name="DocsFormsScreen" component={DocsFormsScreen} />
        {/* Imagesets --- Amenities Screens */}
        <Screen name="AppliancesScreen" component={AppliancesScreen} />

        <Screen name="InteriorsScreen" component={InteriorsScreen} />
        <Screen name="ExteriorsScreen" component={ExteriorsScreen} />
        <Screen name="CommunityScreen" component={CommunityScreen} />
        {/* Imagesets --- Advanced Screens */}
        <Screen name="MenuOptionsScreen" component={MenuOptionsScreen} />
        <Screen
          name="BackgroundMusicScreen"
          component={BackgroundMusicScreen}
        />
        <Screen name="AnnouncementScreen" component={AnnouncementScreen} />
        <Screen name="NewsletterScreen" component={NewsletterScreen} />
        <Screen name="ThemesScreen" component={ThemesScreen} />
        <Screen name="CompanyBannerScreen" component={CompanyBannerScreen} />
        <Screen name="ColistingAgentScreen" component={ColistingAgentScreen} />
        <Screen name="YoutubeLinksScreen" component={YoutubeLinksScreen} />
        <Screen name="WalkthroughScreen" component={WalkthroughScreen} />
        <Screen name="TourNarration" component={TourNarration} />
        <Screen name="OrdersList" component={OrdersTabNavigation} />
        <Screen name="OrderDetails" component={OrderDetails} />
        <Screen name="NewOrder" component={NewOrder} />
        <Screen name="VideoPromotion" component={VideoPromotion} />

        {/* 
    <Screen name="Home" component={HomeScreen} />
  <Screen name="Account" component={AccountScreen} />
  <Screen name="Imagesets" component={ImageSetsScreen} />
  <Screen name="Tours" component={TourScreen} />
  <Screen name="Flyers" component={FlyersScreen} />
  <Screen name="Videos" component={VideosScreen} />
  <Screen name="Settings" component={SettingsScreen} />
  <Screen name="Support" component={SupportScreen} /> */}
        {/* <Screen name="Help" component={HelpScreen} /> */}
        {/* <Screen name="Policy" component={PolicyScreen} /> */}
        <Screen name="CreateImageSets" component={CreateImageSetsScreen} />
        <Screen
          name="EditImageSet"
          component={EditImageSet}
          initialParams={{ tourid: 0 }}
        />
        <Screen
          name="EditFlyer"
          component={FlyerEdit}
          initialParams={{ tourid: 0 }}
        />
      </Navigator>
    </OrderInfoContext>
  );
};

function AuthScreens() {
  return <DrawerNavigator />;
}
const MainStackNavigator = () => {
  const { status, authToken } = useAuthorization();
  return (
    <Stack.Navigator
      initialRouteName={
        status === "signOut" || status === "idle" ? "SignIn" : "MyDashboard"
      }
      transitionConfig={fromLeft()}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleAlign: "center",
        headerTintColor: "green",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SignIn" component={SigninScreen} />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen
        name="MyDashboard"
        component={AuthScreens}
        options={{
          title: "Sign In",
        }}
      />
    </Stack.Navigator>
  );
};
export default function Routes() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 128,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
  icon: {
    width: 20,
    height: 20,
  },
  logo: {
    width: 150,
    height: 45,
    resizeMode: "contain",
  },
  headerLeftContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
