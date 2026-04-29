import { rawSchemaDBwithConnection, Shop, shopSchemaDBWithConnection, } from "./idb-data.spec";
import { IndexedDB } from "../lib/indexeddb.class";

// Adding with Shop schema and parameters.
// const indexedDBWithShopAndParameters: IndexedDB<IDBData<Shop, "test-db", "person" | "cart", 1>, Shop, "test-db", "person" | "cart", 1>
const indexedDBWithShopAndParameters = IndexedDB.create<Shop, false>()({
  'name': 'test-db',
  'version': 1,
  'parameters': {
    'person': {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    },
    'cart': {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'items', keyPath: 'items', options: { unique: false } }
      ]
    },
  },
  'connectionEvents': {
    onblocked: ev => console.warn('Database open request is blocked.', ev),
    onerror: ev => console.error('Failed to open database.', ev),
    onsuccess: ev => console.log('Database opened successfully.', ev),
    onupgradeneeded: ev => console.log('Database upgrade needed.', ev)
  }
});

// Adding with Shop schema and data instance.
// const indexedDBWithShopAndData: IndexedDB<IDBData<Shop, "test-db", "person" | "cart", 1>, Shop, "test-db", "person" | "cart", 1>
const indexedDBWithShopAndData = IndexedDB.create<Shop, true>()(shopSchemaDBWithConnection);




// Adding with raw schema and parameters.
/*
const schemaIndexedDB3: IndexedDB<IDBData<{
    person: {
        id: number;
        name: string;
    };
    cart: {
        id: number;
        items: string[];
    };
}, "test-db", "person" | "cart", 1>, {
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
const schemaIndexedDB3 = IndexedDB.create(false, {
  person: { id: 'number', name: 'string' },
  cart: { id: 'number', items: { array: 'string' } },
})({
  'name': 'test-db',
  'version': 1,
  'parameters': {
    'person': {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    },
    'cart': {
      keyPath: 'id',
      autoIncrement: true,
      index: [
        { name: 'items', keyPath: 'items', options: { unique: false } }
      ]
    },
  }
});

// Adding with raw schema and data instance.
/*
const schemaIndexedDB4: IndexedDB<IDBData<{
    person: {
        id: number;
        name: string;
    };
    cart: {
        id: number;
        items: string[];
    };
}, "test-db", "person" | "cart", 1>, {
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
const schemaIndexedDB4 = IndexedDB.create(true, {
  person: { id: 'number', name: 'string' },
  cart: { id: 'number', items: { array: 'string' } },
})(rawSchemaDBwithConnection);

// Creating with only parameters via constructor.
// const indexedDB: IndexedDB<IDBData<IDBSchema, "testDB", "store1" | "store2", 1>, IDBSchema, "testDB", "store1" | "store2", 1>
const indexedDBWithParameters = new IndexedDB({
  name: 'testDB',
  version: 1,
  parameters: {
    store1: {
      keyPath: 'id',
      autoIncrement: true,
    },
    store2: {
      keyPath: 'id',
      autoIncrement: true,
    },
  },
});


// Creating with only parameters via constructor.
// const indexedDBWithData: IndexedDB<IDBData<Shop, "test-db", "person" | "cart", 1>, IDBSchema, "test-db", "person" | "cart", 1>
const indexedDBWithData = new IndexedDB(shopSchemaDBWithConnection);

// indexedDB.openStore('store1', {'mode': 'readwrite'}).then(({ done, store, transaction }) => {
//   console.log('Store opened:', store);
//   // Use the store and transaction here.
//   done.then(() => console.log('Transaction completed.'));
//   store.add({ name: 'Alice' });
//   transaction.oncomplete = () => console.log('Transaction completed successfully.');
// });

// indexedDB.openStores(['store1'], {'mode': 'readwrite'}).then(({ done, stores, transaction }) => {
//   console.log('Stores opened:', stores);
//   // Use the stores and transaction here.
//   done.then(() => console.log('Transaction completed.'));
//   stores['store1'].add({ name: 'Bob' });
//   transaction.oncomplete = () => console.log('Transaction completed successfully.');
// });

// indexedDB.query({
//   'store': {
//     'store1': {
//       'add': {
//         value: { name: 'Alice' },
//         onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
//         onerror: (ev: Event) => console.error('Add operation failed.', ev),
//       }
//     }
//   }
// });
