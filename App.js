import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import AddMeterForm from './screens/addMeterForm';
import AddMeterReadingForm from './screens/addMeterReadingForm';
import MeterReadingChart from './screens/meterReadingChart';


export default function App() {
  const actions = [
    {
      text: "Add New Meter",
      icon: require("./assets/icons/icons8-energy-meter-96.png"),
      name: "bt_meter",
      position: 1
    }
  ];
  return (
<View style={styles.container}>
  <Text style={styles.example}>Floating Action example</Text>
  {/* <AddMeterForm/> */}
  {/* <AddMeterReadingForm/> */}
  <MeterReadingChart/>
  <FloatingAction
    actions={actions}
    onPressItem={name => {
      console.log(`selected button: ${name}`);
    }}
  />
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
