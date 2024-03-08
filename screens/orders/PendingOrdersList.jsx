import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { useAuthorization } from "../context/AuthProvider";
import { Button, DataTable } from "react-native-paper";
import { getUser } from "../context/async-storage";
import { axiosPost } from "../commons/Save";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";
import { getAddedPackages } from "../context/PackagesContext";
import { getOrderInfo } from "../context/OrderInfoContext";
import { useIsFocused } from "@react-navigation/native";
const optionsPerPage = [2, 3, 4];

const PendingOrdersList = ({ navigation }) => {
  const isFocused = useIsFocused();

  const packageCtx = getAddedPackages();
  const orderCtx = getOrderInfo();
  const [userData, setUserData] = React.useState({});
  const [sync, setSync] = React.useState(false);
  const [orders, setOrders] = React.useState({});
  const { status, authToken } = useMemo(() => useAuthorization(), []);

  const fetchUser = React.useCallback(async () => {
    if (status === "signOut") {
    } else {
      var myInfo = await getUser();
      setUserData(myInfo);
    }
  }, [status]);
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  React.useEffect(() => {
    const fetchData = async () => {
      const data = { agent_id: userData.agent_id };
      const result = await axiosPost("pending-orders-list", data);
      setOrders(result.data[0].response.data.pending_list);
    };
    if (Object.entries(userData).length > 0) {
      fetchData();
    }
  }, [userData, sync]);
  const confirmDelete = (id) => {
    Alert.alert("Delete Pending Order", "Are your sure?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Delete", onPress: () => deleteOrder(id) },
    ]);
  };
  const deleteOrder = async (id) => {
    const data = { agent_id: userData.agent_id, orderid: id };
    const result = await axiosPost("delete-pending-order", data);
    if (result.data[0].response.status == "success") {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Deleted successfully",
        position: "top",
        topOffset: "70",
      });
      setSync(!sync);
    }
  };
  const completeOrder = async (id) => {
    const data = { agent_id: userData.agent_id, orderid: id };
    const result = await axiosPost("pending-orders-details", data);
    if (result.data[0].response.status == "success") {
      packagesArr = [];
      categoryArr = [];
      miscArr = [];
      price = 0;

      result.data[0].response.data.packagedetails?.forEach((element) => {
        packagesArr.push(element.id);
        categoryArr.push(element.cat_id);
        price += +element.price;
      });

      result.data[0].response.data.miscellaneouspackage?.forEach((element) => {
        miscArr.push(element.id);
        price += +element.price;
      });
      const orderDetails = result.data[0].response.data.orderdetails;
      try {
        packageCtx.setSelectedPackage(packagesArr);
        packageCtx.setSelectedCartePackage(categoryArr);
        packageCtx.setSelectedMiscPackage(miscArr);
        packageCtx.setPrice(price);
        orderCtx.setStepOne({
          broker_zipcode: orderDetails.broker_zipcode,
          zip: orderDetails.zipcode,
          interior_area: orderDetails.interior_area,
          address: orderDetails.address,
          city: orderDetails.city,
          state: orderDetails.state,
          notes: orderDetails.notes,
        });
        orderCtx.setStepTwo({
          caption: orderDetails.caption,
          bed_room: orderDetails.bed_room,
          bath_room: orderDetails.bath_room,
          year_built: orderDetails.year_built,
          square_footage: orderDetails.square_footage,
          mls: orderDetails.mls,
          price: orderDetails.price,
          description: orderDetails.description,
          dateOne: new Date(orderDetails.first_choice),
          timeOne: orderDetails.first_time,
          dateTwo: new Date(orderDetails.second_choice),
          timeTwo: orderDetails.second_time,
          dateThree: new Date(orderDetails.third_choice),
          timeThree: orderDetails.third_time,
        });
        navigation.navigate("NewOrder", {
          continueOrder: true,
        });
      } catch (error) {
      }
    }
  };
  const SingleOrder = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("OrderDetails", {
            orderId: item && item.id,
            agent_id: userData.agent_id,
          })
        }
        android_ripple={{ color: "#d6d6d6" }}
        style={styles.cardContainer}
      >
        <View style={styles.topContainer}>
          <View style={styles.topSubContainer}>
            <Text style={styles.topHeading}>{item?.caption} </Text>
          </View>
          <View style={styles.topSubContainer}>
            <Text style={styles.topHeading}>Order Id: #{item?.id}</Text>
          </View>
        </View>
        <View style={styles.topContainer}>
          <View style={[styles.botContainer, styles.leftContainer]}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{item?.city}</Text>
          </View>
          <View style={styles.botContainer}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{item?.date}</Text>
          </View>
        </View>
        <View>
          <View style={styles.nextPrevBtnContainer}>
            <Button
              icon="arrow-right-bold-circle"
              mode="contained"
              buttonColor="#e40000"
              onPress={() => confirmDelete(item.id)}
            >
              Delete Order
            </Button>
            <Button
              icon="arrow-right-bold-circle"
              mode="contained"
              buttonColor="#028dff"
              onPress={(e) => completeOrder(item.id)}
            >
              Comeplete Order
            </Button>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Pending Order List</Text>
      </View>
      <FlatList data={orders} renderItem={SingleOrder} />
    </>
  );
};

export default PendingOrdersList;

const styles = StyleSheet.create({
  headingContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 8,
    marginLeft: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "orange",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    color: "#888383ff",
  },
  topHeading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardContainer: {
    borderWidth: 2,
    borderRadius: 16,
    margin: 16,
    borderColor: "orange",
    padding: 8,
    backgroundColor: "#ffe1a23d",
  },
  leftContainer: {
    borderRightWidth: 2,
    borderColor: "#46464634",
  },
  topSubContainer: {
    flex: 1,
    padding: 8,
    // width: 10,
    // marginHorizontal: "auto",
    // borderRadius: 30,
    // paddingHorizontal: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  botContainer: {
    flex: 1,
    padding: 8,

    // width: 10,
    // marginHorizontal: "auto",
    // borderRadius: 30,
    // paddingHorizontal: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 12,
    color: "white",
  },
  listHolder: {
    height: Dimensions.get("window").height,
  },
  headingContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 8,
    marginLeft: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "orange",
  },
  detailsBtn: {
    padding: 4,
    backgroundColor: "orange",
    borderRadius: 10,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  nextPrevBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    // marginHorizontal: 10,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
});
