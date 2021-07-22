import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator, FlatList, Text } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { openDatabase } from '../shared/dbFunctions';
import { DataTable, IconButton, Colors, Paragraph, Dialog, Portal, Button, Provider, Card, Title } from 'react-native-paper';
import Moment from 'moment';

Moment.locale('en');
const db = openDatabase();

export default function MeterReadingChart({ route, navigation }) {
  const { id } = route.params;
  const [visible, setVisible] = useState(false);
  const [meterid, setmeterid] = useState('');


  function showDialog() {
    setVisible(true);
  }


  const hideDialog = () => setVisible(false);

  const deleteconfirmed = () => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM meterreading where id=?;', [meterid], (tx, results) => {
        rerenderafterdelete();
        setVisible(false);

      });
    })
    // setVisible(false);
  };

  function returnproperdate(dt) {
    return Moment(dt).format('d MMM yy')
  }


  const [isLoading, setLoading] = useState(true);
  const [isValueZero, setValueZero] = useState(false);
  const [TimeStamp, setTimeStamp] = useState([]);
  const [MeterReading, setMeterReading] = useState([]);
  const [data, setData] = useState([]);
  const [estimatedBill, setestimatedBill] = useState('');

function rerenderafterdelete(){
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM meterreading where meterid=?;', [id], (tx, results) => {
      console.log("Query completed");

      var len = results.rows.length;

      if (len > 0) {
        setData(results.rows['_array']);
        let temp_timestamp_array = []
        let temp_meter_reading_array = []
        for (let i = 0; i < len; i++) {

          var dt = results.rows['_array'][i]['Timestamp'];
          // let d = new Date(results.rows['_array'][i]['Timestamp']);
          let daydate = Moment(dt).format('d')
          // console.log(results.rows['_array'][i]['Timestamp'])

          temp_timestamp_array.push(daydate);
          temp_meter_reading_array.push(results.rows['_array'][i]['reading']);
        }

        setTimeStamp(temp_timestamp_array);
        setMeterReading(temp_meter_reading_array);
        setLoading(false);
      }
      else {
        setValueZero(true);
        setTimeStamp([]);
        setLoading(false);
      }
      console.log("<--------->");
      console.log(temp_meter_reading_array.length);

      if (temp_meter_reading_array.length < 2)
      {console.log("In If");
      setestimatedBill('₹0')}
      else {
        console.log("Inside Else")
        tx.executeSql('SELECT costperunit FROM metername where id=?;', [id], (tx, results) => {
          console.log("Query completed");
          
            let unitdifference=temp_meter_reading_array[temp_meter_reading_array.length-1]-temp_meter_reading_array[0]
            console.log(unitdifference)
            setestimatedBill ('₹'+(results.rows['_array'][0].costperunit*unitdifference));
          
          
        });
      } 
    });

  })
}



  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists meterreading (id integer primary key not null, meterid INTEGER NOT NULL, reading integer, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);"
      );
      tx.executeSql('SELECT * FROM meterreading where meterid=?;', [id], (tx, results) => {
        console.log("Query completed");

        var len = results.rows.length;

        if (len > 0) {
          setData(results.rows['_array']);
          let temp_timestamp_array = []
          let temp_meter_reading_array = []
          for (let i = 0; i < len; i++) {

            var dt = results.rows['_array'][i]['Timestamp'];
            // let d = new Date(results.rows['_array'][i]['Timestamp']);
            let daydate = Moment(dt).format('d')
            // console.log(results.rows['_array'][i]['Timestamp'])

            temp_timestamp_array.push(daydate);
            temp_meter_reading_array.push(results.rows['_array'][i]['reading']);
          }

          setTimeStamp(temp_timestamp_array);
          setMeterReading(temp_meter_reading_array);
          setLoading(false);

          console.log("<--------->");
          console.log(temp_meter_reading_array.length);
    
          if (temp_meter_reading_array.length < 2)
          {console.log("In If");
          setestimatedBill('₹0')}
          else {
            console.log("Inside Else")
            tx.executeSql('SELECT costperunit FROM metername where id=?;', [id], (tx, results) => {
              console.log("Query completed");
              
                let unitdifference=temp_meter_reading_array[temp_meter_reading_array.length-1]-temp_meter_reading_array[0]
                console.log(unitdifference)
                setestimatedBill ('₹'+(results.rows['_array'][0].costperunit*unitdifference));
              
              
            });
          } 
        }
        else {
          setValueZero(true);
          setTimeStamp([]);
          setLoading(false);
        }

      });
 
    })
  }, []);
  // console.log(TimeStamp);
  // console.log(MeterReading);




  return (
    <Provider>
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator /> : (
          <View>
            {isValueZero ? <Text>No Records Found!</Text> : (

              <View>
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
                <Card>
                  <Card.Content>
                    <Title>Expected Bill Amount: </Title>
                    <Paragraph>{estimatedBill} </Paragraph>
                  </Card.Content>
                </Card>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Date</DataTable.Title>
                    <DataTable.Title>Meter Reading</DataTable.Title>
                    <DataTable.Title>Action</DataTable.Title>
                  </DataTable.Header>

                  <FlatList
                    data={data}
                    keyExtractor={({ id }, index) => id.toString()}
                    renderItem={({ item }) => (
                      <DataTable.Row>
                        <DataTable.Cell>{returnproperdate(item.Timestamp)}</DataTable.Cell>
                        <DataTable.Cell>{item.reading}</DataTable.Cell>
                        <DataTable.Cell>  <IconButton
                          icon="delete"
                          color={Colors.red500}
                          size={20}
                          onPress={() => {
                            setmeterid(item.id);
                            showDialog();
                          }}
                        /></DataTable.Cell>

                      </DataTable.Row>
                    )}
                  />
                </DataTable>
              </View>

            )}
          </View>
        )}

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Paragraph>Are you sure you want to delete it?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={deleteconfirmed}>Ok</Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start'
  },
});
