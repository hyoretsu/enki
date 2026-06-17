import { getExecutor } from "./executor";
import { now, uuid } from "./ids";
import type { SqlExecutor } from "./types";

// Local single-user mirror of the backend media/users use cases (CreateMedia, ListMedia,
// TrackMedia, GetStatistics) running against on-device SQLite. Shapes match what the routes
// and the generated SDK produced, so the UI is agnostic to where the data lives.

export type Category = "chapter" | "literary_work" | "movie" | "video" | "video_game";

interface MediaFilters {
	category?: Category | string;
	mediaId?: string[];
	title?: string;
}

type Json = Record<string, unknown>;

const parse = <T>(value: unknown, fallback: T): T => {
	if (typeof value !== "string") return fallback;
	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
};

/** Parses an ISO-8601 duration (e.g. `PT1H30M`) into seconds. */
export function isoToSeconds(iso: string | null | undefined): number | undefined {
	if (!iso) return undefined;
	const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
	if (!match) return undefined;
	const [, h, m, s] = match;
	return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

/** Splits a duration in seconds into `[days, hours, minutes, seconds]`, as the backend does. */
export function toParts(totalSeconds: number): number[] {
	let remaining = Math.max(0, Math.floor(totalSeconds));
	const days = Math.floor(remaining / 86400);
	remaining -= days * 86400;
	const hours = Math.floor(remaining / 3600);
	remaining -= hours * 3600;
	const minutes = Math.floor(remaining / 60);
	remaining -= minutes * 60;
	return [days, hours, minutes, remaining];
}

const num = (value: unknown): number | undefined =>
	value === null || value === undefined ? undefined : Number(value);

async function deepMedia(db: SqlExecutor, category: string, id: string): Promise<Json | undefined> {
	switch (category) {
		case "literary_work": {
			const [work] = await db.select<Json>(
				"SELECT * FROM literary_work WHERE id = ? AND deleted_at IS NULL",
				[id],
			);
			if (!work) return undefined;
			const chapters = await db.select<Json>(
				"SELECT id, title, number, pages, release_date AS releaseDate FROM literary_work_chapter WHERE source_id = ? AND deleted_at IS NULL ORDER BY number",
				[id],
			);
			return {
				id: work.id,
				category,
				title: parse(work.title, {}),
				synopsis: parse(work.synopsis, undefined),
				type: work.type,
				tags: parse(work.tags, [] as string[]),
				ongoing: Boolean(work.ongoing),
				releaseDate: work.release_date ?? null,
				chapters: chapters.map(c => ({ ...c, title: parse(c.title, undefined) })),
			};
		}
		case "movie": {
			const [movie] = await db.select<Json>("SELECT * FROM movie WHERE id = ? AND deleted_at IS NULL", [id]);
			if (!movie) return undefined;
			return {
				id: movie.id,
				category,
				title: parse(movie.title, {}),
				duration: movie.duration ?? null,
				releaseDate: movie.release_date ?? null,
			};
		}
		case "video": {
			const [video] = await db.select<Json>("SELECT * FROM video WHERE id = ? AND deleted_at IS NULL", [id]);
			if (!video) return undefined;
			return {
				id: video.id,
				category,
				title: parse(video.title, {}),
				link: video.link ?? null,
				duration: video.duration ?? null,
				releaseDate: video.release_date ?? null,
			};
		}
		default: {
			const [game] = await db.select<Json>(
				"SELECT * FROM video_game WHERE id = ? AND deleted_at IS NULL",
				[id],
			);
			if (!game) return undefined;
			const runs = await db.select<Json>(
				"SELECT id, name FROM video_game_run WHERE video_game_id = ? AND deleted_at IS NULL ORDER BY created_at",
				[id],
			);
			return {
				id: game.id,
				category,
				title: parse(game.title, {}),
				releaseDate: game.release_date ?? null,
				runs,
			};
		}
	}
}

const SHALLOW_TABLES: Record<string, string> = {
	literary_work: "literary_work",
	movie: "movie",
	video: "video",
	video_game: "video_game",
};

export async function listMedia(filters: MediaFilters = {}): Promise<Json[]> {
	const db = await getExecutor();

	if (filters.mediaId?.length && filters.category) {
		const results: Json[] = [];
		for (const id of filters.mediaId) {
			const media = await deepMedia(db, filters.category, id);
			if (media) results.push(media);
		}
		return results;
	}

	const categories = filters.category ? [filters.category] : Object.keys(SHALLOW_TABLES);
	const like = filters.title ? `%${filters.title}%` : undefined;
	const rows: Json[] = [];

	for (const category of categories) {
		const table = SHALLOW_TABLES[category];
		if (!table) continue;
		const where = ["deleted_at IS NULL"];
		const params: unknown[] = [];
		if (like) {
			where.push("title LIKE ?");
			params.push(like);
		}
		const found = await db.select<Json>(
			`SELECT id, title, release_date AS releaseDate FROM ${table} WHERE ${where.join(" AND ")} ORDER BY created_at DESC`,
			params,
		);
		for (const row of found) {
			rows.push({ id: row.id, category, title: parse(row.title, {}), releaseDate: row.releaseDate ?? null });
		}
	}

	return rows;
}

async function findChapter(
	db: SqlExecutor,
	sourceId: string,
	number: number,
): Promise<{ id: string } | undefined> {
	const [chapter] = await db.select<{ id: string }>(
		"SELECT id FROM literary_work_chapter WHERE source_id = ? AND number = ? AND deleted_at IS NULL",
		[sourceId, number],
	);
	return chapter;
}

export async function createMedia(data: Json): Promise<string> {
	const db = await getExecutor();
	const id = uuid();
	const timestamp = now();
	const category = data.category as Category;

	switch (category) {
		case "literary_work": {
			await db.execute(
				"INSERT INTO literary_work (id, title, synopsis, type, tags, release_date, ongoing, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[
					id,
					JSON.stringify(data.title ?? {}),
					data.synopsis ? JSON.stringify(data.synopsis) : null,
					String(data.type ?? "novel"),
					JSON.stringify(data.tags ?? []),
					(data.releaseDate as string) ?? null,
					data.ongoing === false ? 0 : 1,
					timestamp,
					timestamp,
				],
			);
			const currentChapters = Number(data.currentChapters) || 0;
			for (let n = 1; n <= currentChapters; n++) {
				await db.execute(
					"INSERT INTO literary_work_chapter (id, number, source_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
					[uuid(), n, id, timestamp, timestamp],
				);
			}
			return id;
		}
		case "chapter": {
			const sourceId = String(data.sourceId);
			const number = Number(data.number);
			const existing = await findChapter(db, sourceId, number);
			if (existing) return existing.id;
			await db.execute(
				"INSERT INTO literary_work_chapter (id, title, number, pages, release_date, source_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
				[
					id,
					data.title ? JSON.stringify(data.title) : null,
					number,
					num(data.pages) ?? null,
					(data.releaseDate as string) ?? null,
					sourceId,
					timestamp,
					timestamp,
				],
			);
			return id;
		}
		case "movie": {
			await db.execute(
				"INSERT INTO movie (id, title, duration, release_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[
					id,
					JSON.stringify(data.title ?? {}),
					isoToSeconds(data.duration as string) ?? null,
					(data.releaseDate as string) ?? null,
					timestamp,
					timestamp,
				],
			);
			return id;
		}
		case "video": {
			const link = String(data.link ?? "");
			await db.execute(
				"INSERT INTO video (id, title, link, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
				[id, JSON.stringify(data.title ?? { en: [link] }), link, timestamp, timestamp],
			);
			return id;
		}
		default: {
			await db.execute("INSERT INTO video_game (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)", [
				id,
				JSON.stringify(data.title ?? {}),
				timestamp,
				timestamp,
			]);
			return id;
		}
	}
}

