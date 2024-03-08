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
import { DataTable } from "react-native-paper";
import { getUser } from "../context/async-storage";
import { axiosPost } from "../commons/Save";
import { useIsFocused } from "@react-navigation/native";

const optionsPerPage = [2, 3, 4];
const OrderList = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [userData, setUserData] = React.useState({});
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
      const result = await axiosPost("orders-list", data);
      setOrders(result.data[0].response.data);
    };
    if (Object.entries(userData).length > 0) {
      fetchData();
    }
  }, [userData]);

  const TableRow = ({ item }) => {
    return (
      <DataTable.Row>
        <DataTable.Cell>{item && item.order_no}</DataTable.Cell>
        <DataTable.Cell>{item && item.amount}</DataTable.Cell>
        <DataTable.Cell>
          {item && item.payment_date.split(" ")[0]}
        </DataTable.Cell>

        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{ color: "#ffffff" }}
            onPress={() =>
              navigation.navigate("OrderDetails", {
                orderId: item && item.id,
                agent_id: userData.agent_id,
              })
            }
          >
            <View style={styles.detailsBtn}>
              <Text style={styles.btnText}>Details</Text>
            </View>
          </Pressable>
        </View>
      </DataTable.Row>
    );
  };
  return (
    <>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Order List</Text>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Order No</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
          <DataTable.Title numeric>Payment Date</DataTable.Title>
          <DataTable.Title numeric>Action</DataTable.Title>
        </DataTable.Header>
        <View style={styles.listHolder}>
          <FlatList data={orders} renderItem={TableRow} />
        </View>
      </DataTable>
    </>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  buttonContainer: {
    // flex: 1,
    // width: 10,
    // marginHorizontal: "auto",
    // borderRadius: 30,
    // paddingHorizontal: 0,
    alignItems: "center",
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
  },
});
