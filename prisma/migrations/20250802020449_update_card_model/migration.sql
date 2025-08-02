/*
  Warnings:

  - You are about to alter the column `cvv` on the `Card` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(3)`.
  - Changed the type of `type` on the `Card` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CardType" AS ENUM ('PHYSICAL', 'VIRTUAL');

-- AlterTable
ALTER TABLE "public"."Card" DROP COLUMN "type",
ADD COLUMN     "type" "public"."CardType" NOT NULL,
ALTER COLUMN "cvv" SET DATA TYPE CHAR(3),
ALTER COLUMN "isActive" SET DEFAULT true;

-- CreateIndex
CREATE INDEX "idx_unique_physical_per_account" ON "public"."Card"("idAccount", "type");
