import { IDBQuery } from '../lib';
import { rawSchemaDBwithConnection, rawSchemaDBwithParameters, Shop, shopSchemaDBWithConnection } from './readme/data';

describe('IDBQuery', () => {
  let shopSchemaQueryWithData = IDBQuery.create<Shop>()({
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

  beforeEach(() => {
    // Query providing Shop schema and data instance
    // const shopSchemaQuery: IDBQuery<IDBData<Shop, "test-db", "person" | "cart", 1>, IDBSchema, "test-db", "person", 1>
    shopSchemaQueryWithData = IDBQuery.create<Shop>()({
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
  });
 
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
});

