-- Migrates a legacy enki database (PascalCase tables, BigInt TSID ids, password on "User")
-- to the Prisma Next schema (camelCase tables, UUID ids, Better Auth user/session/account tables).
--
-- Usage (in this order, against the legacy database):
--   1. bun run db:init    -- writes the Prisma Next marker
--   2. bun run migrate    -- creates the new (empty) Prisma Next tables alongside the legacy ones
--   3. bun run migrate:legacy
--
-- Legacy bcrypt password hashes are carried over into "account"."password"; Bun.password.verify
-- auto-detects bcrypt, so existing users keep their passwords.

BEGIN;

-- Old BigInt TSID -> new UUID maps
CREATE TEMP TABLE "map_user" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "User";
CREATE TEMP TABLE "map_literaryWork" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "LiteraryWork";
CREATE TEMP TABLE "map_literaryWorkChapter" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "LiteraryWorkChapter";
CREATE TEMP TABLE "map_movie" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "Movie";
CREATE TEMP TABLE "map_video" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "Video";
CREATE TEMP TABLE "map_videoChannel" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "VideoChannel";
CREATE TEMP TABLE "map_videoGame" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "VideoGame";
CREATE TEMP TABLE "map_videoPlaylist" ON COMMIT DROP AS
SELECT "id" AS "oldId", gen_random_uuid()::TEXT AS "newId" FROM "VideoPlaylist";

-- Users -> Better Auth "user" + credential "account" (carrying the bcrypt hash)
INSERT INTO "user" ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt")
SELECT m."newId", split_part(u."email", '@', 1), u."email", FALSE, NULL, u."createdAt", u."updatedAt"
FROM "User" u
JOIN "map_user" m ON m."oldId" = u."id";

INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
SELECT gen_random_uuid()::TEXT, m."newId", 'credential', m."newId", u."password", u."createdAt", u."updatedAt"
FROM "User" u
JOIN "map_user" m ON m."oldId" = u."id"
WHERE u."password" IS NOT NULL;

-- Media
INSERT INTO "literaryWork"
	("id", "title", "synopsis", "type", "tags", "releaseDate", "averageTime", "ongoing", "createdAt", "updatedAt")
SELECT m."newId", lw."title", lw."synopsis", lw."type", to_jsonb(lw."tags"), lw."releaseDate", lw."averageTime",
	lw."ongoing", lw."createdAt", lw."updatedAt"
FROM "LiteraryWork" lw
JOIN "map_literaryWork" m ON m."oldId" = lw."id";

INSERT INTO "literaryWorkChapter"
	("id", "title", "number", "releaseDate", "pages", "averageTime", "sourceId", "createdAt", "updatedAt")
SELECT m."newId", lwc."title", lwc."number"::FLOAT8, lwc."releaseDate", lwc."pages", lwc."averageTime",
	ms."newId", lwc."createdAt", lwc."updatedAt"
FROM "LiteraryWorkChapter" lwc
JOIN "map_literaryWorkChapter" m ON m."oldId" = lwc."id"
JOIN "map_literaryWork" ms ON ms."oldId" = lwc."sourceId";

INSERT INTO "movie" ("id", "title", "duration", "releaseDate", "createdAt", "updatedAt")
SELECT m."newId", mv."title", mv."duration", mv."releaseDate", mv."createdAt", mv."updatedAt"
FROM "Movie" mv
JOIN "map_movie" m ON m."oldId" = mv."id";

INSERT INTO "videoChannel" ("id", "name", "link", "externalId", "createdAt", "updatedAt")
SELECT m."newId", vc."name", vc."link", vc."externalId", vc."createdAt", vc."updatedAt"
FROM "VideoChannel" vc
JOIN "map_videoChannel" m ON m."oldId" = vc."id";

INSERT INTO "videoPlaylist" ("id", "title", "link", "channelId", "createdAt", "updatedAt")
SELECT m."newId", vp."title", vp."link", mc."newId", vp."createdAt", vp."updatedAt"
FROM "VideoPlaylist" vp
JOIN "map_videoPlaylist" m ON m."oldId" = vp."id"
LEFT JOIN "map_videoChannel" mc ON mc."oldId" = vp."channelId";

