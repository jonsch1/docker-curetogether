/*
  Warnings:

  - You are about to drop the column `content` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `ForumTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopicTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ForumTopicToTopicTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comment` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_topicId_fkey";

-- DropForeignKey
ALTER TABLE "ForumTopic" DROP CONSTRAINT "ForumTopic_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ForumTopic" DROP CONSTRAINT "ForumTopic_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ForumTopicToTopicTag" DROP CONSTRAINT "_ForumTopicToTopicTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ForumTopicToTopicTag" DROP CONSTRAINT "_ForumTopicToTopicTag_B_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "content",
DROP COLUMN "topicId",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "contentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ForumTopic";

-- DropTable
DROP TABLE "TopicTag";

-- DropTable
DROP TABLE "Vote";

-- DropTable
DROP TABLE "_ForumTopicToTopicTag";

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "subtype" VARCHAR(50),
    "difficulty" VARCHAR(50),
    "evidence" TEXT,
    "experiment" TEXT,
    "resourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "projectId" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT,
    "contentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContentToContentTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentTag_name_key" ON "ContentTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UpVote_userId_contentId_key" ON "UpVote"("userId", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToContentTag_AB_unique" ON "_ContentToContentTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToContentTag_B_index" ON "_ContentToContentTag"("B");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpVote" ADD CONSTRAINT "UpVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpVote" ADD CONSTRAINT "UpVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpVote" ADD CONSTRAINT "UpVote_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToContentTag" ADD CONSTRAINT "_ContentToContentTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToContentTag" ADD CONSTRAINT "_ContentToContentTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ContentTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
