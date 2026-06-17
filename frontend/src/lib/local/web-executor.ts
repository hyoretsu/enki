import initSqlJs, { type Database } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { idbGet, idbSet } from "./idb";
import type { SqlExecutor } from "./types";

const SNAPSHOT_KEY = "sqlite-snapshot";

// sql.js runs entirely in the browser (WASM). The whole database is exported to a byte
// array and persisted to IndexedDB after every mutation; reads stay in memory. This is the
// fallback used outside the Tauri runtime (web/dev/PWA).
export async function createWebExecutor(): Promise<SqlExecutor & { snapshot(): Uint8Array }> {
	const SQL = await initSqlJs({ locateFile: () => wasmUrl });
	const saved = await idbGet<Uint8Array>(SNAPSHOT_KEY);
	const db: Database = new SQL.Database(saved ?? undefined);

	let persistTimer: ReturnType<typeof setTimeout> | undefined;
	const persist = () => {
		clearTimeout(persistTimer);
		persistTimer = setTimeout(() => void idbSet(SNAPSHOT_KEY, db.export()), 150);
	};

	return {
		async select<T>(sql: string, params: unknown[] = []): Promise<T[]> {
			const stmt = db.prepare(sql);
			stmt.bind(params as never[]);
			const rows: T[] = [];
			while (stmt.step()) {
				rows.push(stmt.getAsObject() as T);
			}
			stmt.free();
			return rows;
		},
		async execute(sql: string, params: unknown[] = []): Promise<void> {
			db.run(sql, params as never[]);
			persist();
		},
		snapshot() {
			return db.export();
		},
	};
}
