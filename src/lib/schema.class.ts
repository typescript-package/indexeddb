// Interface & Type.
import type { IDBSchema } from "@typedly/indexeddb";
import type { SchemaRecordToType } from "@typedly/schema";
/**
 * @description
 * @export
 * @class Schema
 * @template {IDBSchema} RawSchema 
 * @template {SchemaRecordToType<RawSchema>} [Schema=SchemaRecordToType<RawSchema>] 
 */
export class Schema<
  const RawSchema extends IDBSchema,
  Schema extends SchemaRecordToType<RawSchema> = SchemaRecordToType<RawSchema>,
  StoreNames extends keyof Schema & string = keyof Schema & string,
> {
  /**
   * @description
   * @readonly
   * @type {RawSchema}
   */
  get rawSchema(): RawSchema {
    return this.#rawSchema;
  }

  /**
   * @description
   * @type {RawSchema}
   */
  #rawSchema: RawSchema;

  /**
   * @description
   * @type {Schema}
   */
  declare readonly type: Schema;

  /**
   * Creates an instance of `Schema`.
   * @constructor
   * @param {RawSchema} rawSchema 
   */
  constructor(rawSchema: RawSchema) {
    this.#rawSchema = rawSchema;
  }

  getStoreSchema<K extends StoreNames>(store: K): Schema[K] {
    return undefined as any;
  }

  /**
   * @description
   * @returns {StoreNames[]} 
   */
  storeNames(): StoreNames[] {
    return Object.keys(this.#rawSchema ?? {}) as StoreNames[];
  }

  // TODO: Implement actual validation logic based on the raw schema.
  validate(schema: unknown): schema is Schema {
    if (typeof schema !== "object" || schema == null) return false;
    const stores = Object.keys(this.#rawSchema ?? {}) as (keyof RawSchema)[];
    for (const store of stores) {
      if (!(store in schema!)) return false;
      const schemaDef = ((this.#rawSchema ?? {}) as RawSchema)![store];
      const value = (schema as any)[store];
      if (!this.#validateValue(schemaDef, value)) return false;
    }
    return true;
  }

  /**
   * @description Helper (recursive for nested objects and arrays)
   * @param {*} schemaDesc 
   * @param {*} value 
   * @returns {boolean} 
   */
  #validateValue(schemaDesc: any, value: any): boolean {
    if (typeof schemaDesc === "string") {
      // Primitive type expected: 'number', 'string', etc.
      return typeof value === schemaDesc;
    }
    if (schemaDesc.array) {
      if (!Array.isArray(value)) return false;
      // Every item in array should match schemaDesc.array type
      return value.every(item => this.#validateValue(schemaDesc.array, item));
    }
    // Object with fields: check each property
    for (const key of Object.keys(schemaDesc)) {
      if (!(key in value)) return false;
      if (!this.#validateValue(schemaDesc[key], value[key])) return false;
    }
    return true;
  }
}

const shopSchema = new Schema({
  person: { id: 'number', name: 'string' },
  cart: { id: 'number', items: { array: 'string' } },
});

// TypeScript: get the static type
type Shop = typeof shopSchema.type;

shopSchema.validate({
  person: { id: 1, name: 'Alice' },
  cart: { id: 1 },
});

shopSchema.getStoreSchema('person'); // Type: { id: number; name: string }
shopSchema.getStoreSchema('cart'); // Type: { id: number; items: string[] }
