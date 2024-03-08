import React, { useMemo } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Button } from "@ui-kitten/components";
import { useAuthorization } from "../../screens/context/AuthProvider";
import logoIcon from "../media/vtc-logo2.png";
import { BellIcon, DrawerIcon, LogoutIcon } from "../../screens/commons/Icons";

export const TopNavigator = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { signOut } = useMemo(() => useAuthorization(), []);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.topNavWrap}>
      <View style={styles.leftRow}>
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
      <View style={styles.rightRow}>
        <Button
          style={styles.headButton}
          appearance="ghost"
          status="basic"
          accessoryLeft={BellIcon}
          // onPress={() => {
          //   navigation.navigate('Notifications');
          // }}
        />
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 45,
    resizeMode: "contain",
  },
  topNavWrap: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    height: 50,
    elevation: 10,
  },
  rightMenu: {
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  headButton: {
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  leftRow: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingLeft: 10,
  },
  rightRow: {
    width: "40%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
});
