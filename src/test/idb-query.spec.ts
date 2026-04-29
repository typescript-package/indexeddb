import { IDBQuery } from '../lib';
import { rawSchemaDBwithConnection, rawSchemaDBwithParameters, Shop, shopSchemaDBWithConnection } from '../test/idb-data.spec';

// Query providing Shop schema and data instance
// const shopSchemaQuery: IDBQuery<IDBData<Shop, "test-db", "person" | "cart", 1>, IDBSchema, "test-db", "person", 1>
const shopSchemaQueryWithData = IDBQuery.create()({
  'store': {
    'person': {
      'add': {
        'value': { name: 'Alice' },
      }
    }
  }
  }, {
    mode: 'readwrite',
    ondone: (done: Promise<void>) => console.log('Transaction done.', done),
    onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
    oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
    onerror(ev: Event) { console.error('Transaction error.', ev); },
    ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
  },
  shopSchemaDBWithConnection
);

// Query providing Shop schema with parameters
// const shopSchemaQuery1: IDBQuery<IDBData<Shop, "TestDB", "person", 1>, Shop, "TestDB", "person", 1>
const shopSchemaQueryWithParameters = IDBQuery.create<Shop, false>()({
  'store': {
    'person': {
      'add': {
        'value': { name: 'Alice' },
      }
    }
  }
  }, {
    mode: 'readwrite',
    ondone: (done: Promise<void>) => console.log('Transaction done.', done),
    onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
    oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
    onerror(ev: Event) { console.error('Transaction error.', ev); },
    ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
  },
  {
    parameters: {
      person: {
        keyPath: 'id',
        autoIncrement: true,
        index: [
          { name: 'name', keyPath: 'name', options: { unique: false } }
        ]
      },
    },
    name: 'TestDB',
    version: 1,
    connectionEvents: {
      'onblocked': (ev: Event) => console.warn('Connection blocked.', ev),
      'onerror': (ev: Event) => console.error('Connection error.', ev),
      'onupgradeneeded': (ev: IDBVersionChangeEvent) => console.log('Upgrade needed.', ev),
      'onsuccess': (ev: Event) => console.log('Connection successful.', ev),
    }
  },
);

// Query providing raw schema with parameters
/*
const rawSchemaQueryWithParameters: IDBQuery<IDBData<{
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
}, "test-db", "person", 1>
*/
const rawSchemaQueryWithParameters = IDBQuery.create(true, {
  person: { id: 'number', name: 'string' },
  cart: { id: 'number', items: { array: 'string' } },
})({
  'store': {
    'person': {
      'add': {
        'value': { name: 'Alice' },
      }
    }
  }
  }, {
    mode: 'readwrite',
    ondone: (done: Promise<void>) => console.log('Transaction done.', done),
    onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
    oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
    onerror(ev: Event) { console.error('Transaction error.', ev); },
    ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
  },
  rawSchemaDBwithParameters
);

// Query providing raw schema with data instance
/*
const rawSchemaQueryWithData: IDBQuery<IDBData<{
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
}, "test-db", "person", 1>
*/
const rawSchemaQueryWithData = IDBQuery.create(true, {
  person: { id: 'number', name: 'string' },
  cart: { id: 'number', items: { array: 'string' } },
})({
  'store': {
    'person': {
      'add': {
        'value': { name: 'Alice' },
      }
    }
  }
  }, {
    mode: 'readwrite',
    ondone: (done: Promise<void>) => console.log('Transaction done.', done),
    onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
    oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
    onerror(ev: Event) { console.error('Transaction error.', ev); },
    ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
  },
  rawSchemaDBwithConnection
);

