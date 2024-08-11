CREATE OR REPLACE FUNCTION create_chapters(work_id TEXT, chapter_count INT)
RETURNS VOID AS $$
DECLARE
    work RECORD;
    i SMALLINT;
BEGIN
    SELECT * INTO work FROM "LiteraryWork" WHERE "id" = work_id::UUID;

    FOR i IN 1..chapter_count LOOP
        INSERT INTO "LiteraryWorkChapter" ("sourceId", "number", "pages", "readingTime")
        VALUES (work_id::UUID, i, work."pages", work."readingTime");
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION read_work(user_email TEXT, work_id TEXT)
RETURNS VOID AS $$
DECLARE
    chapter RECORD;
BEGIN
    FOR chapter IN
        SELECT * FROM "LiteraryWorkChapter" WHERE "sourceId" = work_id::UUID
    LOOP
        INSERT INTO "UserChapter" ("userEmail", "chapterId")
        VALUES (user_email, chapter."id");
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION mass_bookmark(user_email TEXT, work_id TEXT, chapters INT[])
RETURNS VOID AS $$
BEGIN
    UPDATE "UserChapter"
    SET "bookmarked" = TRUE
    WHERE "userEmail" = user_email AND
    "chapterId" IN (
        SELECT "id"
        FROM "LiteraryWorkChapter"
        WHERE "sourceId" = work_id::UUID AND
        "number" = ANY(chapters)
    );
END;
$$ LANGUAGE plpgsql;
