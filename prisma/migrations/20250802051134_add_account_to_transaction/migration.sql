/*
  Warnings:

  - You are about to drop the column `idDestinyAccount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `idOriginAccount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - Added the required column `accountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_idDestinyAccount_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_idOriginAccount_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "idDestinyAccount",
DROP COLUMN "idOriginAccount",
DROP COLUMN "type",
ADD COLUMN     "accountId" TEXT NOT NULL,
ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
