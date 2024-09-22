-- CreateTable
CREATE TABLE "UserVideoGame" (
    "userId" BIGINT NOT NULL,
    "videoGameId" BIGINT NOT NULL,
	"score" DECIMAL(3,1),
    "timeSpent" BIGINT,
    "offset" INTEGER,
    "bookmarked" BOOLEAN,

    CONSTRAINT "UserVideoGame_pkey" PRIMARY KEY ("userId","videoGameId")
);

-- CreateTable
CREATE TABLE "VideoGame" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('Game'),
    "title" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoGame_pkey" PRIMARY KEY ("id")
);

CREATE TRIGGER video_game_updated_at
BEFORE UPDATE ON "VideoGame"
FOR EACH ROW EXECUTE FUNCTION updated_at();

-- AddForeignKey
ALTER TABLE "UserVideoGame" ADD CONSTRAINT "UserVideoGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideoGame" ADD CONSTRAINT "UserVideoGame_videoGameId_fkey" FOREIGN KEY ("videoGameId") REFERENCES "VideoGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
