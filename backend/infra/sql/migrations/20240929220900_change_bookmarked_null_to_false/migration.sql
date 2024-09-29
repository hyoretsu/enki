DROP TRIGGER literary_work_refresh ON "LiteraryWork";

UPDATE "UserChapter" SET "bookmarked" = false WHERE "bookmarked" IS NULL;

CREATE TRIGGER literary_work_refresh
AFTER INSERT OR UPDATE ON "LiteraryWork"
EXECUTE FUNCTION update_entertainment_media();

UPDATE "UserMovie" SET "bookmarked" = false WHERE "bookmarked" IS NULL;
UPDATE "UserVideo" SET "bookmarked" = false WHERE "bookmarked" IS NULL;
UPDATE "UserVideoGame" SET "bookmarked" = false WHERE "bookmarked" IS NULL;

ALTER TABLE "UserChapter" ALTER COLUMN "bookmarked" SET NOT NULL,
ALTER COLUMN "bookmarked" SET DEFAULT false;

ALTER TABLE "UserMovie" ALTER COLUMN "bookmarked" SET NOT NULL,
ALTER COLUMN "bookmarked" SET DEFAULT false;

ALTER TABLE "UserVideo" ALTER COLUMN "bookmarked" SET NOT NULL,
ALTER COLUMN "bookmarked" SET DEFAULT false;

ALTER TABLE "UserVideoGame" ALTER COLUMN "bookmarked" SET NOT NULL,
ALTER COLUMN "bookmarked" SET DEFAULT false;
