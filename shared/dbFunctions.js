import * as SQLite from 'expo-sqlite';
// SQLite.enablePromise(true);

export function openDatabase() {
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