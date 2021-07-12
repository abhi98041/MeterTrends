import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddMeterForm from "../screens/addMeterForm";
import Home from "../screens/home";
import MeterReadingChart from "../screens/meterReadingChart";
import Home1 from "../screens/home1";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
  <Navigator headerMode="float">
    {/* <Screen name="Home1" component={Home1} title='Home1' /> */}
    <Screen name="Home" component={Home} title='Home' />
    <Screen name="AddMeter" component={AddMeterForm} title='Add A Meter' />  
    <Screen name="MeterReadingChart" component={MeterReadingChart} title='Meter Details' />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
