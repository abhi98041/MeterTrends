import React from 'react';
import { StyleSheet, TextInput, Button, View, DeviceEventEmitter } from 'react-native';
import { Formik } from 'formik';
import { openDatabase } from '../shared/dbFunctions';


const db = openDatabase();


export default function AddMeterForm({ addMeter, navigation }) {
  // let { addMeter } = route.params;
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists metername (id integer primary key not null, name text, costperunit float);"
    );
  });

  const add = (value) => {
    // is text empty?
    if (value.metername === null || value.metername === "") {
      return false;
    }
    if (value.costperunit === null || value.costperunit === "") {
      value.costperunit = 0;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into metername (name, costperunit) values (?, ?)", [value.metername, value.costperunit]);
        tx.executeSql("select * from metername", [], (_, { rows }) => {
          console.log(JSON.stringify(rows));
          // addMeter(rows);
        }
        );
      },
      null

    );
  };


  return (
    <Formik
      initialValues={{ metername: '', costperunit: '' }}
      onSubmit={values => {
        //  console.log(values);
        add(values);
        navigation.pop();

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
