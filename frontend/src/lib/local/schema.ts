// On-device SQLite schema, mirroring the backend Prisma models (packages/sql) but for a
// single local user. Every table carries sync metadata: `updated_at` (epoch ms) drives
// last-write-wins conflict resolution and `deleted_at` is a tombstone so deletions
// propagate through two-way Google Drive sync instead of silently reappearing.

export const SCHEMA_STATEMENTS: string[] = [
	`CREATE TABLE IF NOT EXISTS literary_work (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		synopsis TEXT,
		type TEXT NOT NULL,
		tags TEXT NOT NULL DEFAULT '[]',
		release_date TEXT,
		average_time INTEGER,
		ongoing INTEGER NOT NULL DEFAULT 1,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS literary_work_chapter (
		id TEXT PRIMARY KEY,
		title TEXT,
		number REAL NOT NULL,
		release_date TEXT,
		pages INTEGER,
		average_time INTEGER,
		source_id TEXT NOT NULL,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER,
		UNIQUE (source_id, number)
	)`,
	`CREATE TABLE IF NOT EXISTS movie (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		duration INTEGER,
		release_date TEXT,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS video_channel (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		link TEXT,
		external_id TEXT,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS video_playlist (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		link TEXT,
		channel_id TEXT,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS video (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		link TEXT,
		release_date TEXT,
		duration INTEGER,
		channel_id TEXT,
		playlist_id TEXT,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS video_game (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		release_date TEXT,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS video_game_playthrough (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL DEFAULT '',
		video_game_id TEXT NOT NULL,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS user_chapter (
		id TEXT PRIMARY KEY,
		chapter_id TEXT NOT NULL,
		when_at TEXT,
		time_spent INTEGER,
		bookmarked INTEGER NOT NULL DEFAULT 0,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS user_movie (
		id TEXT PRIMARY KEY,
		movie_id TEXT NOT NULL,
		progress INTEGER,
		when_at TEXT,
		rating REAL,
		bookmarked INTEGER NOT NULL DEFAULT 0,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS user_video (
		id TEXT PRIMARY KEY,
		video_id TEXT NOT NULL,
		when_at TEXT,
		progress INTEGER,
		bookmarked INTEGER NOT NULL DEFAULT 0,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS user_video_game (
		id TEXT PRIMARY KEY,
		video_game_id TEXT NOT NULL UNIQUE,
		score REAL,
		time_spent INTEGER,
		play_offset INTEGER,
		review TEXT,
		bookmarked INTEGER NOT NULL DEFAULT 0,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
	`CREATE TABLE IF NOT EXISTS user_video_game_playthrough (
		id TEXT PRIMARY KEY,
		playthrough_id TEXT NOT NULL UNIQUE,
		time_spent INTEGER,
		updated_at INTEGER NOT NULL,
		deleted_at INTEGER
	)`,
];

/** Tables that participate in Drive sync, in dependency order (parents before children). */
export const SYNC_TABLES = [
	"literary_work",
	"literary_work_chapter",
	"movie",
	"video_channel",
	"video_playlist",
	"video",
	"video_game",
	"video_game_playthrough",
	"user_chapter",
	"user_movie",
	"user_video",
	"user_video_game",
	"user_video_game_playthrough",
] as const;

export type SyncTable = (typeof SYNC_TABLES)[number];
