import type { Snapshot } from "@/lib/local/repository";

// Reads and writes a single JSON snapshot in the user's Google Drive appDataFolder — a
// hidden, per-app folder that needs only the `drive.appdata` scope (no access to the rest of
// the user's Drive). The file holds the merged enki database snapshot.

const FILE_NAME = "enki-sync.json";
const FILES = "https://www.googleapis.com/drive/v3/files";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

async function findFileId(token: string): Promise<string | undefined> {
	const url = `${FILES}?spaces=appDataFolder&q=${encodeURIComponent(`name='${FILE_NAME}'`)}&fields=files(id)`;
	const response = await fetch(url, { headers: auth(token) });
	if (!response.ok) throw new Error(`Drive list failed: ${response.status}`);
	const body = (await response.json()) as { files?: { id: string }[] };
	return body.files?.[0]?.id;
}

/** Returns the stored snapshot, or an empty object when no file exists yet. */
export async function readDriveSnapshot(token: string): Promise<Snapshot> {
	const fileId = await findFileId(token);
	if (!fileId) return {};
	const response = await fetch(`${FILES}/${fileId}?alt=media`, { headers: auth(token) });
	if (!response.ok) throw new Error(`Drive read failed: ${response.status}`);
	return (await response.json()) as Snapshot;
}

/** Creates or overwrites the snapshot file with the merged data. */
export async function writeDriveSnapshot(token: string, snapshot: Snapshot): Promise<void> {
	const fileId = await findFileId(token);
	const metadata = fileId ? {} : { name: FILE_NAME, parents: ["appDataFolder"] };

	const boundary = "enki-boundary";
	const body =
		`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
		`--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(snapshot)}\r\n--${boundary}--`;

	const url = fileId ? `${UPLOAD}/${fileId}?uploadType=multipart` : `${UPLOAD}?uploadType=multipart`;
	const response = await fetch(url, {
		method: fileId ? "PATCH" : "POST",
		headers: { ...auth(token), "Content-Type": `multipart/related; boundary=${boundary}` },
		body,
	});
	if (!response.ok) throw new Error(`Drive write failed: ${response.status}`);
}