async function ensureExists(db: SqlExecutor, table: string, id: string): Promise<boolean> {
	const [row] = await db.select<{ id: string }>(`SELECT id FROM ${table} WHERE id = ? AND deleted_at IS NULL`, [
		id,
	]);
	return Boolean(row);
}

export async function trackMedia(data: Json): Promise<void> {
	const db = await getExecutor();
	const id = uuid();
	const timestamp = now();
	const category = data.category as Category;
	const bookmarked = data.bookmarked ? 1 : 0;
	const when = (data.when as string) ?? (category === "video_game" ? null : new Date().toISOString());

	switch (category) {
		case "chapter": {
			const sourceId = String(data.mediaId);
			if (!(await ensureExists(db, "literary_work", sourceId))) {
				throw new Error("The work you want to track doesn't exist.");
			}
			const number = Number(data.number);
			let chapterId = (await findChapter(db, sourceId, number))?.id;
			if (!chapterId) {
				chapterId = await createMedia({
					category: "chapter",
					sourceId,
					number,
					pages: data.pages,
					releaseDate: data.releaseDate,
					title: data.title,
				});
			}
			await db.execute(
				"INSERT INTO user_chapter (id, chapter_id, when_at, time_spent, bookmarked, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[id, chapterId, when, isoToSeconds(data.timeSpent as string) ?? null, bookmarked, timestamp],
			);
			return;
		}
		case "movie": {
			const movieId = String(data.mediaId);
			if (!(await ensureExists(db, "movie", movieId))) {
				throw new Error("The movie you want to track doesn't exist.");
			}
			await db.execute(
				"INSERT INTO user_movie (id, movie_id, when_at, rating, bookmarked, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[id, movieId, when, num(data.rating) ?? null, bookmarked, timestamp],
			);
			return;
		}
		case "video": {
			let videoId: string | undefined;
			const link = data.link as string | undefined;
			if (link) {
				const [existing] = await db.select<{ id: string }>(
					"SELECT id FROM video WHERE link = ? AND deleted_at IS NULL",
					[link],
				);
				videoId = existing?.id ?? (await createMedia({ category: "video", link }));
			} else {
				videoId = data.mediaId as string;
			}
			await db.execute(
				"INSERT INTO user_video (id, video_id, when_at, progress, bookmarked, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
				[id, videoId, when, isoToSeconds(data.timeSpent as string) ?? null, bookmarked, timestamp],
			);
			return;
		}
		default: {
			const gameId = String(data.mediaId);
			if (!(await ensureExists(db, "video_game", gameId))) {
				throw new Error("The video game you want to track doesn't exist.");
			}
			// Unique per game: upsert so re-tracking updates the aggregate row.
			await db.execute(
				`INSERT INTO user_video_game (id, video_game_id, score, time_spent, offset, review, bookmarked, updated_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
				 ON CONFLICT(video_game_id) DO UPDATE SET
				   score = excluded.score,
				   time_spent = excluded.time_spent,
				   offset = excluded.offset,
				   review = excluded.review,
				   bookmarked = excluded.bookmarked,
				   updated_at = excluded.updated_at,
				   deleted_at = NULL`,
				[
					id,
					gameId,
					num(data.score) ?? null,
					isoToSeconds(data.timeSpent as string) ?? null,
					isoToSeconds(data.offset as string) ?? null,
					(data.review as string) ?? null,
					bookmarked,
					timestamp,
				],
			);
			return;
		}
	}
}

