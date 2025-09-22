/**
 * @description
 * @export
 */
export type IDBRequestTransaction = Partial<{
  onsuccess: (store: IDBObjectStore, transaction: IDBTransaction) => any,
  oncomplete: (this: IDBTransaction, ev: Event) => any,
  onabort: (this: IDBTransaction, ev: Event) => any,
  onerror: (this: IDBTransaction, ev: Event) => any,
}>;
