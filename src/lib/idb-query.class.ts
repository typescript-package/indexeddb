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
  IDBSettings,  
  IDBSettingsWithConnection,
  IDBStoreQuery,
  IDBStoresParameters,
} from '@typedly/indexeddb';
import { IDBConnection } from './idb-connection.class';
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
      data?: DataType extends true ? DataInstance : IDBSettings<DBName, StoreNames, Version>,
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
      data?: DataType extends true ? DataInstance : IDBSettings<DBName, StoreNames, Version>,
    ) => IDBQuery<DataInstance, Schema, DBName, StoreNames, Version>;

  public static create(dataType?: boolean, schema?: any) {
    return (query: any, options: any, data: any) =>
      new IDBQuery(query, options, data);
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

  public get connection() {
    return this.#data.connection;
  }

  public get data() {
    return this.#data;
  }

  #data: DataInstance;

  constructor(
    query?: IDBStoreQuery<NoInfer<Schema>, StoreNames>,
    options?: IDBQueryTransactionOptions,
    settings?: IDBSettings<DBName, StoreNames, Version>
  )
  constructor(
    query?: IDBStoreQuery<NoInfer<Schema>, StoreNames>,
    options?: IDBQueryTransactionOptions,
    settings?: IDBSettingsWithConnection<DBName, StoreNames, Version>
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
        data?.connection || {} as IDBConnection<DBName, Version>
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
