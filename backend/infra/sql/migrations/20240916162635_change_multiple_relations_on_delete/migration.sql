-- DropForeignKey
ALTER TABLE "LiteraryWorkChapter" DROP CONSTRAINT "LiteraryWorkChapter_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "UserChapter" DROP CONSTRAINT "UserChapter_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "UserChapter" DROP CONSTRAINT "UserChapter_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "UserVideo" DROP CONSTRAINT "UserVideo_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "UserVideo" DROP CONSTRAINT "UserVideo_videoId_fkey";

-- AddForeignKey
ALTER TABLE "LiteraryWorkChapter" ADD CONSTRAINT "LiteraryWorkChapter_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "LiteraryWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChapter" ADD CONSTRAINT "UserChapter_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChapter" ADD CONSTRAINT "UserChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "LiteraryWorkChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideo" ADD CONSTRAINT "UserVideo_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideo" ADD CONSTRAINT "UserVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
