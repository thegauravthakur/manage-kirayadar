/*
  Warnings:

  - You are about to drop the column `unitType` on the `Space` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('room', 'one_Rk', 'two_RK', 'one_BHK', 'two_BHK', 'three_BHK', 'four_BHK', 'five_BHK');

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "unitType",
ADD COLUMN     "spaceType" "SpaceType" NOT NULL DEFAULT E'room';

-- DropEnum
DROP TYPE "UnitType";
