-- CreateTable
CREATE TABLE "UserVideo" (
    "userEmail" VARCHAR(320) NOT NULL,
    "videoId" UUID NOT NULL,
    "when" TIMESTAMP,
    "watchTime" SMALLINT,
    "bookmarked" BOOLEAN,

    CONSTRAINT "UserVideo_pkey" PRIMARY KEY ("userEmail","videoId"),
	CONSTRAINT "watchTime_valid" CHECK ("watchTime" >= 0)
);

-- AddForeignKey
ALTER TABLE "UserVideo" ADD CONSTRAINT "UserVideo_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideo" ADD CONSTRAINT "UserVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
