import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screen/HomeScreen";
import ProductScreen from "../screen/ProductScreen";

const Tab = createBottomTabNavigator();

const screens = [
  {
    name: "Trang chủ",
    component: HomeScreen,
  },
  {
    name: "Sản phẩm",
    component: ProductScreen,
  },
];

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconName =
          {
            "Trang chủ": "home",
            "Sản phẩm": "shoe-sneaker",
          }[route.name] || "home";

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#f2741f",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: [
        {
          display: "flex",
        },
        null,
      ],
    })}>
    {screens.map(({ name, component }) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
        options={{ headerShown: false }}
      />
    ))}
  </Tab.Navigator>
);

export default TabNavigator;
