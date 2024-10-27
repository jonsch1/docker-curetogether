/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `UpVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UpVote_userId_commentId_key" ON "UpVote"("userId", "commentId");
