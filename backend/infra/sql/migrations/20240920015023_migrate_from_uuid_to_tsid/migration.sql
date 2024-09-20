CREATE OR REPLACE FUNCTION generate_tsid(table_name TEXT) RETURNS BIGINT AS
$$
DECLARE
    C_MILLI_PREC          BIGINT := 10 ^ 3;
    C_RANDOM_LEN          BIGINT := 2 ^ 12;
    C_TSID_EPOCH          BIGINT := 1726790400; -- 2024-01-01 00:00:00

    C_TIMESTAMP_COMPONENT BIGINT := floor((extract('epoch' from clock_timestamp()) - C_TSID_EPOCH) * C_MILLI_PREC);
    C_RANDOM_COMPONENT    BIGINT := floor(random() * C_RANDOM_LEN);
    C_COUNTER_COMPONENT   BIGINT;
    seq_name              TEXT;
BEGIN
    seq_name := table_name || '_tsid_seq';

    -- Check if the sequence already exists
    IF NOT EXISTS (SELECT 1
                   FROM pg_catalog.pg_sequences
                   WHERE sequencename = seq_name
                     AND schemaname = 'public') THEN
        -- Create the sequence if it doesn't exist
        EXECUTE format('CREATE SEQUENCE %I MAXVALUE 1024 AS SMALLINT CYCLE', seq_name);
    END IF;

    EXECUTE format('SELECT nextval(%L)', 'public."' || seq_name || '"') INTO C_COUNTER_COMPONENT;

    C_COUNTER_COMPONENT := C_COUNTER_COMPONENT - 1;

    RETURN ((C_TIMESTAMP_COMPONENT << 22) | (C_RANDOM_COMPONENT << 10) | C_COUNTER_COMPONENT);
END
$$ LANGUAGE plpgsql;

-- Step 1: Add Temporary Columns for TSID
ALTER TABLE "LiteraryWork" ADD COLUMN "id_bigint" BIGINT NOT NULL DEFAULT generate_tsid('LiteraryWork');
ALTER TABLE "LiteraryWorkChapter" ADD COLUMN "id_bigint" BIGINT NOT NULL DEFAULT generate_tsid('LiteraryWorkChapter');
ALTER TABLE "LiteraryWorkChapter" ADD COLUMN "sourceId_bigint" BIGINT;
ALTER TABLE "UserChapter" ADD COLUMN "chapterId_bigint" BIGINT;
ALTER TABLE "VideoChannel" ADD COLUMN "id_bigint" BIGINT NOT NULL DEFAULT generate_tsid('VideoChannel');
ALTER TABLE "VideoPlaylist" ADD COLUMN "id_bigint" BIGINT NOT NULL DEFAULT generate_tsid('VideoPlaylist');
ALTER TABLE "VideoPlaylist" ADD COLUMN "channelId_bigint" BIGINT;
ALTER TABLE "Video" ADD COLUMN "id_bigint" BIGINT NOT NULL DEFAULT generate_tsid('Video');
ALTER TABLE "Video" ADD COLUMN "channelId_bigint" BIGINT;
ALTER TABLE "Video" ADD COLUMN "playlistId_bigint" BIGINT;
ALTER TABLE "UserVideo" ADD COLUMN "videoId_bigint" BIGINT;

-- Step 2: Update Foreign Key References
UPDATE "LiteraryWorkChapter" SET "sourceId_bigint" = (SELECT "id_bigint" FROM "LiteraryWork" WHERE "id" = "LiteraryWorkChapter"."sourceId");
UPDATE "UserChapter" SET "chapterId_bigint" = (SELECT "id_bigint" FROM "LiteraryWorkChapter" WHERE "id" = "UserChapter"."chapterId");
UPDATE "VideoPlaylist" SET "channelId_bigint" = (SELECT "id_bigint" FROM "VideoChannel" WHERE "id" = "VideoPlaylist"."channelId");
UPDATE "Video" SET "channelId_bigint" = (SELECT "id_bigint" FROM "VideoChannel" WHERE "id" = "Video"."channelId");
UPDATE "Video" SET "playlistId_bigint" = (SELECT "id_bigint" FROM "VideoPlaylist" WHERE "id" = "Video"."playlistId");
UPDATE "UserVideo" SET "videoId_bigint" = (SELECT "id_bigint" FROM "Video" WHERE "id" = "UserVideo"."videoId");

-- Step 3: Drop old UUID Columns
ALTER TABLE "UserChapter"
	DROP CONSTRAINT "UserChapter_chapterId_fkey",
	DROP CONSTRAINT "UserChapter_pkey",
	DROP COLUMN "chapterId";

ALTER TABLE "LiteraryWorkChapter"
	DROP CONSTRAINT "LiteraryWorkChapter_pkey",
	DROP CONSTRAINT "LiteraryWorkChapter_sourceId_fkey",
	DROP COLUMN "id",
	DROP COLUMN "sourceId";

ALTER TABLE "LiteraryWork"
	DROP CONSTRAINT "LiteraryWork_pkey",
	DROP COLUMN "id";