export async function createVideoGameRun(videoGameId: string, name = ""): Promise<string> {
	const db = await getExecutor();
	const id = uuid();
	const timestamp = now();
	await db.execute(
		"INSERT INTO video_game_run (id, name, video_game_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		[id, name, videoGameId, timestamp, timestamp],
	);
	return id;
}

export async function findVideoGameRuns(videoGameId: string): Promise<Json[]> {
	const db = await getExecutor();
	return db.select<Json>(
		"SELECT id, name FROM video_game_run WHERE video_game_id = ? AND deleted_at IS NULL ORDER BY created_at",
		[videoGameId],
	);
}

export async function trackRun(runId: string, timeSpent: string | null): Promise<void> {
	const db = await getExecutor();
	const timestamp = now();
	await db.execute(
		`INSERT INTO user_video_game_run (id, run_id, time_spent, updated_at) VALUES (?, ?, ?, ?)
		 ON CONFLICT(run_id) DO UPDATE SET time_spent = excluded.time_spent, updated_at = excluded.updated_at, deleted_at = NULL`,
		[uuid(), runId, isoToSeconds(timeSpent ?? undefined) ?? null, timestamp],
	);
}

export async function getStatistics(categories?: string[]): Promise<{ totalTime: number[] }> {
	const db = await getExecutor();
	const include = (category: string) => !categories || categories.includes(category);
	let seconds = 0;

	if (include("literary_work")) {
		const [row] = await db.select<{ total: number | null }>(
			`SELECT SUM(COALESCE(uc.time_spent, c.average_time, w.average_time)) AS total
			 FROM user_chapter uc
			 JOIN literary_work_chapter c ON c.id = uc.chapter_id
			 JOIN literary_work w ON w.id = c.source_id
			 WHERE uc.deleted_at IS NULL`,
		);
		seconds += Number(row?.total ?? 0);
	}
	if (include("movie")) {
		const [row] = await db.select<{ total: number | null }>(
			`SELECT SUM(m.duration) AS total FROM user_movie um
			 JOIN movie m ON m.id = um.movie_id WHERE um.deleted_at IS NULL`,
		);
		seconds += Number(row?.total ?? 0);
	}
	if (include("video")) {
		const [row] = await db.select<{ total: number | null }>(
			`SELECT SUM(COALESCE(uv.progress, v.duration)) AS total FROM user_video uv
			 JOIN video v ON v.id = uv.video_id WHERE uv.deleted_at IS NULL`,
		);
		seconds += Number(row?.total ?? 0);
	}
	if (include("video_game")) {
		const [row] = await db.select<{ total: number | null }>(
			`SELECT SUM(COALESCE(time_spent, 0) - COALESCE(offset, 0)) AS total
			 FROM user_video_game WHERE deleted_at IS NULL`,
		);
		seconds += Number(row?.total ?? 0);
	}

	return { totalTime: toParts(seconds) };
}
