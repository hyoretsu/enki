ALTER TABLE "Video" ADD COLUMN "title_j" JSONB;

UPDATE "Video" SET "title_j" = jsonb_build_object('pt', jsonb_build_array("title"));

ALTER TABLE "Video" DROP COLUMN "title", ALTER COLUMN "title_j" SET NOT NULL;
ALTER TABLE "Video" RENAME COLUMN "title_j" TO "title";
