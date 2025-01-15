-- DropForeignKey
ALTER TABLE "Members" DROP CONSTRAINT "Members_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
