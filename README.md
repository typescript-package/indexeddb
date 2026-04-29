
<a href="https://www.typescriptlang.org/">
  <img
    src="https://avatars.githubusercontent.com/u/189666396?s=150&u=9d55b1eb4ce258974ead76bf07ccf49ef0eb0ea7&v=4"
    title="typescript-package/indexeddb - A TypeScript wrapper for IndexedDB client-side storage."
  />
</a>

## typescript-package/indexeddb

<!-- npm badge -->
[![npm version][typescript-package-npm-badge-svg]][typescript-package-npm-badge]
[![GitHub issues][typescript-package-badge-issues]][typescript-package-issues]
[![GitHub license][typescript-package-badge-license]][typescript-package-license]

A **TypeScript** wrapper for IndexedDB client-side storage.

## Table of contents

- [Installation](#installation)
- [Api](#api)
  - Abstract
    - `DBConnection`
  - Class
    - `IDBConnection`
    - `IDBData`
    - `IDBQuery`
    - `IndexedDB`
- [Contributing](#contributing)
- [Support](#support)
- [Code of Conduct](#code-of-conduct)
- [Git](#git)
  - [Commit](#commit)
  - [Versioning](#versioning)
- [License](#license)

## Installation

```bash
npm install @typescript-package/indexeddb --save-peer
```

## Api

```typescript
import {
  // Abstract.
  DBConnection,
  // Class.
  IDBConnection,
  IDBData,
  IDBQuery,
  IndexedDB,
} from '@typescript-package/indexeddb';
```

### `IDBConnection`

```typescript
// connection.ts
import { IDBConnection } from '@typescript-package/indexeddb';

// const connection: IDBConnection<"test-db", 1>
export const connection = new IDBConnection(
  'test-db', // database name
  1, // database version
  {
    onblocked: ev => console.warn('Database open request is blocked.', ev),
    onerror: ev => console.error('Failed to open database.', ev),
    onsuccess: ev => console.log('Database opened successfully.', ev),
    onupgradeneeded: ev => console.log('Database upgrade needed.', ev)
  },
  false // do not open automatically
);

// "test-db" Accessing the name property to ensure it is set correctly.
console.log(connection.name);

// "1" Accessing the version property to ensure it is set correctly.
console.log(connection.version);

// Ready event handler to log when the database is ready.
connection.ready(openRequest => {
  console.log('Database is ready. Open request:', openRequest);
}).catch(error => {
  console.error('Failed to open database:', error);
});

// Opening the database connection with custom event handlers.
connection.open({
  onblocked: event => console.warn('Database open request is blocked.', event),
  onerror: event => console.error('Failed to open database.', event),
  onsuccess: event => console.log('Database opened successfully.', event),
  onupgradeneeded: event => console.log('Database upgrade needed.', event)
}).then(openRequest => {
  console.log(`connection.database`, connection.database); // Accessing the database property to ensure it is undefined before the connection is opened.
  console.log('Open request:', openRequest);
  connection.close();
});
```

### `IDBData`

```typescript
// data.ts
import { IDBData } from '@typescript-package/indexeddb';
import { connection } from './connection.ts';

export type Shop = {
  person: { id: number; name: string };
  cart: { id: number; items: string[] };
};

export type Shop = {
  person: { id: number; name: string };
  cart: { id: number; items: string[] };
};

export const shopSchemaDBWithConnection = IDBData.create<Shop>()({
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

// Log the initialized database instance and its properties to verify correct initialization.
console.log('shopSchemaDB', shopSchemaDBWithConnection);
// Accessing the connection property to ensure it is set correctly.
console.log(`shopSchemaDB.connection`, shopSchemaDBWithConnection.connection);
// Accessing the storesParameters property to ensure it is set correctly.
console.log(`shopSchemaDB.storesParameters`, shopSchemaDBWithConnection.storesParameters);

// Initialize the database with schema and connection parameters.
export const shopSchemaDBwithParameters = IDBData.create<Shop>()({
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

// Initialize the database with schema and connection parameters.
export const shopSchemaDBwithParameters = IDBData.create<Shop>()({
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

// Initialize the database with raw schema and connection parameters.
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
```

### `IDBQuery`

```typescript
// query.ts
import { IDBQuery } from '@typescript-package/indexeddb';
import { shopSchemaDBWithConnection, rawSchemaDBwithParameters, Shop } from './data.ts';

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
const rawSchemaQuery: IDBQuery<IDBData<{
    person: {
        id: number;
        name: string;
    };
    cart: {
        id: number;
        items: string[];
    };
}, "TestDB", "person", 1>, {
    person: {
        id: number;
        name: string;
    };
    cart: {
        id: number;
        items: string[];
    };
}, "TestDB", "person", 1>
*/
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
```

### `IndexedDB`

```typescript
// indexeddb.ts
import { IndexedDB } from '@typescript-package/indexeddb';
import { shopSchemaDBWithConnection, rawSchemaDBwithParameters } from './data.ts';

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

```

## Contributing

Your contributions are valued! If you'd like to contribute, please feel free to submit a pull request. Help is always appreciated.

## Support

If you find this package useful and would like to support its and general development, you can contribute through one of the following payment methods. Your support helps maintain the packages and continue adding new.

Support via:

- [Stripe](https://donate.stripe.com/dR614hfDZcJE3wAcMM)
- [Revolut](https://checkout.revolut.com/pay/048b10a3-0e10-42c8-a917-e3e9cb4c8e29)
- [GitHub](https://github.com/sponsors/angular-package/sponsorships?sponsor=sciborrudnicki&tier_id=83618)
- [DonorBox](https://donorbox.org/become-a-sponsor-to-the-angular-package?default_interval=o)
- [Patreon](https://www.patreon.com/checkout/angularpackage?rid=0&fan_landing=true&view_as=public)

or via Trust Wallet

- [XLM](https://link.trustwallet.com/send?coin=148&address=GAFFFB7H3LG42O6JA63FJDRK4PP4JCNEOPHLGLLFH625X2KFYQ4UYVM4)
- [USDT (BEP20)](https://link.trustwallet.com/send?coin=20000714&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94&token_id=0x55d398326f99059fF775485246999027B3197955)
- [ETH](https://link.trustwallet.com/send?coin=60&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94)
- [BTC](https://link.trustwallet.com/send?coin=0&address=bc1qnf709336tfl57ta5mfkf4t9fndhx7agxvv9svn)
- [BNB](https://link.trustwallet.com/send?coin=20000714&address=0xA0c22A2bc7E37C1d5992dFDFFeD5E6f9298E1b94)

## Code of Conduct

By participating in this project, you agree to follow **[Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)**.

## GIT

### Commit

- [AngularJS Git Commit Message Conventions][git-commit-angular]
- [Karma Git Commit Msg][git-commit-karma]
- [Conventional Commits][git-commit-conventional]

### Versioning

[Semantic Versioning 2.0.0][git-semver]

**Given a version number MAJOR.MINOR.PATCH, increment the:**

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards-compatible manner, and
- PATCH version when you make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

**FAQ**
How should I deal with revisions in the 0.y.z initial development phase?

> The simplest thing to do is start your initial development release at 0.1.0 and then increment the minor version for each subsequent release.

How do I know when to release 1.0.0?

> If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0. If you’re worrying a lot about backwards compatibility, you should probably already be 1.0.0.

## License

MIT © typescript-package ([license][typescript-package-license])

<!-- This package: typescript-package  -->
  <!-- GitHub: badges -->
  [typescript-package-badge-issues]: https://img.shields.io/github/issues/typescript-package/indexeddb
  [typescript-package-badge-forks]: https://img.shields.io/github/forks/typescript-package/indexeddb
  [typescript-package-badge-stars]: https://img.shields.io/github/stars/typescript-package/indexeddb
  [typescript-package-badge-license]: https://img.shields.io/github/license/typescript-package/indexeddb
  <!-- GitHub: badges links -->
  [typescript-package-issues]: https://github.com/typescript-package/indexeddb/issues
  [typescript-package-forks]: https://github.com/typescript-package/indexeddb/network
  [typescript-package-license]: https://github.com/typescript-package/indexeddb/blob/master/LICENSE
  [typescript-package-stars]: https://github.com/typescript-package/indexeddb/stargazers
<!-- This package -->

<!-- Package: typescript-package -->
  <!-- npm -->
  [typescript-package-npm-badge-svg]: https://badge.fury.io/js/@typescript-package%2Findexeddb.svg
  [typescript-package-npm-badge]: https://badge.fury.io/js/@typescript-package%2Findexeddb

<!-- GIT -->
[git-semver]: http://semver.org/

<!-- GIT: commit -->
[git-commit-angular]: https://gist.github.com/stephenparish/9941e89d80e2bc58a153
[git-commit-karma]: http://karma-runner.github.io/0.10/dev/git-commit-msg.html
[git-commit-conventional]: https://www.conventionalcommits.org/en/v1.0.0/
