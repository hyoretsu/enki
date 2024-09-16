-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "duration" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "duration_valid" CHECK ("duration" > 0),
	CONSTRAINT "link_valid" CHECK ("link" LIKE 'http%')
);

-- CreateTable
CREATE TABLE "VideoChannel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoChannel_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "link_valid" CHECK ("link" LIKE 'http%')
);

-- CreateTable
CREATE TABLE "VideoPlaylist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "link" TEXT,
    "channelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoPlaylist_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "link_valid" CHECK ("link" LIKE 'http%')
);

-- AddForeignKey
ALTER TABLE "VideoPlaylist" ADD CONSTRAINT "VideoPlaylist_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "VideoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
