/*
  Warnings:

  - Made the column `sourceId` on table `LiteraryWorkChapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `channelId` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/

-- AlterTable
ALTER TABLE "LiteraryWorkChapter" ALTER COLUMN "sourceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "duration" SET DATA TYPE BIGINT,
ALTER COLUMN "channelId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Movie" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('Movie'),
    "title" JSONB NOT NULL,
    "duration" INTEGER,
    "releaseDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "duration_valid" CHECK ("duration" >= 0)
);

-- CreateTable
CREATE TABLE "UserMovie" (
    "email" VARCHAR(320) NOT NULL,
    "movieId" BIGINT NOT NULL,
    "when" TIMESTAMPTZ,
    "rating" DECIMAL(2,1),
    "bookmarked" BOOLEAN,

    CONSTRAINT "UserMovie_pkey" PRIMARY KEY ("email","movieId"),
	CONSTRAINT "rating_valid" CHECK ("rating" >= 0 AND "rating" <= 10)
);

-- RenameForeignKey
ALTER TABLE "UserChapter" RENAME CONSTRAINT "UserChapter_userEmail_fkey" TO "UserChapter_email_fkey";

-- RenameForeignKey
ALTER TABLE "UserVideo" RENAME CONSTRAINT "UserVideo_userEmail_fkey" TO "UserVideo_email_fkey";

-- AddForeignKey
ALTER TABLE "UserMovie" ADD CONSTRAINT "UserMovie_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMovie" ADD CONSTRAINT "UserMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
