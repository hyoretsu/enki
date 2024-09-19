/*
  Warnings:

  - You are about to drop the column `pages` on the `LiteraryWork` table. All the data in the column will be lost.
  - You are about to drop the column `readingTime` on the `LiteraryWork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LiteraryWork" DROP COLUMN "pages",
DROP COLUMN "readingTime";

CREATE OR REPLACE FUNCTION create_chapters(work_id TEXT, chapter_count INT)
RETURNS VOID AS $$
DECLARE
    work RECORD;
    i SMALLINT;
BEGIN
    SELECT * INTO work FROM "LiteraryWork" WHERE "id" = work_id::UUID;

    FOR i IN 1..chapter_count LOOP
        INSERT INTO "LiteraryWorkChapter" ("sourceId", "number")
        VALUES (work_id::UUID, i);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS default_values ON "LiteraryWorkChapter";
DROP FUNCTION IF EXISTS literary_work_chapter_default_values();

-- AlterTable
ALTER TABLE "UserVideo" ALTER COLUMN "watchTime" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "duration" SET DATA TYPE INTEGER;
