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
 * Variant store -> method
 */
export type IDBQueryStore_Method<
  StoreName extends StoreNames,
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema = keyof StoreSchema,
> = Partial<{
  [Name in StoreName]: Partial<{
    add: IDBQueryAdd<StoreName, StoreSchema, StoreNames>;
    clear: IDBQueryClear<StoreNames>;
    count: IDBQueryCount<StoreNames>;
    delete: IDBQueryDelete<StoreNames>;
    get: IDBQueryGet<StoreName, StoreSchema, StoreNames>;
    getAll: IDBQueryGetAll<StoreName, StoreSchema, StoreNames>;
    index: IDBQueryIndex<StoreNames>;
    openCursor: IDBQueryOpenCursor<StoreSchema, StoreNames>;
    put: IDBQueryPut<StoreName, StoreSchema, StoreNames>;
  }>
}>;
