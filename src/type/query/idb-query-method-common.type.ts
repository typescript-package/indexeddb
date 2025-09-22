// Type.
import { IDBRequestOnSuccess } from "../idb-request-on-success.type";
import { IDBRequestTransaction } from "../idb-request-transaction.type";

/**
 * 
 */
export type IDBQueryMethodCommon<
  StoreNames extends string | number | symbol = string,
  Result = any,
  RequestResult = any,
> = {
  // Request.
  onsuccess?: IDBRequestOnSuccess<Result, RequestResult>,
  onerror?: (this: IDBRequest<RequestResult>, ev: Event) => any,

  // Transaction.
  transaction?: IDBRequestTransaction,

  // Store.
  storeNames?: StoreNames | StoreNames[],
  mode?: IDBTransactionMode;
}