ALTER TABLE "UserVideo"
	DROP CONSTRAINT "UserVideo_videoId_fkey",
	DROP CONSTRAINT "UserVideo_pkey",
	DROP COLUMN "videoId";

ALTER TABLE "Video"
	DROP CONSTRAINT "Video_channelId_fkey",
	DROP CONSTRAINT "Video_playlistId_fkey",
	DROP CONSTRAINT "Video_pkey",
	DROP COLUMN "id",
	DROP COLUMN "channelId",
	DROP COLUMN "playlistId";

ALTER TABLE "VideoPlaylist"
	DROP CONSTRAINT "VideoPlaylist_channelId_fkey",
	DROP CONSTRAINT "VideoPlaylist_pkey",
	DROP COLUMN "id",
	DROP COLUMN "channelId";

ALTER TABLE "VideoChannel"
	DROP CONSTRAINT "VideoChannel_pkey",
	DROP COLUMN "id";

-- Step 4: Rename new TSID columns and re-add FK's
ALTER TABLE "LiteraryWork" RENAME COLUMN "id_bigint" TO "id";
ALTER TABLE "LiteraryWork" ADD CONSTRAINT "LiteraryWork_pkey" PRIMARY KEY ("id");

ALTER TABLE "LiteraryWorkChapter" RENAME COLUMN "id_bigint" TO "id";
ALTER TABLE "LiteraryWorkChapter" RENAME COLUMN "sourceId_bigint" TO "sourceId";
ALTER TABLE "LiteraryWorkChapter"
	ADD CONSTRAINT "LiteraryWorkChapter_pkey" PRIMARY KEY ("id"),
	ADD CONSTRAINT "LiteraryWorkChapter_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "LiteraryWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserChapter" RENAME COLUMN "chapterId_bigint" TO "chapterId";
ALTER TABLE "UserChapter"
	ADD CONSTRAINT "UserChapter_pkey" PRIMARY KEY ("userEmail", "chapterId"),
	ADD CONSTRAINT "UserChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "LiteraryWorkChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VideoChannel" RENAME COLUMN "id_bigint" TO "id";
ALTER TABLE "VideoChannel" ADD CONSTRAINT "VideoChannel_pkey" PRIMARY KEY ("id");

ALTER TABLE "VideoPlaylist" RENAME COLUMN "id_bigint" TO "id";
ALTER TABLE "VideoPlaylist" RENAME COLUMN "channelId_bigint" TO "channelId";
ALTER TABLE "VideoPlaylist"
	ADD CONSTRAINT "VideoPlaylist_pkey" PRIMARY KEY ("id"),
	ADD CONSTRAINT "VideoPlaylist_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "VideoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Video" RENAME COLUMN "id_bigint" TO "id";
ALTER TABLE "Video" RENAME COLUMN "channelId_bigint" TO "channelId";
ALTER TABLE "Video" RENAME COLUMN "playlistId_bigint" TO "playlistId";
ALTER TABLE "Video"
	ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("id"),
	ADD CONSTRAINT "Video_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "VideoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT "Video_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "VideoPlaylist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "UserVideo"
	RENAME COLUMN "videoId_bigint" TO "videoId";
ALTER TABLE "UserVideo"
	ADD CONSTRAINT "UserVideo_pkey" PRIMARY KEY ("userEmail", "videoId"),
	ADD CONSTRAINT "UserVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP FUNCTION IF EXISTS create_chapters(TEXT, INT);
DROP FUNCTION IF EXISTS read_work(TEXT, TEXT);
DROP FUNCTION IF EXISTS mass_bookmark(TEXT, TEXT, INT[]);

CREATE OR REPLACE FUNCTION create_chapters(work_id BIGINT, chapter_count INT)
    RETURNS VOID AS
$$
DECLARE
    work RECORD;
    i    SMALLINT;
BEGIN
    SELECT * INTO work FROM "LiteraryWork" WHERE "id" = work_id;

    FOR i IN 1..chapter_count
        LOOP
            INSERT INTO "LiteraryWorkChapter" ("sourceId", "number")
            VALUES (work_id, i);
        END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_work(user_email TEXT, work_id BIGINT)
    RETURNS VOID AS
$$
DECLARE
    chapter RECORD;
BEGIN
    FOR chapter IN
        SELECT * FROM "LiteraryWorkChapter" WHERE "sourceId" = work_id
        LOOP
            INSERT INTO "UserChapter" ("userEmail", "chapterId")
            VALUES (user_email, chapter."id");
        END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION mass_bookmark(user_email TEXT, work_id BIGINT, chapters INT[])
    RETURNS VOID AS
$$
BEGIN
    UPDATE "UserChapter"
    SET "bookmarked" = TRUE
    WHERE "userEmail" = user_email
      AND "chapterId" IN (SELECT "id"
                          FROM "LiteraryWorkChapter"
                          WHERE "sourceId" = work_id
                            AND "number" = ANY (chapters));
END;
$$ LANGUAGE plpgsql;
