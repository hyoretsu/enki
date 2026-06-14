ALTER TABLE "UserVideoGameRun" DROP CONSTRAINT "UserVideoGameRun_pkey", ADD COLUMN "id" BIGINT NOT NULL DEFAULT generate_tsid('UserVideoGameRun'), ADD CONSTRAINT "UserVideoGameRun_pkey" PRIMARY KEY ("id");

