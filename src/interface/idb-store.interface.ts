// Type.
import { IDBRequestOnSuccess } from "../type/idb-request-on-success.type";
import { IDBRequestTransaction } from "../type/idb-request-transaction.type";

/**
 * 
 */
export interface IDBStoreInterface<
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema = keyof StoreSchema,
> {
  add: <StoreName extends StoreNames>(
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
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ) => this;

  /**
   * 
   * @param storeName 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   */
  clear: <StoreName extends StoreNames>(
    storeName: StoreName,

    // Request.
    onsuccess?: IDBRequestOnSuccess<undefined, undefined> | null,
    onerror?: ((this: IDBRequest<undefined>, ev: Event) => any),

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode,
  ) => this;

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
  count: <StoreName extends StoreNames>(
    storeName: StoreName,
    query?: IDBValidKey | IDBKeyRange,

    // Request.
    onsuccess?: IDBRequestOnSuccess<number, number> | null,
    onerror?: ((this: IDBRequest<number>, ev: Event) => any),

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ) => this;

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
  delete: <StoreName extends StoreNames>(
    storeName: StoreName,
    query: IDBValidKey | IDBKeyRange,

    // Request.
    onsuccess?: IDBRequestOnSuccess<undefined, undefined> | null,
    onerror?: (this: IDBRequest<undefined>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ) => this

  /**
   * 
   * @param storeName 
   * @param query 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   */
  get: <Name extends StoreNames>(
    storeName: Name,
    query: IDBValidKey | IDBKeyRange,

    // Request.
    onsuccess?: (result: StoreSchema[Name], request: IDBRequest<StoreSchema[Name]>, ev: Event) => any,
    onerror?: (this: IDBRequest<any>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ) => this;

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
   */
  getAll<StoreName extends StoreNames>(
    storeName: StoreName,
    query?: IDBValidKey | IDBKeyRange,
    count?: number,

    // Request.
    onsuccess?: IDBRequestOnSuccess<StoreSchema[StoreName][], StoreSchema[StoreName][]> | null,
    onerror?: ((this: IDBRequest<any[]>, ev: Event) => any) | null,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ): this

  /**
   * 
   * @param storeName 
   * @param name 
   * @param onsuccess 
   * @param onerror 
   * @param transaction 
   * @param storeNames 
   * @param mode 
   */
  index<StoreName extends StoreNames>(
    storeName: StoreName,
    name: string,

    // Request.
    onsuccess?: (index: IDBIndex) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ): this

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
  openCursor: <StoreName extends StoreNames>(
    storeName: StoreName,
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,

    // Request.
    onsuccess?: IDBRequestOnSuccess<any, IDBCursorWithValue | null> | null,
    onerror?: (this: IDBRequest<IDBCursorWithValue | null>, ev: Event) => any | null,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ) => this;

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
   */
  put: <StoreName extends StoreNames>(
    storeName: StoreName,
    value: StoreSchema[StoreName],
    key?: IDBValidKey,

    // Request.
    onsuccess?: IDBRequestOnSuccess<IDBValidKey, IDBValidKey> | null,
    onerror?: (this: IDBRequest<IDBValidKey>, ev: Event) => any,

    // Transaction.
    transaction?: IDBRequestTransaction,

    // Store.
    storeNames?: StoreNames | StoreNames[],
    mode?: IDBTransactionMode
  ) => this;
}