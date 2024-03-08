import * as React from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import OrderList from "../../screens/orders/OrderList";
import PendingOrdersList from "../../screens/orders/PendingOrdersList";

const OrdersTabNavigation = ({ navigation }) => {
  const FirstItem = React.useCallback(
    () => <OrderList navigation={navigation} />,
    [navigation]
  );
  const SecondItem = React.useCallback(
    () => <PendingOrdersList navigation={navigation} />,
    [navigation]
  );
  const renderScene = SceneMap({
    first: FirstItem,
    second: SecondItem,
  });
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Completed Orders" },
    { key: "second", title: "Pending Orders" },
  ]);
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "black" }}
    />
  );
  return (
    <>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
};

export default OrdersTabNavigation;

const styles = StyleSheet.create({});
