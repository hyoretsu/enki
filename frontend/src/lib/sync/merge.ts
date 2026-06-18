// Pure two-way merge for the Drive sync. Every synced row carries `updated_at` (epoch ms);
// deletions are tombstones (a row whose `deleted_at` is set, with `updated_at` bumped). The
// merge is therefore last-write-wins per row id across the local and remote snapshots — a
// tombstone simply wins when it is the most recent write, so deletions propagate instead of
// resurrecting.

export type Row = Record<string, unknown> & { id?: unknown; updated_at?: unknown };
export type Snapshot = Record<string, Row[]>;

const stamp = (row: Row): number => Number(row.updated_at ?? 0);

/** Merges two row sets by id, keeping the most recently updated version of each row. */
export function mergeRowSets(local: Row[] = [], remote: Row[] = []): Row[] {
	const byId = new Map<string, Row>();

	for (const row of [...local, ...remote]) {
		const id = String(row.id);
		const existing = byId.get(id);
		if (!existing || stamp(row) >= stamp(existing)) {
			byId.set(id, row);
		}
	}

	return [...byId.values()];
}

/** Merges full snapshots table-by-table. */
export function mergeSnapshots(local: Snapshot, remote: Snapshot, tables: readonly string[]): Snapshot {
	const merged: Snapshot = {};
	for (const table of tables) {
		merged[table] = mergeRowSets(local[table], remote[table]);
	}
	return merged;
}
