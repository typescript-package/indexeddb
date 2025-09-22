// Type.
import { IDBQueryMethodCommon } from "./idb-query-method-common.type";

/**
 * Query Put Parameters.
 */
export type IDBQueryPut<
  StoreName extends StoreNames,
  StoreSchema extends object,
  StoreNames extends keyof StoreSchema = keyof StoreSchema
> = {
  value: StoreSchema[StoreName];
  key?: IDBValidKey;

  // TODO: Subscribe.
  complete?: () => void;
  error?: (err: any) => void;
} & IDBQueryMethodCommon<StoreNames, IDBValidKey, IDBValidKey>;
