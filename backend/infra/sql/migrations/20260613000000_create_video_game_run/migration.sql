-- CreateTable
CREATE TABLE "VideoGameRun" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('VideoGameRun'),
    "videoGameId" BIGINT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoGameRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVideoGameRun" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('UserVideoGameRun'),
    "userId" BIGINT NOT NULL,
    "videoGameId" BIGINT NOT NULL,
    "runId" BIGINT NOT NULL,
    "score" DECIMAL(3,1),
    "timeSpent" BIGINT,
    "when" TIMESTAMPTZ(0),
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserVideoGameRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoGameRun_videoGameId_name_key" ON "VideoGameRun"("videoGameId", "name");

CREATE TRIGGER video_game_run_updated_at
BEFORE UPDATE ON "VideoGameRun"
FOR EACH ROW EXECUTE FUNCTION updated_at();

-- AddForeignKey
ALTER TABLE "VideoGameRun" ADD CONSTRAINT "VideoGameRun_videoGameId_fkey" FOREIGN KEY ("videoGameId") REFERENCES "VideoGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideoGameRun" ADD CONSTRAINT "UserVideoGameRun_userId_videoGameId_fkey" FOREIGN KEY ("userId", "videoGameId") REFERENCES "UserVideoGame"("userId", "videoGameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideoGameRun" ADD CONSTRAINT "UserVideoGameRun_runId_fkey" FOREIGN KEY ("runId") REFERENCES "VideoGameRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
