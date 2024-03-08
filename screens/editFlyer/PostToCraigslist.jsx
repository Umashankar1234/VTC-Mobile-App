import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@ui-kitten/components/ui";
import { ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";

const PostToCraigslist = ({ route }) => {
  const isFocused = useIsFocused();
  const { tourid } = route.params;
  const [city, setCity] = useState();

  const [htmlContent, setHtmlContent] = useState(
    `<p>https://www.virtualtourcafe.com/agent-view-flyer-active${tourid}</p>`
  );
  return (
    <>
      <View style={styles.headingWrap}>
        <Text category="h6" status="warning" style={styles.pageHeading}>
          Post To Craigslist
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.sectionWrap}>
        <View style={styles.sectionInfo}>
          <View style={styles.subHeading}>
            <Text style={styles.packageHeading}>
              VIRTULETOURCAFE - POST TO CRAIGSLIST
            </Text>
          </View>
          <View style={styles.description}>
            <Text>
              We have created a very simple "Widget" to help you Post to
              Craigslist. Please follow these steps:
            </Text>
            <Text>
              If you are a Macintosh User, please log into your Craigslist
              Account, then click on "Continue" button below. highlight and
              right-click this link: VirtualTourCafe - MyCafeToGo then "Add to
              Favorites" or "Bookmark" the link. Alternatively, you can drag the
              link to your Toolbar if your browser allows
            </Text>
          </View>
          <View style={styles.steps}>
            <View style={styles.stepsHeading}>
              <View style={styles.centeredView}>
                <Text style={styles.stepsHeadingText}>1. COPY HTML</Text>
              </View>
              <View style={styles.centeredView}>
                <Text style={styles.stepsSubHeadingText}>
                  Copy the HTML code in the box below.
                </Text>
              </View>
            </View>
            <View style={styles.stepContext}>
              <View>
                <Text style={styles.stepsTextHeading}>HTML CODE</Text>
              </View>
              <View>
                <Text>
                  To Post to Craigslist, select the city that is closest to you.
                </Text>
              </View>
              <View>
                <TextInput value={htmlContent} />
              </View>
            </View>
          </View>
          <View style={styles.steps}>
            <View style={styles.stepsHeading}>
              <View style={styles.centeredView}>
                <Text style={styles.stepsHeadingText}>2. OPEN CRAIGSLIST</Text>
              </View>
              <View style={styles.centeredView}>
                <Text style={styles.stepsSubHeadingText}>
                  Open the Craigslist website page for your city or region
                  (below), and follow the steps you normally would to get to the
                  page where you create your post. If you are not already
                  logged-in to your account, you will be prompted to log in or
                  use your email address as a guest.
                </Text>
              </View>
            </View>
            <View style={styles.stepContext}>
              <View>
                <Text style={styles.stepsTextHeading}>POST TO CRAIGSLIST</Text>
              </View>
              <View>
                <Text>
                  To Post to Craigslist, select the city that is closest to you.
                </Text>
              </View>
              <View style={styles.formCtrlWrap}>
                <Picker
                  themeVariant="light"
                  selectedValue={city}
                  style={styles.formControl}
                  onValueChange={(itemValue, itemIndex) => {
                    setCity(itemValue);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    label="Select City"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="MLS"
                    label="MLS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="MLS"
                    label="MLS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="MLS"
                    label="MLS"
                  />
                  <Picker.Item
                    style={styles.pickerItemStyle}
                    value="MLS"
                    label="MLS"
                  />
                </Picker>
              </View>
            </View>
          </View>
          <View style={styles.steps}>
            <View style={styles.stepsHeading}>
              <View style={styles.centeredView}>
                <Text style={styles.stepsHeadingText}>3. LOGIN OR GUEST</Text>
              </View>
              <View style={styles.centeredView}>
                <Text style={styles.stepsSubHeadingText}>
                  Fill-in the Craigslist fields such as title, price, etc.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.steps}>
            <View style={styles.stepsHeading}>
              <View style={styles.centeredView}>
                <Text style={styles.stepsHeadingText}>
                  4. SELECT REAL ESTATE FOR SALE
                </Text>
              </View>
              <View style={styles.centeredView}>
                <Text style={styles.stepsSubHeadingText}>
                  SClick your mouse in the Posting Description field and PASTE
                  the HTML code. The HTML will appear in the Posting Description
                  field.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.steps}>
            <View style={styles.stepsHeading}>
              <View style={styles.centeredView}>
                <Text style={styles.stepsHeadingText}>5. RETURN TO VTC</Text>
              </View>
              <View style={styles.centeredView}>
                <Text style={styles.stepsSubHeadingText}>
                  nce all the fields are populated continue with your Craigslist
                  post to add your pictures and complete your posting.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <Button mode="contained" buttonColor="orange">
              Continue
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default PostToCraigslist;

const styles = StyleSheet.create({
  formCtrlWrap: { borderWidth: 1, borderRadius: 8, marginTop: 8 },
  btnContainer: {
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  packageHeading: { fontWeight: "bold" },
  formControl: {
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    paddingLeft: 0,
  },
  stepContext: { margin: 20 },
  centeredView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  stepsSubHeadingText: {
    // textAlign: "center",
    marginHorizontal: 20,
  },
  stepsTextHeading: { fontWeight: 800 },
  stepsHeadingText: { fontWeight: 800, textAlign: "center", color: "orange" },
  stepsHeading: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  steps: { marginTop: 8 },
  subHeading: { borderBottomWidth: 2, paddingBottom: 15, marginBottom: 8 },
  pageHeading: {
    color: "#FFA12D",
    marginLeft: 10,
    fontSize: 20,
  },
  headingWrap: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "space-between",
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "center",
  },
  sectionInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    elevation: 10,
    borderRadius: 15,
    marginVertical: 6,
    marginHorizontal: 6,
    // flexDirection: "row",
    // alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "90%",
  },
});
