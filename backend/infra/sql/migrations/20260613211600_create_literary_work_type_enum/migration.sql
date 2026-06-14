CREATE TYPE "LiteraryWorkType" AS ENUM (
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
	'web_novel',
	'webtoon'
);

ALTER TABLE "LiteraryWork" ALTER COLUMN "type" TYPE "LiteraryWorkType" USING "type"::"LiteraryWorkType";
