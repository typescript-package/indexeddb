import { IDBData } from "../../lib/idb-data.class";
import { connection } from "./connection";

export type Shop = {
  person: { id: number; name: string };
  cart: { id: number; items: string[] };
};

// Initialize the database with the connection instance and schema.
// const shopSchemaDBWithConnection: IDBData<Shop, "test-db", "person" | "cart", 1>
export const shopSchemaDBWithConnection = IDBData.create<Shop, true>()({
    person: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    },
    cart: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'items', keyPath: 'items', options: { unique: false } }
      ]
    },
  },
  connection
);

// // Log the initialized database instance and its properties to verify correct initialization.
// console.log('shopSchemaDB', shopSchemaDBWithConnection);
// // Accessing the connection property to ensure it is set correctly.
// console.log(`shopSchemaDB.connection`, shopSchemaDBWithConnection.connection);
// // Accessing the storesParameters property to ensure it is set correctly.
// console.log(`shopSchemaDB.storesParameters`, shopSchemaDBWithConnection.storesParameters);

// Initialize the database with schema and connection parameters.
// const shopSchemaDBwithParameters: IDBData<Shop, "test-db", "person" | "cart", 1>
export const shopSchemaDBwithParameters = IDBData.create<Shop, false>()({
    person: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    },
    cart: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'items', keyPath: 'items', options: { unique: false } }
      ]
    },
  },
  {
    'name': 'test-db',
    'version': 1,
  }
);

// Initialize the database with raw schema and connection parameters.
/*
const rawSchemaDBwithParameters: IDBData<{
    person: {
        id: number;
        name: string;
    };
    cart: {
        id: number;
        items: string[];
    };
}, "test-db", "person" | "cart", 1>
*/
export const rawSchemaDBwithParameters = IDBData.create(false, {
    person: { id: 'number', name: 'string' },
    cart: { id: 'number', items: { array: 'string' } },
  })({
    person: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    },
    cart: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'items', keyPath: 'items', options: { unique: false } }
      ]
    },
  },
  {
    'name': 'test-db',
    'version': 1,
  }
);

// Initialize the database with raw schema and connection instance.
/*
const rawSchemaDBwithConnection: IDBData<{
    person: {
        id: number;
        name: string;
    };
    cart: {
        id: number;
        items: string[];
    };
}, "test-db", "person" | "cart", 1>
*/
export const rawSchemaDBwithConnection = IDBData.create(true, {
    person: { id: 'number', name: 'string' },
    cart: { id: 'number', items: { array: 'string' } },
  })({
    person: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    },
    cart: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'items', keyPath: 'items', options: { unique: false } }
      ]
    },
  },
  connection
);

// rawSchemaDBwithParameters.openStore('person').then(result => {
//   console.log('Store opened:', result);
// }).catch(error => {
//   console.error('Error opening store:', error);
// });

// rawSchemaDBwithParameters.openStores(['person']).then(result => {
//   console.log('Stores opened:', result);
// }).catch(error => {
//   console.error('Error opening stores:', error);
// });

// rawSchemaDBwithParameters.openTransaction('person').then(result => {
//   console.log('Transaction opened:', result);
// }).catch(error => {
//   console.error('Error opening transaction:', error);
// });

// rawSchemaDBwithParameters.transaction('person').then(transaction => {
//   console.log('Transaction created:', transaction);
// }).catch(error => {
//   console.error('Error creating transaction:', error);
// });

// rawSchemaDBwithParameters.transactStores(['person'], {}, async (done, stores, transaction) => {
  
// }).catch(error => {
//   console.error('Error in transactStores:', error);
// });

const idbData = new IDBData({
    person: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    },
    cart: {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'items', keyPath: 'items', options: { unique: false } }
      ]
    }
  },
  {
    name: 'test-db',
    version: 1,
  },
  {
    schema: {} as Shop
  }
  // {
  //   raw:{
  //     person: { id: 'number', name: 'string' },
  //     cart: { id: 'number', items: { array: 'string' } },
  //   } // as unknown as Shop
  // }
);
