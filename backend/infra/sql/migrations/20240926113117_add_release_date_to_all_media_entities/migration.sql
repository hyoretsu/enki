-- AlterTable
ALTER TABLE "LiteraryWork" ADD COLUMN     "releaseDate" DATE,
ALTER COLUMN "id" SET DEFAULT generate_tsid('LiteraryWork');

-- AlterTable
ALTER TABLE "LiteraryWorkChapter" ALTER COLUMN "id" SET DEFAULT generate_tsid('LiteraryWorkChapter');

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "id" SET DEFAULT generate_tsid('Movie');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT generate_tsid('User');

-- AlterTable
ALTER TABLE "UserChapter" ALTER COLUMN "id" SET DEFAULT generate_tsid('UserChapter');

-- AlterTable
ALTER TABLE "UserMovie" ALTER COLUMN "id" SET DEFAULT generate_tsid('UserMovie');

-- AlterTable
ALTER TABLE "UserVideo" ALTER COLUMN "id" SET DEFAULT generate_tsid('UserVideo');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "releaseDate" DATE,
ALTER COLUMN "id" SET DEFAULT generate_tsid('Video');

-- AlterTable
ALTER TABLE "VideoChannel" ALTER COLUMN "id" SET DEFAULT generate_tsid('VideoChannel');

-- AlterTable
ALTER TABLE "VideoGame" ADD COLUMN     "releaseDate" DATE,
ALTER COLUMN "id" SET DEFAULT generate_tsid('Game');

-- AlterTable
ALTER TABLE "VideoPlaylist" ALTER COLUMN "id" SET DEFAULT generate_tsid('VideoPlaylist');
