// Type.
import { IDBQueryMethodCommon } from "./idb-query-method-common.type";
import { IDBRangeBound } from "./idb-range-bound.type";

/**
 * 
 */
export type IDBQueryGet<
  StoreName extends StoreNames,
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema = keyof StoreSchema
> = {
  query: IDBValidKey | IDBKeyRange;
  key?: IDBValidKey;
  range?: IDBRangeBound;
} & IDBQueryMethodCommon<StoreNames, StoreSchema[StoreName]>;
