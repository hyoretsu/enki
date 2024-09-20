ALTER TABLE "UserChapter" RENAME COLUMN "userEmail" TO "email";
ALTER TABLE "UserVideo" RENAME COLUMN "userEmail" TO "email";

CREATE OR REPLACE FUNCTION read_work(user_email TEXT, work_id BIGINT)
    RETURNS VOID AS
$$
DECLARE
    chapter RECORD;
BEGIN
    FOR chapter IN
        SELECT * FROM "LiteraryWorkChapter" WHERE "sourceId" = work_id
        LOOP
            INSERT INTO "UserChapter" ("email", "chapterId")
            VALUES (user_email, chapter."id");
        END LOOP;
END;
$$ LANGUAGE plpgsql;
