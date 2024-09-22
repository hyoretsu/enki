ALTER TABLE "UserChapter" DROP CONSTRAINT "UserChapter_pkey",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_tsid('UserChapter'),
ADD CONSTRAINT "UserChapter_pkey" PRIMARY KEY ("id");

ALTER TABLE "UserMovie" DROP CONSTRAINT "UserMovie_pkey",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_tsid('UserMovie'),
ADD CONSTRAINT "UserMovie_pkey" PRIMARY KEY ("id");

ALTER TABLE "UserVideo" DROP CONSTRAINT "UserVideo_pkey",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_tsid('UserVideo'),
ADD CONSTRAINT "UserVideo_pkey" PRIMARY KEY ("id");
