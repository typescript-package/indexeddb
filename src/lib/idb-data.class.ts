// Class.
import { IDBConnection } from './idb-connection.class';
// Interface.
import type {
  IDBOpenStoreResult,
  IDBOpenStoresResult,
  IDBOpenTransactionResult,
  IDBQueryTransactionOptions,
  IDBStoreParameters,
  IDBTransactionEvents,
} from '@typedly/indexeddb';
// Type.
import type { IDBStoresParameters, IDBSchema, IDBConnectionSettings } from '@typedly/indexeddb';
import type { SchemaRecordToType, SchemaToType } from '@typedly/schema';
import { Schema } from './schema.class';
/**
 * @description Class with opened connection (IDBConnection), to handle transaction and store.
 * @export
 * @class IDBData
 * @template {IDBSchema} S 
 * @template {string} [DBName=string] 
 * @template {keyof S & string} [StoreNames=keyof S & string] 
 * @template {number} [Version=number] 
 */
export class IDBData<
  S extends RawSchema extends IDBSchema ? SchemaRecordToType<RawSchema> : IDBSchema,
  DBName extends string = string,
  StoreNames extends keyof S & string = keyof S & string,
  Version extends number = number,
  const RawSchema extends IDBSchema | undefined = undefined,
> {
  public static create<const RawSchema extends IDBSchema, T extends boolean = false>(
    dataType: T,
    _schema: RawSchema
  ): <
    DBName extends string,
    Schema extends SchemaRecordToType<RawSchema> = SchemaRecordToType<RawSchema>,
    StoreNames extends keyof Schema & string = keyof Schema & string,
    Version extends number = number
  >(
    storesParameters: IDBStoresParameters<StoreNames>,
    connection: T extends true
      ? IDBConnection<DBName, Version>
      : IDBConnectionSettings<DBName, Version>,
    schema?: Schema
  ) => IDBData<Schema, DBName, StoreNames, Version>;

  public static create<Schema extends IDBSchema, T extends boolean = false>(): <
    DBName extends string,
    StoreNames extends keyof Schema & string = keyof Schema & string,
    Version extends number = number
  >(
    storesParameters: IDBStoresParameters<StoreNames>,
    connection: T extends true
      ? IDBConnection<DBName, Version>
      : IDBConnectionSettings<DBName, Version>,
    schema?: Schema
  ) => IDBData<Schema, DBName, StoreNames, Version>;

  public static create(schema?: IDBSchema) {
    return (storesParameters: any, connection: any, schema?: any) =>
      new IDBData(storesParameters, connection, schema);
  }

  public static createStore<
    StoreName extends string
  >(
    db: IDBDatabase,
    name: StoreName,
    parameters: IDBStoreParameters,
  ) {
    if (db) {
      const objectStore = db.createObjectStore(name, parameters);
      parameters.index?.forEach(index => 
        objectStore.createIndex(index.name, index.keyPath, index.options)
      );
    }
    return this;
  }

  public static createStores<StoreNames extends string>(
    db: IDBDatabase,
    parameters: IDBStoresParameters<StoreNames>,
  ) {
    return db && Object.keys(parameters).forEach(
      name => IDBData.createStore(db, name, parameters[name as StoreNames])
    ), this;
  }

  /**
   * @description
   * @public
   * @readonly
   * @type {IDBConnection<DBName, Version>}
   */
  public get connection() {
    return this.#connection;
  }

  /**
   * @description
   * @public
   * @readonly
   * @type {S}
   */
  public get schema() {
    return this.#schema;
  }

  /**
   * @description
   * @public
   * @readonly
   * @type {IDBStoresParameters<StoreNames>}
   */
  public get storesParameters() {
    return this.#storesParameters;
  }

  /**
   * @description
   * @type {!IDBConnection<DBName, Version>}
   */
  #connection!: IDBConnection<DBName, Version>;

  /**
   * @description
   * @type {?IDBSchema}
   */
  #schema?: RawSchema extends IDBSchema ? Schema<RawSchema> : undefined;

  /**
   * @description
   * @type {IDBStoresParameters<StoreNames>}
   */
  #storesParameters: IDBStoresParameters<StoreNames>;

  /**
   * @description Constructor to create IDBData instance with opened connection and store parameters.
   * The connection is created with the given name and version, and the stores are created in the onupgradeneeded event of the connection.
   * The stores parameters are stored in the instance for later use when creating transactions.  
   * @param name 
   * @param version 
   */
  constructor(
    storesParameters: IDBStoresParameters<StoreNames>,
    connection: IDBConnectionSettings<DBName, Version>,
    schema?: {
      raw?: RawSchema,
      schema?: S
    }
  )
  constructor(
    storesParameters: IDBStoresParameters<StoreNames>,
    connection: IDBConnection<DBName, Version>,
    schema?: {
      raw?: RawSchema,
      schema?: S
    }
  )
  constructor(
    storesParameters: IDBStoresParameters<StoreNames>,
    connection: any,
    schema?: {
      raw?: RawSchema,
      schema?: S
    }
  ) {
    this.#connection = connection instanceof IDBConnection
      ? connection
      : new IDBConnection(
        connection.name!,
        connection.version ?? 1 as Version, { 
          onupgradeneeded: event =>
            IDBData.createStores(this.#connection.database!, storesParameters)
        }
      );
    connection instanceof IDBConnection && this.#connection.open({
      onupgradeneeded: event => IDBData.createStores(this.#connection.database!, storesParameters),
    });
    this.#storesParameters = storesParameters;
    this.#schema = schema?.raw ? new Schema(schema.raw as RawSchema & IDBSchema) as any : undefined;
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
    const {stores} = await this.openStores(storeNames, {mode, ondone, onabort, oncomplete, onerror, ontransaction, options});
    return stores;
  }

  public async openStore<StoreName extends StoreNames & string>(
    storeName: StoreName,
    {
      mode,
      onabort,
      oncomplete,
      onerror
    }: Omit<IDBQueryTransactionOptions, 'ondone' | 'ontransaction' | 'options'> = {}
  ): Promise<IDBOpenStoreResult> {
    const {done, transaction} = await this.openTransaction(
      storeName,
      { oncomplete, onabort, onerror, mode }
    );
    return {done, store: transaction.objectStore(storeName), transaction};
  }

  public async openStores<Names extends StoreNames & string>(
    storeNames: Names[],
    {
      mode,
      // Transaction events
      onabort,
      oncomplete,
      onerror,
      // Custom transaction options
      ondone,
      ontransaction,
      // Transaction options
      options,
    }: IDBQueryTransactionOptions = {}
  ): Promise<IDBOpenStoresResult<Names>> {
    const {transaction, done} = await this.openTransaction(
      storeNames as any,
      { oncomplete, onabort, onerror, mode, options }
    );
    if (!transaction) throw new Error('Transaction not created');
    const stores = {} as { [K in Names]: IDBObjectStore };
    storeNames.map(name => stores[name] = transaction.objectStore(name));
    ontransaction?.(transaction);
    typeof ondone === 'function' && done.then(() => ondone(done));
    return {done, stores, transaction};
  }

  public async openTransaction(
    storeNames: StoreNames | StoreNames[],
    {
      mode = "readonly",
      onabort,
      oncomplete,
      onerror,
      options
    }: Omit<IDBQueryTransactionOptions, 'ondone' | 'ontransaction'> = {},
  ): Promise<IDBOpenTransactionResult> {
    // Create transaction.
    const transaction = await this.transaction(storeNames, { mode, options });
    const {done} = this.#doneTransaction(
      transaction,
      { onabort, oncomplete, onerror }
    );
    return { done, transaction };
  }

  public async transaction(
    storeNames: StoreNames | StoreNames[],
    {
      mode = "readonly",
      options
    }: { mode?: IDBTransactionMode, options?: IDBTransactionOptions } = {},
  ): Promise<IDBTransaction> {
    // Wait for connection to be ready.
    await this.#connection.ready();
    const database = this.#connection.database;
    if (!database) throw new Error('Database not opened');
    return database.transaction(
      storeNames as string | string[],
      mode,
      options
    );
  }

  public async transactStores<Names extends StoreNames & string, R>(
    storeNames: Names[],
    {
      mode,
      // Transaction events
      onabort,
      oncomplete,
      onerror,
      // Custom transaction options
      ondone,
      ontransaction,
      // Transaction options
      options,
    }: IDBQueryTransactionOptions = {},
    callbackfn: (done: Promise<void>, stores: { [K in Names]: IDBObjectStore }, transaction: IDBTransaction) => Promise<R>
  ): Promise<R> {
    const { stores, transaction, done } = await this.openStores(storeNames, { mode, onabort, oncomplete, onerror, ondone, ontransaction, options });
    const result = await callbackfn(done, stores, transaction);
    await done;
    return result;
  }

  #doneTransaction(
    transaction: IDBTransaction,
    { onabort, oncomplete, onerror }: IDBTransactionEvents
  ): IDBOpenTransactionResult {
    const done = new Promise<void>((resolve, reject) => (
      transaction.addEventListener(
        'complete',
        event => (oncomplete?.call(transaction, event), resolve()),
        { once: true }
      ),
      transaction.addEventListener(
        'error',
        event => (onerror?.call(transaction, event), reject(transaction.error ?? new Error("transaction error"))),
        { once: true },
      ),
      transaction.addEventListener(
        'abort',
        event => (onabort?.call(transaction, event), reject(transaction.error ?? new Error("transaction aborted"))),
        { once: true }
      )
    ));
    return {done, transaction};
  }
}
