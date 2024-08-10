-- CreateTable
CREATE TABLE "LiteraryWorkChapter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" JSONB,
	"number" SMALLINT,
	"releaseDate" DATE,
    "pages" SMALLINT,
    "readingTime" SMALLINT,
    "sourceId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiteraryWorkChapter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiteraryWorkChapter" ADD CONSTRAINT "LiteraryWorkChapter_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "LiteraryWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION literary_work_chapter_default_values()
RETURNS TRIGGER AS $$
DECLARE
    source RECORD;
BEGIN
	SELECT * INTO source FROM "LiteraryWork" WHERE "id" = NEW."sourceId";

    IF NEW."pages" IS NULL AND source."pages" IS NOT NULL THEN
        NEW."pages" := source."pages";
    END IF;

    IF NEW."readingTime" IS NULL AND source."readingTime" IS NOT NULL THEN
        NEW."readingTime" := source."readingTime";
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER default_values
BEFORE INSERT ON "LiteraryWorkChapter"
FOR EACH ROW
EXECUTE FUNCTION literary_work_chapter_default_values();
