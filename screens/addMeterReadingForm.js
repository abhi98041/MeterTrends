import React, {useState} from 'react';
import { StyleSheet, TextInput,Button, View } from 'react-native';
import { Formik } from 'formik';
import { openDatabase } from '../shared/dbFunctions';
const db = openDatabase();


export default function AddMeterReadingForm({route,navigation}) {
  const [date, setDate] = useState(new Date());
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

    }}
   >
     {({ handleChange,handleBlur, handleSubmit, values }) => (
       <View style={styles.container}>
         <TextInput
         placeholder='Unit Reading'
           onChangeText={handleChange('unitreading')}
           onBlur={handleBlur('unitreading')}
           value={values.unitreading}
           keyboardType='numeric'
           style={styles.input}
         />
        
         <Button onPress={handleSubmit} title="Save" />
       </View>
     )}
   </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  input:{
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ddd',
    height: 50,
    marginBottom: 10,
    marginTop:10

  }
});
