/*
  Warnings:

  - You are about to drop the `ProjectActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectActivity" DROP CONSTRAINT "ProjectActivity_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectActivity" DROP CONSTRAINT "ProjectActivity_userId_fkey";

-- DropTable
DROP TABLE "ProjectActivity";
