// Class.
import { IDBData } from './idb-data.class';
import { IDBQuery } from './idb-query.class';
// Interface & Type.
import {
  IDBConfig,
  IDBOpenStoreResult,
  IDBOpenStoresResult,
  IDBQueryTransactionOptions,
  IDBSchema,
  IDBStoreParameters,
  IDBStoreQuery,
  IDBStoresParameters,
} from '@typedly/indexeddb';
/**
 * @description
 * @export
 * @class IndexedDB
 * @template {IDBSchema} Schema 
 * @template {IDBData<Schema, DBName, StoreNames, Version>} DataInstance 
 * @template {string} [DBName=DataInstance extends IDBData<Schema, infer N, any, any> ? N : string] 
 * @template {keyof Schema & string} [StoreNames=DataInstance extends IDBData<Schema, any, infer S, any> ? S : keyof Schema & string] 
 * @template {number} [Version=DataInstance extends IDBData<Schema, any, any, infer V> ? V : number] 
 */
export class IndexedDB<
  DataInstance extends IDBData<Schema, DBName, StoreNames, Version>,
  Schema extends IDBSchema,
  DBName extends string = DataInstance extends IDBData<Schema, infer N, any, any> ? N : string,
  StoreNames extends keyof Schema & string = DataInstance extends IDBData<Schema, any, infer S, any> ? S : keyof Schema & string,
  Version extends number = DataInstance extends IDBData<Schema, any, any, infer V> ? V : number,
> {
  public static create<Schema extends IDBSchema, T extends boolean = false>() {
    return <
      DataInstance extends IDBData<Schema, DBName, StoreNames, Version>,
      DBName extends string = DataInstance extends IDBData<Schema, infer N, any, any> ? N : string,
      StoreNames extends keyof Schema & string = DataInstance extends IDBData<Schema, any, infer S, any> ? S : keyof Schema & string,
      Version extends number = DataInstance extends IDBData<Schema, any, any, infer V> ? V : number,
    >(data: T extends true ? DataInstance : { name: DBName; parameters: IDBStoresParameters<StoreNames>; version: Version }) => 
        new IndexedDB<DataInstance, Schema, DBName, StoreNames, Version>(
      data as any
    );
  }

  public static config: <
    Name extends string,
    StoreNames extends string,
    Version extends number = number
  >(config: IDBConfig<Name, StoreNames, Version>) => IDBConfig<Name, StoreNames, Version> =
    <
      Name extends string,
      DBName extends string,
      Version extends number = number
    >(config: IDBConfig<Name, DBName, Version>) => config;


  public static store: (store: IDBStoreParameters) => IDBStoreParameters =
    (store: IDBStoreParameters) => store;

  public get connection() {
    return this.#data.connection;
  }

  public get data() {
    return this.#data;
  }
  
  #data!: DataInstance;

  constructor(settings: {
    name: DBName,
    parameters: IDBStoresParameters<StoreNames>,
    version: Version
  })
  constructor(data: DataInstance)
  constructor(data: any) {
    this.#data = data instanceof IDBData ? data as DataInstance : new IDBData(
      data.parameters,
      {
        name: data.name,
        version: data.version
      } as any
    ) as DataInstance;
  }

  public async ready(
    callbackfn?: (openRequest: IDBOpenDBRequest) => void
  ): Promise<IDBOpenDBRequest> {
    return this.#data.connection.ready(callbackfn);
  }

  public async objectStores<Names extends StoreNames & string>(
    storeNames: Names[],
    {
      ondone,
      mode,
      onabort,
      oncomplete,
      onerror,
      options,
      ontransaction
    }: IDBQueryTransactionOptions = {}
  ): Promise<{ [K in Names]: IDBObjectStore }> {
    return this.#data.objectStores(storeNames, { ondone, mode, onabort, oncomplete, onerror, ontransaction, options });
  }

  public async openStore(
    name: StoreNames,
    {
      mode,
      onabort,
      oncomplete,
      onerror,
    }: Omit<IDBQueryTransactionOptions, 'ondone' | 'ontransaction' | 'options'> = {}
  ): Promise<IDBOpenStoreResult> {
    return this.#data.openStore(name, { mode, onabort, oncomplete, onerror });
  }

  public async openStores<Names extends StoreNames>(
    names: Names[],
    {
      mode,
      onabort,
      oncomplete,
      onerror,
      options
    }: IDBQueryTransactionOptions = {}
  ): Promise<IDBOpenStoresResult<Names>> {
    return this.#data.openStores(names, { ondone: undefined, mode, onabort, oncomplete, onerror, options });
  }

  public async transactStores<Names extends StoreNames & string, R>(
    names: Names[],
    {
      mode,
      onabort,
      oncomplete,
      onerror,
      options
    }: IDBQueryTransactionOptions = {},
    callbackfn: (done: Promise<void>, stores: { [K in Names]: IDBObjectStore }, transaction: IDBTransaction) => Promise<R>
  ): Promise<R> {
    return this.#data.transactStores(
      names,
      {
        mode,
        onabort,
        oncomplete,
        onerror,
        options
      },
      callbackfn
    ) as Promise<R>;
  }

  public async query(
    query?: IDBStoreQuery<NoInfer<Schema>, StoreNames>,
    options: IDBQueryTransactionOptions = {}
  ) {
    await this.#data.connection.ready();
    return new IDBQuery<DataInstance, Schema, DBName, StoreNames, Version>(query, options, this.#data);
  }
}
