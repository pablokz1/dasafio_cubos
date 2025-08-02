-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "revertedFromId" TEXT,
ALTER COLUMN "value" DROP DEFAULT,
ALTER COLUMN "value" SET DATA TYPE DECIMAL(65,30);

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_revertedFromId_fkey" FOREIGN KEY ("revertedFromId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
