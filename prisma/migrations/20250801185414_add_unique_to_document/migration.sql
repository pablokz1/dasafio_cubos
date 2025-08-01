/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `People` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "People_document_key" ON "public"."People"("document");
