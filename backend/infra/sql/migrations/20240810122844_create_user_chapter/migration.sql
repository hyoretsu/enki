-- CreateTable
CREATE TABLE "UserChapter" (
    "userEmail" VARCHAR(320) NOT NULL,
    "chapterId" UUID NOT NULL,
    "readAt" DATE,
    "timeSpent" SMALLINT,

    CONSTRAINT "UserChapter_pkey" PRIMARY KEY ("userEmail","chapterId")
);

-- AddForeignKey
ALTER TABLE "UserChapter" ADD CONSTRAINT "UserChapter_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChapter" ADD CONSTRAINT "UserChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "LiteraryWorkChapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
