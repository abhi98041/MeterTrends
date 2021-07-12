import React ,{useState}from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddMeterForm from './screens/addMeterForm';
import AddMeterReadingForm from './screens/addMeterReadingForm';
import MeterReadingChart from './screens/meterReadingChart';
import { AppNavigator } from "./routes/homeStack";
import AppLoading from 'expo-app-loading';

export default function App() {
    return (
      <AppNavigator />
      // <View style={styles.container}>
      // <AddMeterForm/>
      // </View>
    );
}
// const styles = StyleSheet.create({
//   container: {
//       flex: 1,
//       paddingTop: 40,
//       alignContent: 'center',
//       alignItems: 'center'
//   },
// });