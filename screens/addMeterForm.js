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
// function showItems(){
//     db.transaction((tx) => {
//         tx.executeSql(
//           `select * from meternames;`,
//           [],
//           (_, { rows: { _array } }) => console.log(_array)
//         );
//       });
// }

export default function AddMeterForm() {

    db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists metername (id integer primary key not null, name text, costperunit float);"
        );
      });
  
    const add = (value) => {
      // is text empty?
      if (value.name === null || value.name === "") {
        return false;
      }
      if(value.costperunit === null || value.costperunit === ""){
        value.costperunit=0;
      }
  
      db.transaction(
        (tx) => {
          tx.executeSql("insert into metername (name, costperunit) values (?, ?)", [value.name,value.costperunit]);
          tx.executeSql("select * from metername", [], (_, { rows }) =>
            console.log(JSON.stringify(rows))
          );
        },
        null
        
      );
    };
  

  return (
<Formik
     initialValues={{ metername: '', costperunit:'' }}
     onSubmit={values => {
        //  console.log(values);
        add(values);

    }}
   >
     {({ handleChange, handleBlur, handleSubmit, values }) => (
       <View>
         <TextInput
         placeholder='Meter Name'
           onChangeText={handleChange('metername')}
           onBlur={handleBlur('metername')}
           value={values.metername}
         />
                  <TextInput
         placeholder='Cost Per Unit'
           onChangeText={handleChange('costperunit')}
           onBlur={handleBlur('costperunit')}
           value={values.costperunit}
           keyboardType='decimal-pad'
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
