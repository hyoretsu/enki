/** Backend-agnostic SQL surface shared by the Tauri and web SQLite adapters. */
export interface SqlExecutor {
	select<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
	execute(sql: string, params?: unknown[]): Promise<void>;
}
