-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('room', 'one_Rk', 'two_RK', 'one_BHK', 'two_BHK', 'three_BHK', 'four_BHK', 'five_BHK');

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "rent" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "sharingType" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unitType" "UnitType" NOT NULL DEFAULT E'room';
