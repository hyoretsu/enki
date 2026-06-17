import Database from "@tauri-apps/plugin-sql";
import type { SqlExecutor } from "./types";

// Rewrites shared `?` placeholders to the `$1, $2, …` positional form the SQLite driver
// behind tauri-plugin-sql expects, so repository SQL stays identical across both adapters.
function toPositional(sql: string): string {
	let index = 0;
	return sql.replace(/\?/g, () => `$${++index}`);
}

// Real on-disk SQLite via tauri-plugin-sql — the primary store on the native (desktop/mobile)
// runtime. The database file lives in the app's data directory.
export async function createTauriExecutor(): Promise<SqlExecutor> {
	const db = await Database.load("sqlite:enki.db");

	return {
		async select<T>(sql: string, params: unknown[] = []): Promise<T[]> {
			return db.select<T[]>(toPositional(sql), params);
		},
		async execute(sql: string, params: unknown[] = []): Promise<void> {
			await db.execute(toPositional(sql), params);
		},
	};
}
