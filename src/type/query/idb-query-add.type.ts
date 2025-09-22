// Type.
import { IDBQueryMethodCommon } from "./idb-query-method-common.type";

/**
 * 
 */
export type IDBQueryAdd<
  StoreName extends StoreNames,
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema = keyof StoreSchema
> = {
  value: StoreSchema[StoreName] | StoreSchema[StoreName][],
  key?: IDBValidKey

  // Subscribe.
  complete?: () => void,
  error?: (err: any) => void
} & IDBQueryMethodCommon<StoreNames, IDBValidKey, IDBValidKey>;
