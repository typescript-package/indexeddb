import { IDBConnection } from "../lib/idb-connection.class";

// const connection: IDBConnection<"test-db", 1>
export const connection = new IDBConnection('test-db', 1, {
  onblocked: ev => console.warn('Database open request is blocked.', ev),
  onerror: ev => console.error('Failed to open database.', ev),
  onsuccess: ev => console.log('Database opened successfully.', ev),
  onupgradeneeded: ev => console.log('Database upgrade needed.', ev)
}, false);

// // "test-db" Accessing the name property to ensure it is set correctly.
// console.log(connection.name);

// // "1" Accessing the version property to ensure it is set correctly.
// console.log(connection.version); 

// // Ready event handler to log when the database is ready.
// connection.ready(openRequest => {
//   console.log('Database is ready. Open request:', openRequest);
// }).catch(error => {
//   console.error('Failed to open database:', error);
// });

// // Opening the database connection with custom event handlers.
// connection.open({
//   onblocked: event => console.warn('Database open request is blocked.', event),
//   onerror: event => console.error('Failed to open database.', event),
//   onsuccess: event => console.log('Database opened successfully.', event),
//   onupgradeneeded: event => console.log('Database upgrade needed.', event)
// }).then(openRequest => {
//   console.log(`connection.database`, connection.database); // Accessing the database property to ensure it is undefined before the connection is opened.
//   console.log('Open request:', openRequest);
//   connection.close();
// });
