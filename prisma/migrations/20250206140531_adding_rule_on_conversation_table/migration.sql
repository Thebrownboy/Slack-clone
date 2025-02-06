/*
  Warnings:

  - A unique constraint covering the columns `[memberOneId,memberTwoId,workspaceId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_memberOneId_memberTwoId_workspaceId_key" ON "Conversation"("memberOneId", "memberTwoId", "workspaceId");
