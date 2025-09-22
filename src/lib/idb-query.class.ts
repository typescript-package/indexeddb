// RxJS.
import { Observable, of } from 'rxjs';

// Class.
import { IDBStore } from './idb-store.class';

// Type.
import { IDBQueryMethod } from '../type/query/idb-query-method.type';
import { IDBQueryMethod_Store } from '../type/query/idb-query-method-store.type';
import { IDBQueryStore_Method } from '../type/query/idb-query-store-method.type';
import { IDBRangeBound } from '../type/query/idb-range-bound.type';

// Interface.
import { IDBConfig } from '../interface/idb-config.interface';

/**
 * Query store with JSON, by method-store or store-method.
 */
export class IDBQuery<
  StoreSchema extends object,
  Name extends string = string,
  StoreNames extends keyof StoreSchema = keyof StoreSchema,
  Version extends number = number
> {
  /**
   * 
   * @param range 
   * @returns 
   */
  public static range(
    range: IDBRangeBound
  ): IDBKeyRange {
    if (Array.isArray(range)) {
      return IDBKeyRange.bound(...range);
    } else if (range.only) {
      return IDBKeyRange.only(range);
    } else {
      if (range.lower && !range.upper) {
        return IDBKeyRange.lowerBound(range.lower);
      }
      if (range.upper && !range.lower) {
        return IDBKeyRange.upperBound(range.upper);
      }
      return IDBKeyRange.bound(
        range?.lower,
        range?.upper,
        range?.lowerOpen,
        range?.upperOpen
      );
    }
  }

  /**
   * 
   */
  public get connection() {
    return this.#store.connection;
  }

  /**
   * 
   */
  // TODO:
  public get objectStore(): IDBStore<StoreSchema, Name, StoreNames, Version> {
    return this.#store;
  }

  /**
   * 
   */
  #store!: IDBStore<StoreSchema, Name, StoreNames, Version>;

  /**
   * 
   * @param name 
   * @param storeNames 
   * @param store 
   * @param version 
   */
  constructor(
    query?: IDBQueryMethod_Store<StoreSchema, StoreNames>,
    config?: IDBConfig<Name, StoreNames, Version>,
  ) {
    // super();
    if (config) {
      this.#store = new IDBStore(
        config.name,
        config.storeNames,
        config.store,
        config.version
      );
    }
    query && this.method(query);
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public add<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['add'],
    complete?: () => void,
    error?: (err: any) => void,
    subscribe?: (observable: Observable<{
        result: IDBValidKey, request: IDBRequest<IDBValidKey>, ev: Event
      }>) => void
  ): this {
    const subscription = of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['add'])

    if (subscribe) {
      subscribe(new Observable<{
        result: IDBValidKey, request: IDBRequest<IDBValidKey>, ev: Event
      }>(subscriber => {
        subscription.subscribe({
          'next': query => {

            const previousOnSuccess = query.onsuccess;
            const previousOnError = query.onerror;

            query.onsuccess = (result: IDBValidKey, request: IDBRequest<IDBValidKey>, ev: Event) => {
              previousOnSuccess && previousOnSuccess(result, request, ev);
              subscriber.next({result, request, ev});
            };

            query.onerror = function(this: IDBRequest<IDBValidKey>, ev: Event) {
              previousOnError && previousOnError.call(this, ev);
              subscriber.error(ev);
            };

            this.#add(query);
          },
          complete: () => subscriber.complete(),
          error: (err) => subscriber.error(err)
        });
      }));
    }
    else {
      subscription.subscribe({
        'next': query => this.#add(query),
        complete,
        error
      });
    }
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public clear<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['clear'],
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['clear'])
      .subscribe({
        next: query => this.#clear(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public count<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['count'],
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['count'])
      .subscribe({
        next: query => this.#count(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public delete<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['delete'],
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['delete'])
      .subscribe({
        next: query => this.#delete(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public get<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['get'],
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['get'])
      .subscribe({
        next: query => this.#get(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public getAll<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['getAll'],
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['getAll'])
      .subscribe({
        next: query => this.#getAll(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public index<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['index'],
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['index'])
      .subscribe({
        next: query => this.#index(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public openCursor<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['openCursor'],
    complete?: () => void,
    error?: (err: any) => void | undefined,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['openCursor'])
      .subscribe({
        next: query => this.#openCursor(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public put<StoreName extends StoreNames>(
    { }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['put'],
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod<StoreName, StoreSchema, StoreNames>['put'])
      .subscribe({
        next: query => this.#put(query),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   */
  public method(
    { }: IDBQueryMethod_Store<StoreSchema, StoreNames>,
    complete?: () => void,
    error?: (err: any) => void,
  ): this {
    of(arguments[0] as IDBQueryMethod_Store<StoreSchema, StoreNames>)
      .subscribe({
        next: query => 
          this.#queryMethod(query, method => {
            if (query[method]) {
              const queryStore = query[method];
              if (queryStore) {
                (Object
                  .keys(queryStore) as Array<keyof typeof queryStore>)
                  .forEach(storeName => {
                    this.#performMethod(method, {
                      ...{ storeName },
                      ...queryStore[storeName]
                    } as any)
                  });
              }
            }
          }
        ),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  public store<StoreName extends StoreNames>(
    { }: IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>,
    complete?: () => void,
    error?: (err: any) => void,
  ) {
    of(arguments[0] as IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>)
      .subscribe({
        next: query => 
          this.#queryStore(query, storeName => {
            const queryMethod = query[storeName];
            if (queryMethod) {
              Object
                .entries(queryMethod)
                .forEach(([method, query]) =>
                  this.#performMethod(
                    method as any, {
                      ...{ storeName },
                      ...query
                    }
                  )
                );
            }
          }
        ),
        complete,
        error
      })
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #add<StoreName extends StoreNames = StoreNames>({
    storeName,
    value,
    key,

    // Request.
    onsuccess,
    onerror,

    // Transaction.
    transaction,

    // Subscribe.
    complete,
    error,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readwrite"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['add'],
  ): this {
    this.#store.add(
      storeName,
      value,
      key,
      onsuccess,
      onerror,
      transaction,
      complete,
      error,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #clear<StoreName extends StoreNames>({
    storeName,

    // Request.
    onsuccess,
    onerror,

    // Transaction.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readwrite"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['clear']
  ): this {
    this.#store.clear(
      storeName,
      onsuccess,
      onerror,
      transaction,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #count<StoreName extends StoreNames>({
    storeName,
    query,
    key,
    range,

    // Request.
    onsuccess,
    onerror,

    // Transaction.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readwrite"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['count']
  ): this {
    this.#store.count(
      storeName,
      query || key || range && IDBQuery.range(range),
      onsuccess,
      onerror,
      transaction,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #delete<StoreName extends StoreNames>({
    storeName,
    query,
    key,
    range,

    // Request.
    onsuccess,
    onerror,

    // Transaction handlers.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readwrite"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['delete']
  ): this {
    const deleteQuery = query || key || range && IDBQuery.range(range);
    if (deleteQuery) {
      this.#store.delete(
        storeName,
        deleteQuery,
        onsuccess,
        onerror,
        transaction,
        storeNames,
        mode
      );
    }
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #get<StoreName extends StoreNames>({
    storeName,
    query,
    key,
    range,

    // Request.
    onsuccess,
    onerror,

    // Transaction.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readonly"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['get']
  ): this {
    const getQuery = query || key || range && IDBQuery.range(range);
    if (getQuery) {
      this.#store.get(
        storeName,
        getQuery,
        onsuccess,
        onerror,
        transaction,
        storeNames,
        mode
      );
    }
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #getAll<StoreName extends StoreNames>({
    storeName,
    query,
    count,
    key,
    range,

    // Request.
    onsuccess,
    onerror,

    // Transaction.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readonly"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['getAll']
  ): this {
    this.#store.getAll(
      storeName,
      query || key || range && IDBQuery.range(range),
      count,
      onsuccess,
      onerror,
      transaction,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #index<StoreName extends StoreNames>({
    storeName,
    name,

    // Request.
    onsuccess,

    // Transaction handlers.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readwrite"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['index']
  ): this {
    this.#store.index(
      storeName,
      name,
      onsuccess,
      transaction,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #openCursor<StoreName extends StoreNames>({
    storeName,
    query,
    direction,
    key,
    range,

    // Request.
    onsuccess,
    onerror,

    // Transaction.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readwrite"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['openCursor']
  ): this {
    this.#store.openCursor(
      storeName,
      query || key || range && IDBQuery.range(range),
      direction,
      onsuccess,
      onerror,
      transaction,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param methodName 
   * @param query 
   */
  #performMethod<
    MethodName extends keyof IDBQueryMethod<StoreName, StoreSchema, StoreNames>,
    StoreName extends StoreNames
  >(
    methodName: MethodName,
    query: IDBQueryMethod<StoreName, StoreSchema, StoreNames>[MethodName]
  ) {
    switch (methodName) {
      case 'add': this.#add(query as any); break;
      case 'clear': this.#clear(query as any); break;
      case 'count': this.#count(query as any) as any; break;
      case 'delete': this.#delete(query as any); break;
      case 'get': this.#get(query as any); break;
      case 'getAll': this.#getAll(query as any); break;
      case 'index': this.#index(query as any); break;
      case 'openCursor': this.#openCursor(query as any); break;
      case 'put': this.#put(query as any); break;
    }
  }

  /**
   * 
   * @param param0 
   * @returns 
   */
  #put<StoreName extends StoreNames>({
    storeName,
    value,
    key,

    // Request.
    onsuccess,
    onerror,

    // Transaction.
    transaction,

    // Store.
    storeNames = this.#store.connection.storeNames,
    mode = "readwrite"
  }: IDBQueryMethod<StoreName, StoreSchema, StoreNames>['put']
  ): this {
    this.#store.put(
      storeName,
      value,
      key,
      onsuccess,
      onerror,
      transaction,
      storeNames,
      mode
    );
    return this;
  }

  /**
   * 
   * @param query 
   * @param callbackfn 
   * @returns 
   */
  #queryMethod(
    query: IDBQueryMethod_Store<StoreSchema, StoreNames>,
    callbackfn: (method: keyof IDBQueryMethod_Store<StoreSchema, StoreNames>) => any
  ): this {
    (Object
      .keys(query) as Array<keyof IDBQueryMethod_Store<StoreSchema, StoreNames>>)
      .forEach(callbackfn);
    return this;
  }

  /**
   * 
   * @param query 
   * @param callbackfn 
   * @returns 
   */
  #queryStore<StoreName extends StoreNames>(
    query: IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>,
    callbackfn: (storeName: keyof IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>) => any
  ): this {
    (Object
      .keys(query) as Array<keyof IDBQueryStore_Method<StoreName, StoreSchema, StoreNames>>)
      .forEach(callbackfn);
    return this;
  }
}
