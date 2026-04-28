// Class.
import { SchemaRecordToType } from '@typedly/schema';
import { IDBData } from './idb-data.class';
// Interface & Type.
import type {
  IDBQueryMethodToStore,
  IDBQueryStoreToMethod,
  IDBQueryTransactionOptions,
  IDBRangeBound,
  IDBSchema,
  IDBStoreQuery,
  IDBStoresParameters,
} from '@typedly/indexeddb';
/**
 * @description
 * @export
 * @class IDBQuery
 * @template {IDBSchema} Schema 
 * @template {IDBData<Schema, DBName, StoreNames, Version>} DataInstance 
 * @template {string} [DBName=DataInstance extends IDBData<Schema, infer N, any, any> ? N : string] 
 * @template {keyof Schema & string} [StoreNames=DataInstance extends IDBData<Schema, any, infer S, any> ? S : keyof Schema & string] 
 * @template {number} [Version=DataInstance extends IDBData<Schema, any, any, infer V> ? V : number] 
 */
export class IDBQuery<
  DataInstance extends IDBData<Schema, DBName, StoreNames, Version>,
  Schema extends IDBSchema = DataInstance extends IDBData<infer S, any, any, any> ? S : IDBSchema,
  DBName extends string = DataInstance extends IDBData<Schema, infer N, any, any> ? N : string,
  StoreNames extends keyof Schema & string = DataInstance extends IDBData<Schema, any, infer S, any> ? S : keyof Schema & string,
  Version extends number = DataInstance extends IDBData<Schema, any, any, infer V> ? V : number
