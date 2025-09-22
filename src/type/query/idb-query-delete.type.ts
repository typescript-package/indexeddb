// Type.
import { IDBQueryMethodCommon } from "./idb-query-method-common.type";
import { IDBRangeBound } from "./idb-range-bound.type";

/**
 * 
 */
export type IDBQueryDelete<
  StoreNames extends string | number | symbol = string,
> = {
  query: IDBValidKey | IDBKeyRange;
  key?: IDBValidKey;
  range?: IDBRangeBound;
} & IDBQueryMethodCommon<StoreNames, undefined, undefined>;
