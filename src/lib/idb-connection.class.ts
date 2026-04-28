// Interface.
import { IDBOpenDBRequestEvents } from "@typedly/indexeddb";
// Abstract.
import { DBConnection } from "./db/db-connection.abstract";
/**
 * @description Class to handle the connection of IndexedDB database.
 * It extends the abstract `DBConnection` class and implements the open method to open the database connection using IndexedDB API.
 * It also provides a close method to close the database connection and a ready method to wait for the database connection to be ready.
 * @export
 * @class IDBConnection
 * @template {string} [Name=string] 
 * @template {number} [Version=number] 
 * @extends {DBConnection<Name, Version, IDBDatabase, IDBOpenDBRequest>}
 */
export class IDBConnection<
  Name extends string = string,
  Version extends number = number,
> extends DBConnection<Name, Version, IDBDatabase, IDBOpenDBRequest> {
  public get database(): IDBDatabase | undefined {
    return this.#openRequest?.result;
  }
  public get openRequest(): IDBOpenDBRequest | undefined {
    return this.#openRequest;
  }
  public get version(): Version | undefined {
    return this.#openRequest?.result?.version as Version ?? this.#version;
  }

  /**
   * @description Privately stored open request. Subclass may use this to store the open request and resolve/reject the ready promise when it succeeds/fails.
   * @type {!IDBOpenDBRequest}
   */
  #openRequest!: IDBOpenDBRequest;
   
  /**
   * @description Privately stored onblocked event handler. Subclass may use this to handle the blocked event when opening the database.
   * @type {?((this: IDBOpenDBRequest, ev: Event) => any) | null}
   */
  #onblocked?: ((this: IDBOpenDBRequest, ev: Event) => any) | null;

  /**
   * @description Privately stored onerror event handler. Subclass may use this to handle the error event when opening the database.
   * @type {?((this: IDBOpenDBRequest, ev: Event) => any) | null}
   */
  #onerror?: ((this: IDBOpenDBRequest, ev: Event) => any) | null;

  /**
   * @description Privately stored onsuccess event handler. Subclass may use this to handle the success event when opening the database.
   * @type {?((this: IDBOpenDBRequest, ev: Event) => any) | null}
   */
  #onsuccess?: ((this: IDBOpenDBRequest, ev: Event) => any) | null

  /**
   * @description Privately stored onupgradeneeded event handler. Subclass may use this to handle the upgradeneeded event when opening the database.
   * @type {?((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null}
   */
  #onupgradeneeded?: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null;

  /**
   * @description Privately stored version. Subclass may use this in the open request.
   * @type {!Version}
   */
  #version!: Version;

  /**
   * Creates an instance of `IDBConnection`.
   * @constructor
   * @param {Name} name 
   * @param {Version} [version=1 as any] 
   * @param {IDBOpenDBRequestEvents} [param0={}] 
   * @param {(ev: Event) => any} param0.onblocked 
   * @param {(this: IDBOpenDBRequest, ev: Event) => any} param0.onerror 
   * @param {(this: IDBOpenDBRequest, ev: Event) => any} param0.onsuccess 
   * @param {(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any} param0.onupgradeneeded 
   * @param {boolean} [open=true] 
   */
  constructor(
    name: Name,
    version: Version = 1 as any,
    { onblocked, onerror, onsuccess, onupgradeneeded }: IDBOpenDBRequestEvents = {},
    open: boolean = true
  ) {
    super(name);
    this.#version = version;
    onblocked && (this.#onblocked = onblocked);
    onerror && (this.#onerror = onerror);
    onsuccess && (this.#onsuccess = onsuccess);
    onupgradeneeded && (this.#onupgradeneeded = onupgradeneeded);
    open && this.open();
  }

  /**
   * @description Closes the database connection. Subclass may use this to close the database connection when needed.
   * @public
   */
  public close(): void {
    this.#openRequest?.result?.close();
  }
  
  /**
   * @description Opens the database connection. Subclass may use this to open the database connection when needed.
   * @public
   * @async
   * @returns {Promise<IDBOpenDBRequest>} 
   */
  public async open({ onblocked, onerror, onsuccess, onupgradeneeded }: IDBOpenDBRequestEvents = {}
  ): Promise<IDBOpenDBRequest> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      const error = new Error('IndexedDB is not available in this environment');
      super.rejectReady(error);
      return Promise.reject(error);
    }
    if (typeof window !== 'undefined' && window.indexedDB) {
      !this.#openRequest && this.setOpenRequest(window.indexedDB.open(super.name, this.#version));
      if (this.#openRequest) {
        typeof (onsuccess ?? this.#onsuccess) === 'function' &&
          this.#openRequest.addEventListener('success', (onsuccess ?? this.#onsuccess) as EventListener, { once: true });
        typeof (onerror ?? this.#onerror) === 'function' &&
          this.#openRequest.addEventListener('error', (onerror ?? this.#onerror) as EventListener, { once: true });
        typeof (onupgradeneeded ?? this.#onupgradeneeded) === 'function' &&
          this.#openRequest.addEventListener('upgradeneeded', (onupgradeneeded ?? this.#onupgradeneeded) as EventListener, { once: true });
        typeof (onblocked ?? this.#onblocked) === 'function' &&
          this.#openRequest.addEventListener('blocked', ev => (onblocked ?? this.#onblocked)?.call(this.#openRequest, ev), { once: true });

        // Database successfully opened.
        this.#openRequest.addEventListener(
          'success',
          () => super.resolveReady(this.#openRequest),
          { once: true }
        );
        this.#openRequest.addEventListener('error', () => super.rejectReady(this.#openRequest.error ?? new Error('IndexedDB open error')), { once: true });
        return this.ready();
      }
    }
    return Promise.resolve(this.#openRequest);
  }
  public override async ready(
    callbackfn?: (openRequest: IDBOpenDBRequest) => void
  ): Promise<IDBOpenDBRequest> {
    await super.ready(callbackfn);
    return this.#openRequest;
  }
  protected setOpenRequest(openRequest: IDBOpenDBRequest): void {
    this.#openRequest = openRequest;
  }
}
