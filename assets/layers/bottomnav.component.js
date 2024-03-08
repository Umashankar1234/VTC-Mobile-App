import React from "react";
import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import { Icon, Text } from "@ui-kitten/components";

const TourIcon = (props) => <Icon {...props} name="film-outline" />;
const VideoIcon = (props) => <Icon {...props} name="video-outline" />;
const FlyerIcon = (props) => <Icon {...props} name="file-text-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

export const BottomNavigator = ({ navigation }) => {
  return (
    <>
      <View style={styles.tabWrap}>
        <Pressable
          style={styles.buttonWrap}
          onPress={() => navigation.navigate("Imagesets")}
        >
          <Icon name="film-outline" style={styles.tabButton} fill="#FFA12D" />
          <Text category="s1" status="basic" style={styles.tabButtonText}>
            TOURS
          </Text>
        </Pressable>
        <Pressable
          style={styles.buttonWrap}
          onPress={() => navigation.navigate("Flyers")}
        >
          <Icon
            name="file-text-outline"
            style={styles.tabButton}
            fill="#FFA12D"
          />
          <Text category="s1" status="basic" style={styles.tabButtonText}>
            FLYERS
          </Text>
        </Pressable>
        <Pressable
          style={styles.buttonWrap}
          onPress={() => navigation.navigate("Videos")}
        >
          <Icon name="video-outline" style={styles.tabButton} fill="#FFA12D" />
          <Text status="basic" category="s1" style={styles.tabButtonText}>
            VIDEOS
          </Text>
        </Pressable>
        <Pressable
          style={styles.buttonWrap}
          onPress={() => navigation.navigate("Settings")}
        >
          <Icon
            name="settings-2-outline"
            style={styles.tabButton}
            fill="#FFA12D"
          />
          <Text category="s1" status="basic" style={styles.tabButtonText}>
            SETTINGS
          </Text>
        </Pressable>
      </View>
      <View style={styles.homeButtonWrap}>
        <Pressable
          style={styles.homeButton}
          activeOpacity="0.9"
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="home-outline" style={styles.hmButton} fill="#FFFFFF" />
        </Pressable>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  tabWrap: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    // position: 'absolute',
    // bottom: 0,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#ffffff",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  buttonWrap: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 4 - 5,
  },
  tabButton: {
    width: 22,
    height: 22,
  },
  hmButton: {
    width: 20,
    height: 20,
  },
  homeButtonWrap: {
    width: 60,
    height: 60,
    backgroundColor: "#f2f2f2",
    position: "absolute",
    left: "42%",
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  homeButton: {
    width: 44,
    height: 44,
    backgroundColor: "#FFA12D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    // paddingTop: 12,
  },
  tabButtonText: {
    fontSize: 12,
    color: "#adadad",
  },
});
