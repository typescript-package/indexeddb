import { IDBQuery } from './idb-query.class';
import { Shop, shopSchemaDB, rawSchemaDB } from './idb-data.spec';

const shopSchemaQuery = IDBQuery.create()({
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
  shopSchemaDB
  // {
  //   storesParameters: {
  //     person: {
  //       keyPath: 'id',
  //       autoIncrement: true,
  //       index: [
  //         { name: 'name', keyPath: 'name', options: { unique: false } }
  //       ]
  //     },
  //   },
  //   connection: { name: 'TestDB', version: 1 }
  // },
);

const rawSchemaQuery = IDBQuery.create(false, {
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
  // rawSchemaDB
  {
    storesParameters: {
      person: {
        keyPath: 'id',
        autoIncrement: true,
        index: [
          { name: 'name', keyPath: 'name', options: { unique: false } }
        ]
      },
    },
    connection: { name: 'TestDB', version: 1 }
  },
);

const idbQuery = new IDBQuery({
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
  rawSchemaDB
  // {
  //   storesParameters: {
  //     person: {
  //       keyPath: 'id',
  //       autoIncrement: true,
  //       index: [
  //         { name: 'name', keyPath: 'name', options: { unique: false } }
  //       ]
  //     },
  //   },
  //   connection: { name: 'TestDB', version: 1 }
  // },
);

idbQuery.store('person', {
  'add': {
    value: { name: 'Dave' },
    onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
    onerror: (ev: Event) => console.error('Add operation failed.', ev),
  }
}, {
  mode: 'readwrite',
  ondone: (done: Promise<void>) => console.log('Transaction done.', done),
  onabort(ev: Event) { console.warn('Transaction aborted.', ev); },
  oncomplete(ev: Event) { console.log('Transaction completed.', ev); },
  onerror(ev: Event) { console.error('Transaction error.', ev); },
  ontransaction(transaction: IDBTransaction) { console.log('Transaction started.', transaction); }
});

idbQuery.add({person: [{
  value: { name: 'Eve' },
  onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
  onerror: (ev: Event) => console.error('Add operation failed.', ev),
}, {
  value: { name: 'Frank' },
  onsuccess: (ev: Event) => console.log('Add operation successful.', ev),
  onerror: (ev: Event) => console.error('Add operation failed.', ev),
}]}, {
  mode: 'readwrite',
});

// idbQuery.store('person', {
//   'delete': {'query': 'Charlie', 'onsuccess': ev => console.log('Delete operation successful.', ev)}
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

// idbQuery.method('add', {
//   store1: {
//     value: { name: 'Eve' },
//     onsuccess(ev) { console.log('Eve added', this.result); },
//     onerror(ev) { console.error('Eve failed', ev); }
//   }
// });