> {
  public static create<Schema extends IDBSchema, DataType extends boolean = true>(
    dataType?: DataType,
  ): <
      DataInstance extends IDBData<Schema, DBName, StoreNames, Version>,
      DBName extends string = DataInstance extends IDBData<Schema, infer N, any, any> ? N : string,
      StoreNames extends keyof Schema & string = DataInstance extends IDBData<Schema, any, infer S, any> ? S : keyof Schema & string,
      Version extends number = DataInstance extends IDBData<Schema, any, any, infer V> ? V : number
    >(
      query?: IDBStoreQuery<Schema, StoreNames>,
      options?: IDBQueryTransactionOptions,
      data?: DataType extends true ? DataInstance : {
        storesParameters: IDBStoresParameters<StoreNames>,
        connection: {
          name: DBName,
          version: Version,
        }
      },
    ) => IDBQuery<DataInstance, Schema, DBName, StoreNames, Version>;

  public static create<const RawSchema extends IDBSchema, DataType extends boolean = true>(
    dataType?: DataType,
    _schema?: RawSchema 
  ): <
      DataInstance extends IDBData<Schema, DBName, StoreNames, Version>,
      Schema extends SchemaRecordToType<RawSchema> = SchemaRecordToType<RawSchema>,
      DBName extends string = DataInstance extends IDBData<Schema, infer N, any, any> ? N : string,
      StoreNames extends keyof Schema & string = DataInstance extends IDBData<Schema, any, infer S, any> ? S : keyof Schema & string,
      Version extends number = DataInstance extends IDBData<Schema, any, any, infer V> ? V : number
    >(
      query?: IDBStoreQuery<Schema, StoreNames>,
      options?: IDBQueryTransactionOptions,
      data?: DataType extends true ? DataInstance : {
        storesParameters: IDBStoresParameters<StoreNames>,
        connection: {
          name: DBName,
          version: Version,
        }
      },
    ) => IDBQuery<DataInstance, Schema, DBName, StoreNames, Version>;

  public static create(dataType?: boolean, schema?: any) {
    return (query: any, options: any, data: any) =>
      new IDBQuery(query, options, data);
  }

  public get connection() {
    return this.#data.connection;
  }
  public get data() {
    return this.#data;
  }

  public static range(
    range: IDBRangeBound
  ): IDBKeyRange {
    if (Array.isArray(range)) {
      return IDBKeyRange.bound(...range);
    } else if (range.only) {
      return IDBKeyRange.only(range);
    } else {
      if (range.lower && !range.upper) {
        return IDBKeyRange.lowerBound(range.lower);
      }
      if (range.upper && !range.lower) {
        return IDBKeyRange.upperBound(range.upper);
      }
      return IDBKeyRange.bound(
        range?.lower,
        range?.upper,
        range?.lowerOpen,
        range?.upperOpen
      );
    }
  }
  #data: DataInstance;

  constructor(
    query?: IDBStoreQuery<NoInfer<Schema>, StoreNames>,
    options?: IDBQueryTransactionOptions,
    data?: {
      storesParameters: IDBStoresParameters<StoreNames>,
      connection: {
        name: DBName,
        version: Version,
      }
    },
  )
  constructor(
    query?: IDBStoreQuery<NoInfer<Schema>, StoreNames>,
    options?: IDBQueryTransactionOptions,
    data?: DataInstance,
  )
  constructor(
    query?: IDBStoreQuery<NoInfer<Schema>, StoreNames>,
    options: IDBQueryTransactionOptions = {},
    data?: any,
  ) {
    this.#data = (data instanceof IDBData
      ? data
      : new IDBData(
        data?.storesParameters || {} as IDBStoresParameters<StoreNames>,
        data?.connection || {} as { name: DBName, version: Version }
      )) as DataInstance;

    query?.store && this.#queryByStore(query.store, options);
    query?.method && this.#queryByMethod(query.method, options);
  }

  async store<StoreName extends StoreNames>(
    name: StoreName,
    query: IDBQueryStoreToMethod<NoInfer<Schema>, StoreName>[StoreName],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByStore(
      { [name]: query } as IDBQueryStoreToMethod<Schema, StoreName, StoreNames>,
      options
    );
  }

  async add<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['add'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['add']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async clear<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['clear'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['clear']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async count<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['count'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['count']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async delete<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['delete'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['delete']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async get<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['get'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['get']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async getAll<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['getAll'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['getAll']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async index<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['index'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['index']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async method<
    StoreName extends StoreNames,
    MethodName extends keyof IDBQueryMethodToStore<Schema, StoreName>
  >(
    name: MethodName,
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>[MethodName],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { [name]: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async openCursor<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['openCursor'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['openCursor']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async put<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>['put'],
    options: IDBQueryTransactionOptions = {}
  ) {
    return this.#queryByMethod(
      { ['put']: query } as IDBQueryMethodToStore<Schema, StoreName>,
      options
    );
  }

  async #dispatch<StoreName extends StoreNames>(
    store: IDBObjectStore,
    operations: IDBQueryStoreToMethod<NoInfer<Schema>, StoreName, StoreNames>[StoreName]
  ) {
    for(const operationName in operations) {
      switch(operationName) {
        case 'add': for (const item of this.#toArray(operations.add)) this.#bind(store.add(item.value, item.key), item); break;
        case 'put': for (const item of this.#toArray(operations.put)) this.#bind(store.put(item.value, item.key), item); break;
        case 'clear': for (const item of this.#toArray(operations.clear)) this.#bind(store.clear(), item); break;
        case 'count': for (const item of this.#toArray(operations.count)) this.#bind(store.count(item.query), item); break;
        case 'delete': for (const item of this.#toArray(operations.delete)) this.#bind(store.delete(item.query), item); break;
        case 'get': for (const item of this.#toArray(operations.get)) this.#bind(store.get(item.query), item); break;
        case 'getAll': for (const item of this.#toArray(operations.getAll)) this.#bind(store.getAll(item.query, item.count), item); break;
        case 'getKey': for (const item of this.#toArray(operations.getKey)) this.#bind(store.getKey(item.query), item); break;
        case 'getAllKeys': for (const item of this.#toArray(operations.getAllKeys)) this.#bind(store.getAllKeys(item.query, item.count), item); break;
        case 'index': for (const item of this.#toArray(operations.index)) store.index(item.name); break;
        case 'openCursor': for (const item of this.#toArray(operations.openCursor)) this.#bind(store.openCursor(item.query, item.direction), item); break;
        case 'openKeyCursor': for (const item of this.#toArray(operations.openKeyCursor)) this.#bind(store.openKeyCursor(item.query, item.direction), item); break;
      }
    }
  }

  async #queryByMethod<StoreName extends StoreNames>(
    query: IDBQueryMethodToStore<NoInfer<Schema>, StoreName>,
    options: IDBQueryTransactionOptions = {}
  ) {
    // collect all referenced stores across methods
    const storeSet = new Set<StoreName>();

    for (const methodName in query) {
      const byStore = query[methodName as keyof typeof query];
      if (!byStore) continue;

      for (const storeName in byStore) storeSet.add(storeName as StoreName);
    }

    const storeNames = [...storeSet];
    const { done, stores, transaction } = await this.#data.openStores(storeNames, options);

    // preserve method declaration order
    for (const methodName in query) {
      const byStore = query[methodName as keyof typeof query];
      if (!byStore) continue;

      // preserve store order inside this method block
      for (const storeName in byStore) {
        const typedStoreName = storeName as StoreName;
        const operations = byStore[typedStoreName];
        if (!operations) continue;

        // operations is IDBQueryStoreToMethod[...] shape for a single store
        this.#dispatch(stores[typedStoreName], {[methodName]: operations});
      }
    }
    await done;
    return { transaction, done };
  }

  async #queryByStore<StoreName extends StoreNames>(
    query: IDBQueryStoreToMethod<Schema, StoreName, StoreNames>,
    options: IDBQueryTransactionOptions = {}
  ) {
    const storeNames = Object.keys(query) as StoreName[];
    const { done, stores, transaction } = await this.#data.openStores(storeNames, options);
    for (const storeName of storeNames) this.#dispatch(stores[storeName], query[storeName]!);
    await done;
    return { transaction, done };
  }

  #bind<R>(
    request: IDBRequest<R>,
    item: { onsuccess?: (this: IDBRequest<any>, ev: Event) => any;  onerror?: (this: IDBRequest<any>, ev: Event) => any }
  ): void {
    if (item.onsuccess) request.addEventListener('success', item.onsuccess, { once: true });
    if (item.onerror) request.addEventListener('error', item.onerror, { once: true });
  };
  
  #toArray<T>(v: T | T[] | undefined): T[] {
    return v == null ? [] : Array.isArray(v) ? v : [v];
  }
}


// // RxJS.
// import { Observable, of } from 'rxjs';

// // Class.
// import { IDBStore } from './idb-store.class';

// // Type.
// import { IDBQueryMethod } from '../type/query/idb-query-method.type';
// import { IDBQueryMethod_Store } from '../type/query/idb-query-method-store.type';
// import { IDBQueryStore_Method } from '../type/query/idb-query-store-method.type';
// import { IDBRangeBound } from '../type/query/idb-range-bound.type';

// // Interface.
// import { IDBConfig } from '../interface/idb-config.interface';

/**
 * Query store with JSON, by method-store or store-method.
 */
// export class IDBQuery1<
//   StoreSchema extends object,
//   Name extends string = string,
//   StoreNames extends keyof StoreSchema = keyof StoreSchema,
//   Version extends number = number
// > {


//   /**
//    * 
//    * @param name 
//    * @param storeNames 
//    * @param store 
//    * @param version 
//    */
//   constructor(
//     query?: IDBQueryMethod_Store<StoreSchema, StoreNames>,
//     config?: IDBConfig<Name, StoreNames, Version>,
//   ) {
//     // super();
//     if (config) {
//       this.#store = new IDBStore(
//         config.name,
//         config.storeNames,
//         config.store,
//         config.version
//       );
//     }
//     query && this.method(query);
//   }


//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #add<StoreName extends StoreNames = StoreNames>({
//     storeName,
//     value,
//     key,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction.
//     transaction,

//     // Subscribe.
//     complete,
//     error,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readwrite"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['add'],
//   ): this {
//     this.#store.add(
//       storeName,
//       value,
//       key,
//       onsuccess,
//       onerror,
//       transaction,
//       complete,
//       error,
//       storeNames,
//       mode
//     );
//     return this;
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #clear<StoreName extends StoreNames>({
//     storeName,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readwrite"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['clear']
//   ): this {
//     this.#store.clear(
//       storeName,
//       onsuccess,
//       onerror,
//       transaction,
//       storeNames,
//       mode
//     );
//     return this;
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #count<StoreName extends StoreNames>({
//     storeName,
//     query,
//     key,
//     range,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readwrite"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['count']
//   ): this {
//     this.#store.count(
//       storeName,
//       query || key || range && IDBQuery.range(range),
//       onsuccess,
//       onerror,
//       transaction,
//       storeNames,
//       mode
//     );
//     return this;
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #delete<StoreName extends StoreNames>({
//     storeName,
//     query,
//     key,
//     range,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction handlers.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readwrite"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['delete']
//   ): this {
//     const deleteQuery = query || key || range && IDBQuery.range(range);
//     if (deleteQuery) {
//       this.#store.delete(
//         storeName,
//         deleteQuery,
//         onsuccess,
//         onerror,
//         transaction,
//         storeNames,
//         mode
//       );
//     }
//     return this;
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #get<StoreName extends StoreNames>({
//     storeName,
//     query,
//     key,
//     range,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readonly"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['get']
//   ): this {
//     const getQuery = query || key || range && IDBQuery.range(range);
//     if (getQuery) {
//       this.#store.get(
//         storeName,
//         getQuery,
//         onsuccess,
//         onerror,
//         transaction,
//         storeNames,
//         mode
//       );
//     }
//     return this;
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #getAll<StoreName extends StoreNames>({
//     storeName,
//     query,
//     count,
//     key,
//     range,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readonly"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['getAll']
//   ): this {
//     this.#store.getAll(
//       storeName,
//       query || key || range && IDBQuery.range(range),
//       count,
//       onsuccess,
//       onerror,
//       transaction,
//       storeNames,
//       mode
//     );
//     return this;
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #index<StoreName extends StoreNames>({
//     storeName,
//     name,

//     // Request.
//     onsuccess,

//     // Transaction handlers.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readwrite"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['index']
//   ): this {
//     this.#store.index(
//       storeName,
//       name,
//       onsuccess,
//       transaction,
//       storeNames,
//       mode
//     );
//     return this;
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #openCursor<StoreName extends StoreNames>({
//     storeName,
//     query,
//     direction,
//     key,
//     range,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readwrite"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['openCursor']
//   ): this {
//     this.#store.openCursor(
//       storeName,
//       query || key || range && IDBQuery.range(range),
//       direction,
//       onsuccess,
//       onerror,
//       transaction,
//       storeNames,
//       mode
//     );
//     return this;
//   }

//   /**
//    * 
//    * @param methodName 
//    * @param query 
//    */
//   #performMethod<
//     MethodName extends keyof IDBQueryMethod<StoreName, StoreSchema, StoreNames>,
//     StoreName extends StoreNames
//   >(
//     methodName: MethodName,
//     query: IDBQueryMethod<StoreName, StoreSchema, StoreNames>[MethodName]
//   ) {
//     switch (methodName) {
//       case 'add': this.#add(query as any); break;
//       case 'clear': this.#clear(query as any); break;
//       case 'count': this.#count(query as any) as any; break;
//       case 'delete': this.#delete(query as any); break;
//       case 'get': this.#get(query as any); break;
//       case 'getAll': this.#getAll(query as any); break;
//       case 'index': this.#index(query as any); break;
//       case 'openCursor': this.#openCursor(query as any); break;
//       case 'put': this.#put(query as any); break;
//     }
//   }

//   /**
//    * 
//    * @param param0 
//    * @returns 
//    */
//   #put<StoreName extends StoreNames>({
//     storeName,
//     value,
//     key,

//     // Request.
//     onsuccess,
//     onerror,

//     // Transaction.
//     transaction,

//     // Store.
//     storeNames = this.#store.connection.storeNames,
//     mode = "readwrite"
//   }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['put']
//   ): this {
//     this.#store.put(
//       storeName,
//       value,
//       key,
//       onsuccess,
//       onerror,
//       transaction,
//       storeNames,
//       mode
//     );
//     return this;
//   }

//   /**
//    * 
//    * @param query 
//    * @param callbackfn 
//    * @returns 
//    */
//   #queryMethod(
//     query: IDBQueryMethod_Store<StoreSchema, StoreNames>,
//     callbackfn: (method: keyof IDBQueryMethod_Store<StoreSchema, StoreNames>) => any
//   ): this {
//     (Object
//       .keys(query) as Array<keyof IDBQueryMethod_Store<StoreSchema, StoreNames>>)
//       .forEach(callbackfn);
//     return this;
//   }

//   /**
//    * 
//    * @param query 
//    * @param callbackfn 
//    * @returns 
//    */
//   #queryStore<StoreName extends StoreNames>(
//     query: IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>,
//     callbackfn: (storeName: keyof IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>) => any
//   ): this {
//     (Object
//       .keys(query) as Array<keyof IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>>)
//       .forEach(callbackfn);
//     return this;
//   }
// }
