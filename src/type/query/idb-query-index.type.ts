// Type.
import { IDBRequestTransaction } from "../idb-request-transaction.type";

/**
 * 
 */
export type IDBQueryIndex<
  StoreNames extends string | number | symbol = string,
> = {
  name: string;

  // Request.
  onsuccess?: (index: IDBIndex) => any,

  // Transaction.
  transaction?: IDBRequestTransaction,

  // Store.
  storeNames?: StoreNames | StoreNames[],
  mode?: IDBTransactionMode;
};
