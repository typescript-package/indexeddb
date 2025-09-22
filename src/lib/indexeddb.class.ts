// Class.
import { IDBConnection } from './idb-connection.class';
import { IDBData } from './idb-data.class';
import { IDBQuery } from './idb-query.class';
import { IDBStore } from './idb-store.class';

// Interface.
import { IDBConfig } from '../interface/idb-config.interface';

// Type.
import { IDBStoreParameters } from '../type/idb-store-parameters.type';

/**
 * 
 */
export class IndexedDB<
  StoreSchema extends object,
  Name extends string = string,
  StoreNames extends keyof StoreSchema = keyof StoreSchema,
  Version extends number = number
> {
  /**
   * 
   * @param config 
   * @returns 
   */
  public static config: <
    Name extends string,
    StoreNames extends string,
    Version extends number = number
  >(config: IDBConfig<Name, StoreNames, Version>) => IDBConfig<Name, StoreNames, Version> =
    <
      Name extends string,
      StoreName extends string,
      Version extends number = number
    >(config: IDBConfig<Name, StoreName, Version>) => config;

  /**
   * 
   * @param store 
   * @returns 
   */
  public static store: <StoreNames extends string>(store: IDBStoreParameters<StoreNames>) => IDBStoreParameters<StoreNames> =
    <StoreNames extends string>(store: IDBStoreParameters<StoreNames>) => store;

  /**
   * 
   */
  public get connection() {
    return this.#query.connection;
  }

  /**
   * 
   */
  public get store(): IDBStore<StoreSchema, Name, StoreNames, Version> {
    return this.#query.objectStore;
  }

  /**
   * 
   */
  public get query(): IDBQuery<StoreSchema, Name, StoreNames, Version> {
    return this.#query;
  }

  /**
   * 
   */
  #query!: IDBQuery<StoreSchema, Name, StoreNames, Version>;

  /**
   * 
   * @param name 
   * @param storeNames 
   * @param store 
   * @param version 
   */
  constructor(
    name: Name,
    storeNames: StoreNames | StoreNames[],
    store?: IDBStoreParameters<StoreNames>,
    version: Version = 1 as any,
  ) {
    this.#query = new IDBQuery(
      undefined,
      { name, storeNames, store, version }
    );
  }

  /**
   * 
   * @param onOpenSuccess 
   * @returns 
   */
  public onOpenSuccess(
    onOpenSuccess: (
      indexeddb: IndexedDB<StoreSchema, Name, StoreNames, Version>,
      store: IDBStore<StoreSchema, Name, StoreNames, Version>,
      database: IDBData<Name, StoreNames, Version>,
      connection: IDBConnection<Name, StoreNames, Version>,
      openRequest: IDBOpenDBRequest,
      ev: Event
    ) => any
  ): this {
    this.connection.request.addEventListener(
      'success',
      ev => onOpenSuccess(
        this,
        this.#query.objectStore,
        this.#query.objectStore.database,
        this.connection,
        this.connection.request,
        ev
      ),
      true
    );
    return this;
  }
}
