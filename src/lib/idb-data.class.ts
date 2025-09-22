// Class.
import { IDBConnection } from './idb-connection.class';

// Type.
import { IDBStoreParameters } from '../type/idb-store-parameters.type';

/**
 * Class with opened connection (IDBConnection), to handle transaction and store.
 */
export class IDBData<
  Name extends string = string,
  StoreNames extends string | number | symbol = string,
  Version extends number = number,
> {
  /**
   * 
   */
  public get connection() {
    return this.#connection;
  }

  /**
   * 
   */
  #connection!: IDBConnection<Name, StoreNames, Version>;

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
    this.#connection = new IDBConnection(
      name,
      storeNames,
      store,
      version
    );
  }

  /**
   * 
   * @param storeName 
   * @param onsuccess 
   * @param oncomplete 
   * @param onabort 
   * @param onerror 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public objectStore(
    storeName: StoreNames,

    // Transaction.
    onsuccess?: (store: IDBObjectStore, transaction: IDBTransaction) => any,
    oncomplete?: (this: IDBTransaction, ev: Event) => any,
    onabort?: (this: IDBTransaction, ev: Event) => any,
    onerror?: (this: IDBTransaction, ev: Event) => any,

    // Store.
    storeNames: StoreNames | StoreNames[] = this.connection.storeNames,
    mode?: IDBTransactionMode
  ): this {
    return this.transaction(
      transaction => typeof onsuccess === 'function'
        && typeof storeName === 'string'
        && onsuccess(transaction.objectStore(storeName), transaction),
      oncomplete,
      onabort,
      onerror,
      storeNames,
      mode
    );
  }

  /**
   * 
   * @param onsuccess 
   * @param oncomplete 
   * @param onabort 
   * @param onerror 
   * @param storeNames 
   * @param mode 
   * @returns 
   */
  public transaction(
    onsuccess?: (transaction: IDBTransaction) => any,
    oncomplete?: (this: IDBTransaction, ev: Event) => any,
    onabort?: (this: IDBTransaction, ev: Event) => any,
    onerror?: (this: IDBTransaction, ev: Event) => any,
    storeNames: StoreNames | StoreNames[] = this.#connection.storeNames,
    mode: IDBTransactionMode = "readonly"
  ): this {
    this.#connection.db ?
      this.#transaction(
        this.#connection.db.transaction(storeNames as string | string[], mode),
        onsuccess,
        oncomplete,
        onabort,
        onerror
      )
      :
      this.#connection.request.addEventListener('success', (ev: any) => {
        this.#transaction(
          (ev.target.result as any).transaction(storeNames as string | string[], mode),
          onsuccess,
          oncomplete,
          onabort,
          onerror
        );
      });
    return this;
  }

  /**
   * 
   * @param transaction 
   * @param onsuccess 
   * @param oncomplete 
   * @param onabort 
   * @param onerror 
   * @returns 
   */
  #transaction(
    transaction: IDBTransaction,
    onsuccess?: (transaction: IDBTransaction) => any,
    oncomplete?: (this: IDBTransaction, ev: Event) => any,
    onabort?: (this: IDBTransaction, ev: Event) => any,
    onerror?: (this: IDBTransaction, ev: Event) => any,
  ): this {
    if (transaction) {
      typeof onsuccess === 'function' && onsuccess(transaction);
      typeof oncomplete === 'function' && (transaction.oncomplete = oncomplete);
      typeof onabort === 'function' && (transaction.onabort = onabort);
      typeof onerror === 'function' && (transaction.onerror = onerror);
    }
    return this;
  }
}
