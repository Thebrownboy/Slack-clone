-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "Member"("userId");

-- CreateIndex
CREATE INDEX "Member_workspaceId_idx" ON "Member"("workspaceId");

-- CreateIndex
CREATE INDEX "Member_userId_workspaceId_idx" ON "Member"("userId", "workspaceId");