INSERT INTO "video"
	("id", "title", "link", "releaseDate", "duration", "channelId", "playlistId", "createdAt", "updatedAt")
SELECT m."newId", v."title", v."link", v."releaseDate", v."duration"::INT4, mc."newId", mp."newId",
	v."createdAt", v."updatedAt"
FROM "Video" v
JOIN "map_video" m ON m."oldId" = v."id"
JOIN "map_videoChannel" mc ON mc."oldId" = v."channelId"
LEFT JOIN "map_videoPlaylist" mp ON mp."oldId" = v."playlistId";

INSERT INTO "videoGame" ("id", "title", "releaseDate", "createdAt", "updatedAt")
SELECT m."newId", vg."title", vg."releaseDate", vg."createdAt", vg."updatedAt"
FROM "VideoGame" vg
JOIN "map_videoGame" m ON m."oldId" = vg."id";

-- Tracking
INSERT INTO "userChapter" ("id", "userId", "chapterId", "when", "timeSpent", "bookmarked")
SELECT gen_random_uuid()::TEXT, mu."newId", mc."newId", uc."when", uc."timeSpent", uc."bookmarked"
FROM "UserChapter" uc
JOIN "map_user" mu ON mu."oldId" = uc."userId"
JOIN "map_literaryWorkChapter" mc ON mc."oldId" = uc."chapterId";

INSERT INTO "userMovie" ("id", "userId", "movieId", "progress", "when", "rating", "bookmarked")
SELECT gen_random_uuid()::TEXT, mu."newId", mm."newId", um."progress", um."when", um."rating"::FLOAT8,
	um."bookmarked"
FROM "UserMovie" um
JOIN "map_user" mu ON mu."oldId" = um."userId"
JOIN "map_movie" mm ON mm."oldId" = um."movieId";

INSERT INTO "userVideo" ("id", "userId", "videoId", "when", "progress", "bookmarked")
SELECT gen_random_uuid()::TEXT, mu."newId", mv."newId", uv."when", uv."progress"::INT4, uv."bookmarked"
FROM "UserVideo" uv
JOIN "map_user" mu ON mu."oldId" = uv."userId"
JOIN "map_video" mv ON mv."oldId" = uv."videoId";

INSERT INTO "userVideoGame" ("id", "userId", "videoGameId", "score", "timeSpent", "offset", "bookmarked")
SELECT gen_random_uuid()::TEXT, mu."newId", mg."newId", uvg."score"::FLOAT8, uvg."timeSpent"::INT4,
	uvg."offset", uvg."bookmarked"
FROM "UserVideoGame" uvg
JOIN "map_user" mu ON mu."oldId" = uvg."userId"
JOIN "map_videoGame" mg ON mg."oldId" = uvg."videoGameId";

-- Drop the legacy schema (view + triggers fall with their tables)
DROP MATERIALIZED VIEW IF EXISTS "EntertainmentMedia";
DROP VIEW IF EXISTS "EntertainmentMedia";
DROP TABLE IF EXISTS "UserChapter", "UserMovie", "UserVideo", "UserVideoGame" CASCADE;
DROP TABLE IF EXISTS "Video", "VideoPlaylist", "VideoChannel", "VideoGame", "Movie",
	"LiteraryWorkChapter", "LiteraryWork", "User" CASCADE;
DROP TABLE IF EXISTS "_prisma_migrations";
DROP FUNCTION IF EXISTS get_media_info(TEXT);
DROP FUNCTION IF EXISTS create_chapters(TEXT, INT);
DROP FUNCTION IF EXISTS read_work(TEXT, TEXT);
DROP FUNCTION IF EXISTS mass_bookmark(TEXT, TEXT, INT[]);
DROP FUNCTION IF EXISTS updated_at() CASCADE;
DROP FUNCTION IF EXISTS generate_tsid(TEXT) CASCADE;

COMMIT;
