/*
  Warnings:

  - Added the required column `floor` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "floor" INTEGER NOT NULL;
