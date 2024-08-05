-- CreateTable
CREATE TABLE "LiteraryWork" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "names" JSONB NOT NULL,
    "type" VARCHAR(16) NOT NULL,
    "tags" VARCHAR(30)[],
    "ongoing" BOOLEAN NOT NULL DEFAULT true,
    "pages" SMALLINT,
    "dialogDensity" VARCHAR(9),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiteraryWork_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "dialogDensity_valid" CHECK ("dialogDensity" IS NOT NULL AND "type" IN ('comics','graphic_novel','manga','manhua','manhwa')),
	CONSTRAINT "dialogDensity_value" CHECK ("dialogDensity" IN ('low', 'medium', 'high', 'very_high')),
	CONSTRAINT "type_chk" CHECK (
		"type" IN (
			'article',
			'biography',
			'comics',
			'diary',
			'epic',
			'essay',
			'flash_fiction',
			'graphic_novel',
			'journal',
			'light_novel',
			'manga',
			'manhua',
			'manhwa',
			'memoir',
			'novel',
			'novelette',
			'novella',
			'poetry',
			'script',
			'short_story',
			'web_novel'
		)
	)
);
CREATE OR REPLACE FUNCTION literary_work_name_validation()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (
        NEW."names" ? 'original' AND
        jsonb_typeof(NEW."names"->'original') = 'string'
    ) THEN
        RAISE EXCEPTION 'Validation error: names';
    END IF;

    IF NEW."names" ? 'alternative' THEN
        IF jsonb_typeof(NEW."names"->'alternative') <> 'array' THEN
            RAISE EXCEPTION 'Validation error: names';
        END IF;
        FOR i IN 0 .. jsonb_array_length(NEW."names"->'alternative') - 1 LOOP
            IF jsonb_typeof(NEW."names"->'alternative'->i) <> 'string' THEN
                RAISE EXCEPTION 'Validation error: names';
            END IF;
        END LOOP;
    END IF;

    IF NEW."names" ? 'english' THEN
        IF jsonb_typeof(NEW."names"->'english') <> 'string' THEN
            RAISE EXCEPTION 'Validation error: names';
        END IF;
    END IF;

    IF NEW."names" ? 'romanized' THEN
        IF jsonb_typeof(NEW."names"->'romanized') <> 'string' THEN
            RAISE EXCEPTION 'Validation error: names';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER name_validation
BEFORE INSERT OR UPDATE ON "LiteraryWork"
FOR EACH ROW
EXECUTE FUNCTION literary_work_name_validation();
