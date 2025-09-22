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
 * Variant Method -> StoreName -> QueryMethod
 */
export type IDBQueryMethod_Store<
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema = keyof StoreSchema,
> = Partial<{
  add: Partial<{ [StoreName in StoreNames]: IDBQueryAdd<StoreName, StoreSchema, StoreNames> }>,
  clear: Partial<{ [StoreName in StoreNames]: IDBQueryClear<StoreNames> }>,
  count: Partial<{ [StoreName in StoreNames]: IDBQueryCount<StoreNames> }>,
  delete: Partial<{ [StoreName in StoreNames]: IDBQueryDelete<StoreNames> }>,

  // Get.
  get: Partial<{ [StoreName in StoreNames]: IDBQueryGet<StoreName, StoreSchema, StoreNames> }>,
  getAll: Partial<{ [StoreName in StoreNames]: IDBQueryGetAll<StoreName, StoreSchema, StoreNames> }>,
  // getAllKeys?: Partial<{ [Key in StoreName]: IDBQueryGetAllKeys<StoreName> }>,
  // getKey?: Partial<{ [Key in StoreName]: IDBQueryGetKey<StoreName> }>,

  index: Partial<{ [StoreName in StoreNames]: IDBQueryIndex<StoreNames> }>,

  // Cursor.
  openCursor: Partial<{ [StoreName in StoreNames]: IDBQueryOpenCursor<StoreSchema, StoreNames> }>,
  // openKeyCursor?: Partial<{ [Key in StoreName]: IDBQueryOpenKeyCursor<StoreName> }>,

  put: Partial<{ [StoreName in StoreNames]: IDBQueryPut<StoreName, StoreSchema, StoreNames> }>,
}>;

// Examples.
// const test: IndexedDBQueryInput<{periodic: {id: number, name: string}}> 
// test.get?.periodic
