import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList } from 'react-native';

import { openDatabase } from '../shared/dbFunctions';
import { FAB, Card, Title, Paragraph,Button, IconButton, Colors, Provider,Portal,Dialog } from 'react-native-paper';

const db = openDatabase();

// let addMeter=(meter)=>{
//     meter.key=Math.random().toString();
//     setData((currentMeter)=>{
//         return[meter,...currentMeter]
//     });
// }
export default function Home({route, navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [meterid, setmeterid] = useState('');
  
  
    function showDialog() {
      // setmeterid(id);
      setVisible(true);
    }
  
  
    const hideDialog = () => setVisible(false);
  
    const deleteconfirmed = () => {
      db.transaction((tx) => {
        tx.executeSql('DELETE FROM meterreading where meterid=?;', [meterid], (tx, results) => {  
        });
        tx.executeSql('DELETE FROM metername where id=?;', [meterid], (tx, results) => {  
        });
      });
      rerenderafterdelete();
      setVisible(false);
    };



    useEffect(() => {
        console.log("<------------>")
        console.log(route.params?.needRefresh);
        if (route.params?.needRefresh) {
            rerenderafterdelete();
          }
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists metername (id integer primary key not null, name text, costperunit float);"
            );
            tx.executeSql('SELECT * FROM metername;', [], (tx, results) => {
                // console.log("Query completed");

                var len = results.rows.length;

                if (len > 0) {
                    setData(results.rows['_array']);
                    setLoading(false);
                }
                else {
                    setData([]);
                    setLoading(false);
                }
            });
        })
    },  [route.params?.needRefresh]);

    function rerenderafterdelete(){
        console.log("Ran Rerenderafter delete.")
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM metername;', [], (tx, results) => {
                // console.log("Query completed");

                var len = results.rows.length;

                if (len > 0) {
                    setData(results.rows['_array']);
                    setLoading(false);
                }
                else {
                    setData([]);
                    setLoading(false);
                }
            });
        })
    }
    const pressHandler = () => {
        navigation.navigate('AddMeter')
    }

    // function convercostperunittostring(costperunit){
    //     console.log("In convert function")
    //     console.log(costperunit)
    // return(toString(costperunit))
    // }
    return (
        <Provider>
        <View style={{ flex: 1, padding: 24 }}>
            {isLoading ? <ActivityIndicator /> : (
                <FlatList
                    data={data}
                    keyExtractor={({ id }, index) => id.toString()}
                    renderItem={({ item }) => (
                            <Card>
                                <Card.Content>
                                    <Title>{item.name}</Title>
                                    <Paragraph>{item.costperunit}</Paragraph>
                                </Card.Content>
                                <Card.Actions>
                                    <Button onPress={() => navigation.push('MeterReadingChart', item)}>View</Button>
                                    <Button onPress={() => navigation.push('AddMeterReadingForm', item)}>Add Reading</Button>
                                    <IconButton
                          icon="delete"
                          color={Colors.red500}
                          size={20}
                          onPress={() => {
                            setmeterid(item.id);
                            showDialog();
                          }}
                        />
                                </Card.Actions>
                            </Card>
                    )}
                />
            )}
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={pressHandler}
            />
        </View>
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
        </Provider>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});