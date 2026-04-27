// Class.
import { LazyDeferred } from "@typescript-package/promise";
/**
 * @description Abstraction class for opening connection.
 * @export
 * @class DBConnection
 * @template {string} [Name=string] 
 * @template {number} [Version=number] 
 */
export abstract class DBConnection<
  Name extends string = string,
  Version extends number = number,
  Database = any,
  OpenRequest = any
> {
  /**
   * @description The database instance. Subclass may use this to return the database instance when the open request succeeds.
   * @public
   * @abstract
   * @readonly
   * @type {Database | undefined}
   */
  public abstract get database(): Database | undefined;

  /**
   * @description The name of the database. Subclass may use this in the open request.
   * @public
   * @readonly
   * @type {Name}
   */
  public get name(): Name {
    return this.#name;
  }

  /**
   * @description The open request for opening the database. Subclass may use this to store the open request and resolve/reject the ready promise when it succeeds/fails.
   * @public
   * @abstract
   * @readonly
   * @type {OpenRequest | undefined}
   */
  public abstract get openRequest(): OpenRequest | undefined;

  /**
   * @description The version of the database. Subclass may use this in the open request.
   * @public
   * @abstract
   * @readonly
   * @type {Version | undefined}
   */
  public abstract get version(): Version | undefined;

  /**
   * @description The name of the database. Subclass may use this in the open request.
   * @type {Name}
   */
  #name: Name;

  /**
   * @description Deferred ready promise: created in constructor, resolved/rejected later by subclass
   * @type {*}
   */
  #ready = new LazyDeferred<OpenRequest>();

  /**
   * Creates an instance of `DBConnection`.
   * @constructor
   * @param {Name} name The name of the database to open. Subclass may use this in the open request.
   */
  constructor(name: Name) {
    this.#name = name;
  }

  /**
   * @description Subclasses call this when the open request succeeds
   * @public
   * @async
   * @param {?(promise: Promise<OpenRequest>) => void} [callbackfn] Callback function to be called with the promise.
   * @returns {Promise<OpenRequest>} 
   */
  public async ready(callbackfn?: (openRequest: OpenRequest) => void): Promise<OpenRequest> {
    const openRequest = await this.#ready;
    typeof callbackfn === 'function' && callbackfn(openRequest);
    return this.#ready;
  }

  /**
   * @description Subclasses call this when the open request succeeds
   * @protected
   * @param {OpenRequest} openRequest 
   */
  protected resolveReady(openRequest: OpenRequest) {
    this.#ready.resolve(openRequest);
  }

  /**
   * @description Subclasses call this when the open request fails
   * @protected
   * @param {?*} [error] 
   */
  protected rejectReady(error?: any) {
    this.#ready.reject(error);
  }

  /**
   * @description Subclass must implement how it stores the underlying open request
   * @protected 
   * @abstract
   * @param {OpenRequest} openRequest 
   */
  protected abstract setOpenRequest(openRequest: OpenRequest): void;
}
