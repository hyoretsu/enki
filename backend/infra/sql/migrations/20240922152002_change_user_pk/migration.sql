ALTER TABLE "UserChapter" DROP CONSTRAINT "UserChapter_email_fkey";
ALTER TABLE "UserMovie" DROP CONSTRAINT "UserMovie_email_fkey";
ALTER TABLE "UserVideo" DROP CONSTRAINT "UserVideo_email_fkey";

ALTER TABLE "User"
    DROP CONSTRAINT "User_pkey",
    ADD COLUMN "id" BIGINT NOT NULL DEFAULT generate_tsid('User'),
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

ALTER TABLE "UserChapter" ADD COLUMN "userId" BIGINT;
ALTER TABLE "UserMovie" ADD COLUMN "userId" BIGINT;
ALTER TABLE "UserVideo" ADD COLUMN "userId" BIGINT;

UPDATE "UserChapter" SET "userId" = (SELECT "id" FROM "User" WHERE "email" = "UserChapter"."email");
UPDATE "UserMovie" SET "userId" = (SELECT "id" FROM "User" WHERE "email" = "UserMovie"."email");
UPDATE "UserVideo" SET "userId" = (SELECT "id" FROM "User" WHERE "email" = "UserVideo"."email");

ALTER TABLE "UserChapter"
    DROP CONSTRAINT "UserChapter_pkey",
    DROP COLUMN "email",
    ALTER COLUMN "userId" SET NOT NULL,
    ADD CONSTRAINT "UserChapter_pkey" PRIMARY KEY ("userId", "chapterId"),
    ADD CONSTRAINT "UserChapter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserMovie"
    DROP CONSTRAINT "UserMovie_pkey",
    DROP COLUMN "email",
    ALTER COLUMN "userId" SET NOT NULL,
    ADD CONSTRAINT "UserMovie_pkey" PRIMARY KEY ("userId", "movieId"),
    ADD CONSTRAINT "UserMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserVideo"
    DROP CONSTRAINT "UserVideo_pkey",
    DROP COLUMN "email",
    ALTER COLUMN "userId" SET NOT NULL,
    ADD CONSTRAINT "UserVideo_pkey" PRIMARY KEY ("userId", "videoId"),
    ADD CONSTRAINT "UserVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP FUNCTION IF EXISTS mass_bookmark(TEXT, BIGINT, INT[]);

CREATE OR REPLACE FUNCTION mass_bookmark(user_id BIGINT, work_id BIGINT, chapters INT[])
    RETURNS VOID AS
$$
BEGIN
    UPDATE "UserChapter"
    SET "bookmarked" = TRUE
    WHERE "userId" = user_id
      AND "chapterId" IN (SELECT "id"
                          FROM "LiteraryWorkChapter"
                          WHERE "sourceId" = work_id
                            AND "number" = ANY (chapters));
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS read_work(TEXT, BIGINT);

CREATE OR REPLACE FUNCTION read_work(user_id BIGINT, work_id BIGINT)
    RETURNS VOID AS
$$
DECLARE
    chapter RECORD;
BEGIN
    FOR chapter IN
        SELECT * FROM "LiteraryWorkChapter" WHERE "sourceId" = work_id
        LOOP
            INSERT INTO "UserChapter" ("userId", "chapterId")
            VALUES (user_id, chapter."id");
        END LOOP;
END;
$$ LANGUAGE plpgsql;

