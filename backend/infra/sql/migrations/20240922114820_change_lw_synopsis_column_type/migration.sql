ALTER TABLE "LiteraryWork" ADD COLUMN     "synopsis_j" JSONB;

UPDATE "LiteraryWork"
SET "synopsis_j" = jsonb_build_object('en', jsonb_build_array("synopsis"));

ALTER TABLE "LiteraryWork" DROP COLUMN "synopsis";
ALTER TABLE "LiteraryWork" RENAME COLUMN "synopsis_j" TO "synopsis";
