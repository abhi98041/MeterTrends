import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList } from 'react-native';
import { openDatabase } from '../shared/dbFunctions';
import { FAB, Card, Title, Paragraph,Button } from 'react-native-paper';

const db = openDatabase();


export default function Home({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
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
    }, []);

    const pressHandler = () => {
        navigation.navigate('AddMeter')
    }

    // function convercostperunittostring(costperunit){
    //     console.log("In convert function")
    //     console.log(costperunit)
    // return(toString(costperunit))
    // }
    return (
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
                                    <Button onPress={() => navigation.navigate('MeterReadingChart', item)}>View</Button>
                                    <Button onPress={() => navigation.navigate('AddMeterReadingForm', item)}>Add Reading</Button>
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