// Type.
import { IDBQueryMethodCommon } from "./idb-query-method-common.type";
import { IDBRangeBound } from "./idb-range-bound.type";

/**
 * 
 */
export type IDBQueryOpenCursor<
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema = keyof StoreSchema
> = {
  query?: IDBValidKey | IDBKeyRange | null;
  direction?: IDBCursorDirection;
  key?: IDBValidKey;
  range?: IDBRangeBound;
} & IDBQueryMethodCommon<StoreNames, IDBCursorWithValue, IDBCursorWithValue | null>;
