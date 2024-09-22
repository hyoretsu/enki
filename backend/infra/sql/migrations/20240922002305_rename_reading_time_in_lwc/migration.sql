ALTER TABLE "LiteraryWorkChapter" RENAME COLUMN "readingTime"TO "averageTime";

CREATE OR REPLACE FUNCTION update_literary_work_chapter_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "LiteraryWorkChapter"
    SET "averageTime" = (SELECT FLOOR(AVG("timeSpent")) FROM "UserChapter" WHERE "chapterId" = NEW."chapterId")
    WHERE id = NEW."chapterId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_literary_work_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "LiteraryWork"
    SET "averageTime" = (SELECT FLOOR(AVG("averageTime")) FROM "LiteraryWorkChapter" WHERE "sourceId" = NEW."sourceId")
    WHERE id = NEW."sourceId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