// Creates a query with data instance with Shop schema
/*
const idbQuery: IDBQuery<IDBData<Shop, "test-db", "person" | "cart", 1>, {
    person: {
        name: string;
    };
}, "test-db", "person", 1>
*/
const idbQueryConstructorWithData = new IDBQuery({
  'store': {
    'person': {
      'put': {
        value: { 'name': 'Bob' },
        onsuccess: (ev: Event) => console.log('Put operation successful.', ev),
        onerror: (ev: Event) => console.error('Put operation failed.', ev),
      },
      'add': [{
        value: { name: 'Charlie' },
        onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
        onerror: (ev: Event) => console.error('Add operation failed.', ev),
      }, {
        value: { name: 'Someone' },
        onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
        onerror: (ev: Event) => console.error('Add operation failed.', ev),
      }]
    },
  }
  }, {
    mode: 'readwrite',
    ondone: (done: Promise<void>) => console.log('Transaction done.', done),
    onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
    oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
    onerror(ev: Event) { console.error('Transaction error.', ev); },
    ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
  },
  shopSchemaDBWithConnection
);

// Creates a query with parameters
/*
const idbQueryConstructorWithParameters: IDBQuery<IDBData<Shop, "TestDB", "person", 1>, Shop, "TestDB", "person", 1>
*/
const idbQueryConstructorWithParameters = new IDBQuery({
  'store': {
    'person': {
      'put': {
        value: { 'name': 'Bob' },
        onsuccess: (ev: Event) => console.log('Put operation successful.', ev),
        onerror: (ev: Event) => console.error('Put operation failed.', ev),
      },
      'add': [{
        value: { name: 'Charlie' },
        onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
        onerror: (ev: Event) => console.error('Add operation failed.', ev),
      }, {
        value: { name: 'Someone' },
        onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
        onerror: (ev: Event) => console.error('Add operation failed.', ev),
      }]
    },
  }
  }, {
    mode: 'readwrite',
    ondone: (done: Promise<void>) => console.log('Transaction done.', done),
    onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
    oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
    onerror(ev: Event) { console.error('Transaction error.', ev); },
    ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
  },
  {
    parameters: {
      person: {
        keyPath: 'id',
        autoIncrement: true,
        index: [
          { name: 'name', keyPath: 'name', options: { unique: false } }
        ]
      },
    },
    connection: { name: 'TestDB', version: 1 },
    schema: {
      person: { id: 'number', name: 'string' },
      cart: { id: 'number', items: { array: 'string' } },
    } as unknown as Shop
  },
);


// idbQuery.store('person', {
//   'add': {
//     value: { name: 'Dave' },
//     onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
//     onerror: (ev: Event) => console.error('Add operation failed.', ev),
//   }
// }, {
//   mode: 'readwrite',
//   ondone: (done: Promise<void>) => console.log('Transaction done.', done),
//   onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
//   oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
//   onerror(ev: Event) { console.error('Transaction error.', ev); },
//   ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
// });

// idbQuery.add({person: [{
//   value: { name: 'Eve' },
//   onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
//   onerror: (ev: Event) => console.error('Add operation failed.', ev),
// }, {
//   value: { name: 'Frank' },
//   onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
//   onerror: (ev: Event) => console.error('Add operation failed.', ev),
// }]}, {
//   mode: 'readwrite',
// });

// idbQuery.store('person', {
//   add: [
//     {
//       value: { name: 'Dave' },
//       onsuccess(ev) { console.log('Dave added', this.result); },
//       onerror(ev) { console.error('Dave failed', ev); }
//     },
//     {
//       value: { name: 'Michael' },
//       onsuccess(ev) { console.log('Michael added', this.result); },
//       onerror(ev) { console.error('Michael failed', ev); }
//     }
//   ],
//   clear: {
//     onsuccess(ev) { console.log('Store cleared', ev); }
//   },
//   count: {
//     query: IDBKeyRange.bound(2, 4),
//     onsuccess(ev) { console.log('Counted records with id between 2 and 4', this.result); }
//   },
//   delete: {
//     query: 3,
//     onsuccess(ev) { console.log('Deleted record with id 3', ev); }
//   },
//   put: {
//     value: { name: 'Updated Name' },
//     onsuccess(ev) { console.log('Updated record with id 2', ev); },
//     onerror(ev) { console.error('Failed to update record with id 2', ev); }
//   },
//   get: {

//     query: 2,
//     onsuccess(ev) { console.log('Got record with id 2', this.result); }
//   },
//   getAll: {
//     query: IDBKeyRange.lowerBound(2),
//     count: 2,
//     onsuccess(ev) { console.log('Got records with id >= 2 (max 2)', this.result); } 
//   }
// });

