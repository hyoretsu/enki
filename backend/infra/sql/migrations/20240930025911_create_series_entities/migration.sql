ALTER TABLE "Movie" ALTER COLUMN "duration" SET DATA TYPE SMALLINT;

ALTER TABLE "UserMovie" ADD COLUMN "progress" SMALLINT;

ALTER TABLE "UserVideo" RENAME COLUMN "timeSpent" TO "progress";

CREATE TABLE "Series" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('Series'),
    "title" JSONB NOT NULL,
    "synopsis" JSONB,
    "tags" VARCHAR(30)[],
    "releaseDate" DATE,
    "ongoing" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

CREATE TRIGGER series_updated_at
BEFORE UPDATE ON "Series"
FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TABLE "SeriesEpisode" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('SeriesEpisode'),
    "number" DECIMAL(6,1) NOT NULL,
    "title" JSONB,
    "duration" SMALLINT,
    "releaseDate" DATE,
    "seriesId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeriesEpisode_pkey" PRIMARY KEY ("id")
);

CREATE TRIGGER series_episode_updated_at
BEFORE UPDATE ON "SeriesEpisode"
FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE "SeriesEpisode" ADD CONSTRAINT "SeriesEpisode_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "UserEpisode" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('UserChapter'),
    "userId" BIGINT NOT NULL,
    "episodeId" BIGINT NOT NULL,
    "when" TIMESTAMPTZ(0),
    "progress" SMALLINT,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserEpisode_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UserEpisode" ADD CONSTRAINT "UserEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserEpisode" ADD CONSTRAINT "UserEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "SeriesEpisode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
