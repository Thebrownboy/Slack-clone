-- CreateTable
CREATE TABLE "Channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Channels_workspaceId_idx" ON "Channels"("workspaceId");

-- AddForeignKey
ALTER TABLE "Channels" ADD CONSTRAINT "Channels_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
