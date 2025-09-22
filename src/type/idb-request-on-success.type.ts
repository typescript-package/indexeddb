/**
 * 
 */
export type IDBRequestOnSuccess<Result, RequestResult> = (result: Result, request: IDBRequest<RequestResult>, ev: Event) => any;
