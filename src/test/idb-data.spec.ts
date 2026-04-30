import { IDBData } from "../lib";

describe(`IDBData`, () => {
  it('should create an instance with the correct schema and connection parameters', () => {
    const dataInstance = IDBData.create(false, {
      person: { id: 'number', name: 'string' },
      cart: { id: 'number', items: { array: 'string' } },
    })({
      person: {
        keyPath: 'id',
        autoIncrement: true,
        index: [
          { name: 'name', keyPath: 'name', options: { unique: false } }
        ]
      },
      cart: {
        keyPath: 'id',
        autoIncrement: true,
        index: [
          { name: 'items', keyPath: 'items', options: { unique: false } }
        ]
      },
    },
    {
      'name': 'test-db',
      'version': 1,
    });
    
    expect(dataInstance).toBeDefined();
    expect(dataInstance.schema).toEqual({
      person: { id: 'number', name: 'string' },
      cart: { id: 'number', items: { array: 'string' } },
    } as any);
    expect(dataInstance.connection).toEqual({
      name: 'test-db',
      version: 1,
    } as any);
  });
});
