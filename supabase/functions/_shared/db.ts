import { Pool, type PoolClient } from "./deps.ts";
import { SUPABASE_DB_URL } from "./env.ts";

const pool = new Pool(SUPABASE_DB_URL, 3, true);

export async function withTransaction<T>(handler: (client: PoolClient) => Promise<T>): Promise<T> {
  const connection = await pool.connect();
  try {
    await connection.queryArray`begin`;
    await connection.queryArray`set transaction isolation level serializable`;
    const result = await handler(connection);
    await connection.queryArray`commit`;
    return result;
  } catch (error) {
    try {
      await connection.queryArray`rollback`;
    } catch (_) {
      // ignore rollback errors
    }
    throw error;
  } finally {
    connection.release();
  }
}
