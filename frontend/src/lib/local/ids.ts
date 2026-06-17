/** Generates a RFC4122 v4 UUID, matching the backend's `crypto.randomUUID()` ids. */
export function uuid(): string {
	return crypto.randomUUID();
}

/** Current time as epoch milliseconds — the sync clock used for `updatedAt`/tombstones. */
export function now(): number {
	return Date.now();
}
