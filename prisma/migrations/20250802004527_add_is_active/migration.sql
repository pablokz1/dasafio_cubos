/*
  Warnings:

  - Added the required column `isActive` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "isActive" BOOLEAN NOT NULL;
