// RxJS.
import { of } from 'rxjs';

// Class.
import { IDBData } from './idb-data.class';

// Type.
import { IDBRequestOnSuccess } from '../type/idb-request-on-success.type';
import { IDBRequestTransaction } from '../type/idb-request-transaction.type';
import { IDBStoreParameters } from '../type/idb-store-parameters.type';

// Interface.
import { IDBStoreInterface } from '../interface/idb-store.interface';

/**
 * 
 */
export class IDBStore<
  StoreSchema extends object,
  Name extends string = string,
  StoreNames extends keyof StoreSchema = keyof StoreSchema,
  Version extends number = number,
> implements IDBStoreInterface<StoreSchema, StoreNames> {
  /**
   * 
   */
  public get connection() {
    return this.#data.connection;
  }

  /**
   * 
   */
  public get database() {
    return this.#data;
  }

  /**
   * 
   */
  #data!: IDBData<Name, StoreNames, Version>;

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
    version: Version = 1 as any
  ) {
    this.#data = new IDBData(name, storeNames, store, version);
  }

  /**
   * 
   * @param storeName 
   * @param value 
   * @param key 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param complete 
   * @param error 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public add<StoreName extends StoreNames>(
    storeName: StoreName,
    value: StoreSchema[StoreName] | StoreSchema[StoreName][],
    key?: IDBValidKey,

    // Request.
    onsuccess?: IDBRequestOnSuccess<IDBValidKey, IDBValidKey> | null,
    onerror?: (this: IDBRequest<IDBValidKey>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Subscribe.
    complete?: () => void,
    error?: (err: any) => void,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readwrite"
  ): this {
    (Array.isArray(value) ? of(...value) : of(value)).subscribe({
      next: value => this.#add(
        storeName,
        value as any,
        key,
        onsuccess,
        onerror,
        transaction,
        storeNames,
        mode
      ),
      complete,
      error
    })
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public clear<StoreName extends StoreNames>(
    storeName: StoreName,

    // Request.
    onsuccess?: IDBRequestOnSuccess<undefined, undefined> | null,
    onerror?: ((this: IDBRequest<undefined>, ev: Event) => any),

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readwrite"
  ): this {
    this.#data.objectStore(
      storeName,
      store => {
        const request = store.clear();

        // On error.
        typeof onerror === 'function' && (request.onerror = onerror);

        // On success.
        request.onsuccess = (ev: any) =>
          typeof onsuccess === 'function' && onsuccess(ev.target.result, request, ev);
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param query 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public count<StoreName extends StoreNames>(
    storeName: StoreName,
    query?: IDBValidKey | IDBKeyRange,

    // Request.
    onsuccess?: IDBRequestOnSuccess<number, number> | null,
    onerror?: ((this: IDBRequest<number>, ev: Event) => any),

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readwrite"
  ): this {
    this.#data.objectStore(
      storeName,
      store => {
        const request = store.count(query);

        // On error.
        typeof onerror === 'function' && (request.onerror = onerror);

        // On success.
        request.onsuccess = (ev: any) =>
          typeof onsuccess === 'function' && onsuccess(ev.target.result, request, ev);
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param query 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public delete<StoreName extends StoreNames>(
    storeName: StoreName,
    query: IDBValidKey | IDBKeyRange,

    // Request.
    onsuccess?: IDBRequestOnSuccess<undefined, undefined> | null,
    onerror?: (this: IDBRequest<undefined>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readwrite"
  ): this {
    this.#data.objectStore(
      storeName,
      store => {
        const request = store.delete(query);

        // On error.
        typeof onerror === 'function' && (request.onerror = onerror);

        // On success.
        request.onsuccess = (ev: any) =>
          typeof onsuccess === 'function' && onsuccess(ev.target.result, request, ev);
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param query 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public get<StoreName extends StoreNames>(
    storeName: StoreName,
    query: IDBValidKey | IDBKeyRange,

    // Request.
    onsuccess?: IDBRequestOnSuccess<StoreSchema[StoreName], StoreSchema[StoreName]> | null,
    onerror?: (this: IDBRequest<any>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readonly"
  ): this {
    this.#data.objectStore(
      storeName,
      store => {
        const request = store.get(query);

        // On error.
        typeof onerror === 'function' && (request.onerror = onerror);

        // On success.
        request.onsuccess = (ev: any) =>
          typeof onsuccess === 'function' && onsuccess(ev.target.result, request, ev);
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param query 
   * @param count 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public getAll<StoreName extends StoreNames>(
    storeName: StoreName,
    query?: IDBValidKey | IDBKeyRange,
    count?: number,

    // Request.
    onsuccess?: IDBRequestOnSuccess<StoreSchema[StoreName][], StoreSchema[StoreName][]> | null,
    onerror?: ((this: IDBRequest<any[]>, ev: Event) => any) | null,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readonly"
  ): this {
    this.#data.objectStore(
      storeName,
      store => {
        const request = store.getAll(query, count);

        // On error.
        typeof onerror === 'function' && (request.onerror = onerror);

        // On success.
        typeof onsuccess === 'function' && (request.onsuccess = (ev: any) => onsuccess(ev.target.result, request, ev));
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param name 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public index<StoreName extends StoreNames>(
    storeName: StoreName,
    name: string,

    // Request.
    onsuccess?: (index: IDBIndex) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readonly"
  ): this {
    this.#data.objectStore(
      storeName,
      store => typeof onsuccess === 'function' && onsuccess(store.index(name)),
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param query 
   * @param direction 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public openCursor<StoreName extends StoreNames>(
    storeName: StoreName,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,

    // Request.
    onsuccess?: IDBRequestOnSuccess<IDBCursorWithValue, IDBCursorWithValue | null> | null,
    onerror?: (this: IDBRequest<IDBCursorWithValue | null>, ev: Event) => any | null,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode?: IDBTransactionMode
  ): this {
    this.#data.objectStore(
      storeName,
      store => {
        const request = store.openCursor(query, direction);
        typeof onsuccess === 'function' && (request.onsuccess = (ev: any) => onsuccess(ev.target.result, request, ev));
        typeof onerror === 'function' && (request.onerror = onerror);
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param value 
   * @param key 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public put<StoreName extends StoreNames>(
    storeName: StoreName,
    value: StoreSchema[StoreName],
    key?: IDBValidKey,

    // Request.
    onsuccess?: IDBRequestOnSuccess<IDBValidKey, IDBValidKey> | null,
    onerror?: (this: IDBRequest<IDBValidKey>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readwrite"
  ): this {
    this.#data.objectStore(storeName, store => {
        const request = store.put(value, key);
        typeof onerror === 'function' && (request.onerror = onerror);
        typeof onsuccess === 'function' && (request.onsuccess = (ev: any) => onsuccess(ev.target.result, request, ev));
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param storeName 
   * @param value 
   * @param key 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  #add<StoreName extends StoreNames>(
    storeName: StoreName,
    value: StoreSchema[StoreName],
    key?: IDBValidKey,

    // Request.
    onsuccess?: IDBRequestOnSuccess<IDBValidKey, IDBValidKey> | null,
    onerror?: (this: IDBRequest<IDBValidKey>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.#data.connection.storeNames,
    mode: IDBTransactionMode = "readwrite",
  ): this {
    this.#data.objectStore(
      storeName,
      store => {
        const request = store.add(value, key);

        // On error.
        typeof onerror === 'function' && (request.onerror = onerror);

        // On success.
        typeof onsuccess === 'function' && (request.onsuccess = (ev: any) => onsuccess(ev.target.result, request, ev));
      },
      transaction?.oncomplete,
      transaction?.onabort,
      transaction?.onerror,
      storeNames,
      mode
    );
    return this;
  }
}

