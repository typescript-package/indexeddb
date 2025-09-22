// Type.
import { IDBQueryMethodCommon } from "./idb-query-method-common.type";

/**
 * 
 */
export type IDBQueryClear<
  StoreNames extends string | number | symbol = string,
> = IDBQueryMethodCommon<StoreNames, undefined, undefined>;
