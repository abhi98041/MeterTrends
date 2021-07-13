import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions,ActivityIndicator } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { openDatabase } from '../shared/dbFunctions';
import { DataTable } from 'react-native-paper';

const db = openDatabase();

export default function MeterReadingChart({ route, navigation }) {
  const { id } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [TimeStamp, setTimeStamp] = useState([]);
  const [MeterReading, setMeterReading] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists meterreading (id integer primary key not null, meterid INTEGER NOT NULL, reading integer, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);"
      );
      tx.executeSql('SELECT * FROM meterreading where meterid=?;', [id], (tx, results) => {
        console.log("Query completed");

        var len = results.rows.length;

        if (len > 0) {
          let temp_timestamp_array = []
          let temp_meter_reading_array = []
          for (let i = 0; i < len; i++) {
            temp_timestamp_array.push(results.rows['_array'][i]['Timestamp']);
            temp_meter_reading_array.push(results.rows['_array'][i]['reading']);
          }
          setTimeStamp(temp_timestamp_array);
          setMeterReading(temp_meter_reading_array);
          setLoading(false);
        }
        else {
          setTimeStamp([]);
          setLoading(false);
        }
      });
    })
  }, []);
console.log(TimeStamp);
console.log(MeterReading);
  return (

    <View style={{ flex: 1, padding: 24 }}>
    {isLoading ? <ActivityIndicator /> : (

        <LineChart
        data={{
          labels: TimeStamp,
          datasets: [
            {
              data: MeterReading
            }
          ]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        // yAxisLabel="$"
        // yAxisSuffix="k"
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


    )}

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
