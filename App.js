import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import * as SQLite from 'expo-sqlite';

const db=SQLite.openDatabase(
  {
    name: 'MeterTread',
    location: 'default',
  },()=>{},
  error =>{console.log(error)}
)

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
