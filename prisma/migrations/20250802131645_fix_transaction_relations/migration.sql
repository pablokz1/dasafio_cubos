/*
  Warnings:

  - You are about to drop the column `accountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - Added the required column `idAccount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "accountId",
ADD COLUMN     "idAccount" TEXT NOT NULL,
ALTER COLUMN "value" SET DEFAULT 0,
ALTER COLUMN "value" SET DATA TYPE DECIMAL(18,2);

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_idAccount_fkey" FOREIGN KEY ("idAccount") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
