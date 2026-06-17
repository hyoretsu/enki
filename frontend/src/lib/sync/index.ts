import { type Snapshot, exportSnapshot, importSnapshot } from "@/lib/local/repository";
import { SYNC_TABLES } from "@/lib/local/schema";
import { readDriveSnapshot, writeDriveSnapshot } from "./drive";
import { mergeSnapshots } from "./merge";

/**
 * Two-way sync with Google Drive:
 *  1. pull the remote snapshot,
 *  2. merge it with the local snapshot (last-write-wins per row, tombstones honoured),
 *  3. apply the merge locally, and
 *  4. push the merged result back so both sides converge.
 *
 * `getToken` resolves a Google access token carrying the `drive.appdata` scope.
 */
export async function syncWithDrive(getToken: () => Promise<string>): Promise<void> {
	const token = await getToken();
	const [remote, local] = await Promise.all([readDriveSnapshot(token), exportSnapshot()]);
	const merged: Snapshot = mergeSnapshots(local, remote, SYNC_TABLES);
	await importSnapshot(merged);
	await writeDriveSnapshot(token, merged);
}

export { mergeSnapshots } from "./merge";
