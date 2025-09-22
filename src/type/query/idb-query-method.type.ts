// Type.
import { IDBQueryAdd } from "./idb-query-add.type";
import { IDBQueryClear } from "./idb-query-clear.type";
import { IDBQueryCount } from "./idb-query-count.type";
import { IDBQueryDelete } from "./idb-query-delete.type";
import { IDBQueryGet } from "./idb-query-get.type";
import { IDBQueryGetAll } from "./idb-query-get-all.type";
import { IDBQueryIndex } from "./idb-query-index.type";
import { IDBQueryOpenCursor } from "./idb-query-open-cursor.type";
import { IDBQueryPut } from "./idb-query-put.type";

/**
 * Query method input.
 */
export type IDBQueryMethod<
  StoreName extends StoreNames,
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema
> = {
  add: {storeName: StoreName} & IDBQueryAdd<StoreName, StoreSchema, StoreNames>,
  clear: {storeName: StoreName} & IDBQueryClear<StoreNames>,
  count: {storeName: StoreName} & IDBQueryCount<StoreNames>,
  delete: {storeName: StoreName} & IDBQueryDelete<StoreNames>,
  get: {storeName: StoreName} & IDBQueryGet<StoreName, StoreSchema, StoreNames>,
  getAll: {storeName: StoreName} & IDBQueryGetAll<StoreName, StoreSchema, StoreNames>,
  index: {storeName: StoreName} & IDBQueryIndex<StoreNames>,
  openCursor: { storeName: StoreName } & IDBQueryOpenCursor<StoreSchema, StoreNames>,
  put: {storeName: StoreName} & IDBQueryPut<StoreName, StoreSchema, StoreNames>,
};
