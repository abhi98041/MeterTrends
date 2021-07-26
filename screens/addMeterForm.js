import React from 'react';
import { StyleSheet, TextInput, Button, View, DeviceEventEmitter } from 'react-native';
import { Formik } from 'formik';
import { openDatabase } from '../shared/dbFunctions';


const db = openDatabase();


export default function AddMeterForm({ navigation }) {
  const [postRefesh, setpostRefesh] = React.useState(false);
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
        setpostRefesh(true);
        navigation.navigate({
          name: 'Home',
          params: { needRefresh: postRefesh },
          merge: true,
        });

      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.container}>
          <TextInput
            placeholder='Meter Name'
            onChangeText={handleChange('metername')}
            onBlur={handleBlur('metername')}
            value={values.metername}
            style={styles.input}
          />
          <TextInput
            placeholder='Cost Per Unit'
            onChangeText={handleChange('costperunit')}
            onBlur={handleBlur('costperunit')}
            value={values.costperunit}
            keyboardType='decimal-pad'
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
    marginTop: 10
    
  }
});
