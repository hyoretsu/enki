/*
  Warnings:

  - Made the column `number` on table `LiteraryWorkChapter` required. This step will fail if there are existing NULL values in that column.

*/

-- AlterTable
ALTER TABLE "LiteraryWorkChapter" ALTER COLUMN "number" SET NOT NULL;
