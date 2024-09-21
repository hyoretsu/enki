ALTER TABLE "LiteraryWork" RENAME COLUMN "names" TO "title";

DROP TRIGGER name_validation ON "LiteraryWork";
DROP FUNCTION literary_work_name_validation();
