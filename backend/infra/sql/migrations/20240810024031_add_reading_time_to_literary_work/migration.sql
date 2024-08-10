/*
  Warnings:

  - You are about to drop the column `dialogDensity` on the `LiteraryWork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LiteraryWork" DROP COLUMN "dialogDensity",
ADD COLUMN     "readingTime" SMALLINT;
