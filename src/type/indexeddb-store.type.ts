
/**
 * ! Not used
 * @description
 * @export
 * @template {string} [StoreNames=string] 
 */
export type IDBStore<StoreNames extends string = string> = {
  [key in StoreNames]: IDBObjectStoreParameters & {
    index?: {
      name: string;
      keyPath: string | string[];
      options?: IDBIndexParameters;
    }[];
  };
};
