import React from 'react';
import { StyleSheet,View, Dimensions  } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Formik } from 'formik';
import {LineChart} from "react-native-chart-kit";
function openDatabase() {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    const db = SQLite.openDatabase("metertrend.db");
    return db;
  }
  
  const db = openDatabase();

export default function MeterReadingChart() {

    db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists meterreading (id integer primary key not null, meterid INTEGER NOT NULL, reading integer, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);"
        );
      });
  
    const add = (value) => {
      // is text empty?
      if (value.unitreading === null || value.unitreading === "") {
        return false;
      }
    //   if(value.costperunit === null || value.costperunit === ""){
    //     value.costperunit=0;
    //   }
  
      db.transaction(
        (tx) => {
          tx.executeSql("insert into meterreading (meterid, reading) values (?, ?)", [1,value.unitreading]);
          tx.executeSql("select * from meterreading", [], (_, { rows }) =>
            console.log(JSON.stringify(rows))
          );
        },
        null
        
      );
    };
  

  return (
<View>
  <LineChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
</View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
