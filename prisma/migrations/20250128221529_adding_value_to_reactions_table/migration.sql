/*
  Warnings:

  - Added the required column `value` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reactions" ADD COLUMN     "value" TEXT NOT NULL;
