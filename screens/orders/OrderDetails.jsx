import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Package from "./Package";
import { axiosPost } from "../commons/Save";
import { ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const OrderDetails = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { orderId, agent_id } = route.params;
  const [orderDetails, setOrderDetails] = useState();
  useEffect(() => {
    const fetch = async () => {
      const data = {
        agent_id: agent_id,
        orderid: orderId,
      };
      const result = await axiosPost("orders-details", data);
      setOrderDetails(result.data[0].response.data);
    };
    if (orderId && agent_id) fetch();
  }, [orderId, agent_id]);

  return (
    <ScrollView>
      {orderDetails && Object.entries(orderDetails).length > 0 && (
        <View style={styles.container}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Order Details</Text>
          </View>
          <View style={styles.packageContainer}>
            <View>
              <View style={styles.subHeading}>
                <Text style={styles.packageHeading}>Packages</Text>
              </View>
            </View>
            <Package data={orderDetails.packagedetails} />
          </View>
          <View style={styles.packageContainer}>
            <View>
              <View style={styles.subHeading}>
                <Text style={styles.packageHeading}>
                  Miscellaneous Packages
                </Text>
              </View>
            </View>
            <Package data={orderDetails.miscellaneouspackage} />
          </View>
          <View style={styles.packageContainer}>
            <View>
              <View style={styles.subHeading}>
                <Text style={styles.packageHeading}>Property Information</Text>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Caption :</Text>
                  <Text> {orderDetails.orderdetails.caption}</Text>
                </View>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Description :</Text>
                  <Text> {orderDetails.orderdetails.description}</Text>
                </View>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Bed Room :</Text>
                  <Text> {orderDetails.orderdetails.bed_room}</Text>
                </View>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Bath Room :</Text>
                  <Text> {orderDetails.orderdetails.bath_room}</Text>
                </View>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Square Footage :</Text>
                  <Text> {orderDetails.orderdetails.square_footage}</Text>
                </View>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Year Built :</Text>
                  <Text> {orderDetails.orderdetails.year_built}</Text>
                </View>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>MLS :</Text>
                  <Text> {orderDetails.orderdetails.mls}</Text>
                </View>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Price :</Text>
                  <Text> {orderDetails.orderdetails.price}</Text>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.subHeading}>
                <Text style={styles.packageHeading}>
                  Appointment Information
                </Text>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Street Address: </Text>
                  <Text> {orderDetails.orderdetails.street_address}</Text>
                </View>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>First Choice :</Text>
                  <Text>
                    {" "}
                    {orderDetails.orderdetails.first_choice.split(" ")[0]}
                  </Text>
                </View>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>City :</Text>
                  <Text> {orderDetails.orderdetails.city}</Text>
                </View>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Second Choice : </Text>
                  <Text>
                    {" "}
                    {orderDetails.orderdetails.second_choice.split(" ")[0]}
                  </Text>
                </View>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Zipcode :</Text>
                  <Text> {orderDetails.orderdetails.zipcode}</Text>
                </View>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>Third Choice : </Text>
                  <Text> {orderDetails.orderdetails.third_choice}</Text>
                </View>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>State: </Text>
                  <Text> {orderDetails.orderdetails.state}</Text>
                </View>
              </View>
              <View style={styles.infoView}>
                <View style={styles.infoView}>
                  <Text style={styles.infoHeading}>
                    Property Access Information :{" "}
                  </Text>
                  <Text> {orderDetails.orderdetails.notes}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  headingContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 8,
    marginLeft: 4,
  },
  packageContainer: {
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  packageHeading: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "orange",
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  subHeading: {
    borderBottomWidth: 1,
    marginBottom: 4,
    marginRight: 200,
    borderBottomColor: "orange",
  },
  infoView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  infoHeading: { fontWeight: "bold" },
});
