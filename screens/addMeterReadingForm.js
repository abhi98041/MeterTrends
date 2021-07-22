import React from 'react';
import { StyleSheet, TextInput,Button, View } from 'react-native';
import { Formik } from 'formik';
import { openDatabase } from '../shared/dbFunctions';
const db = openDatabase();


export default function AddMeterReadingForm({route,navigation}) {
  const [postRefesh, setpostRefesh] = React.useState(false);
  const {id}=route.params;
  console.log(id);
  // console.log( route.params('id'));
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
  
      db.transaction(
        (tx) => {
          tx.executeSql("insert into meterreading (meterid, reading) values (?, ?)", [id,value.unitreading]);
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
         console.log(values);
        add(values);
        setpostRefesh(true);
        navigation.navigate({
          name: 'Home',
          params: { needRefresh: postRefesh },
          merge: true,
        });
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
