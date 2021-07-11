import React from 'react';
import { StyleSheet, TextInput,Button, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Formik } from 'formik';
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

export default function AddMeterReadingForm() {

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
<Formik
     initialValues={{ unitreading: ''}}
     onSubmit={values => {
        //  console.log(values);
        add(values);

    }}
   >
     {({ handleChange,handleBlur, handleSubmit, values }) => (
       <View>
         <TextInput
         placeholder='Unit Reading'
           onChangeText={handleChange('unitreading')}
           onBlur={handleBlur('unitreading')}
           value={values.unitreading}
           keyboardType='numeric'
         />
               
         <Button onPress={handleSubmit} title="Save" />
       </View>
     )}
   </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
