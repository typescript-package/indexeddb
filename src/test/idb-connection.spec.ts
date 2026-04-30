import { connection } from "./readme/connection";

describe('IDBConnection', () => {
  it('should initialize with the correct name and version', () => {
    expect(connection.name).toBe('test-db');
    expect(connection.version).toBe(1);
  });

  it('should have undefined database and openRequest properties before opening', () => {
    expect(connection.database).toBeUndefined();
    expect(connection.openRequest).toBeUndefined();
  });

  it('should open the database connection successfully', async () => {
    const openRequest = await connection.open({
      onblocked: event => console.warn('Database open request is blocked.', event),
      onerror: event => console.error('Failed to open database.', event),
      onsuccess: event => console.log('Database opened successfully.', event),
      onupgradeneeded: event => console.log('Database upgrade needed.', event)
    });
    expect(connection.database).toBeDefined();
    expect(openRequest).toBeDefined();
    connection.close();
  });
});