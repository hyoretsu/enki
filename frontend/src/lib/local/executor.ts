import { SCHEMA_STATEMENTS } from "./schema";
import type { SqlExecutor } from "./types";

/** True when running inside the Tauri native runtime (desktop/mobile webview). */
export function isTauri(): boolean {
	return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

let executorPromise: Promise<SqlExecutor> | undefined;

async function build(): Promise<SqlExecutor> {
	const executor = isTauri()
		? await import("./tauri-executor").then(m => m.createTauriExecutor())
		: await import("./web-executor").then(m => m.createWebExecutor());

	for (const statement of SCHEMA_STATEMENTS) {
		await executor.execute(statement);
	}

	return executor;
}

/** Lazily initialises (and memoises) the SQLite executor + schema for the active runtime. */
export function getExecutor(): Promise<SqlExecutor> {
	executorPromise ??= build();
	return executorPromise;
}
