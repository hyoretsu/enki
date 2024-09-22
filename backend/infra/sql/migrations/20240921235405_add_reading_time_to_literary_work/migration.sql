ALTER TABLE "LiteraryWork" ADD COLUMN "averageTime" SMALLINT;

CREATE OR REPLACE FUNCTION update_literary_work_chapter_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "LiteraryWorkChapter"
    SET "readingTime" = (SELECT FLOOR(AVG("timeSpent")) FROM "UserChapter" WHERE "chapterId" = NEW."chapterId")
    WHERE id = NEW."chapterId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_lwc_reading_time
AFTER INSERT OR UPDATE ON "UserChapter"
FOR EACH ROW EXECUTE FUNCTION update_literary_work_chapter_reading_time();

CREATE OR REPLACE FUNCTION update_literary_work_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "LiteraryWork"
    SET "averageTime" = (SELECT FLOOR(AVG("readingTime")) FROM "LiteraryWorkChapter" WHERE "sourceId" = NEW."sourceId")
    WHERE id = NEW."sourceId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_lw_reading_time
AFTER UPDATE ON "LiteraryWorkChapter"
FOR EACH ROW EXECUTE FUNCTION update_literary_work_reading_time();
