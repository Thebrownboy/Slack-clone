import "server-only";
import { db } from "@/lib/db";

export const getMember = async (userId: string, workspaceId: string) => {
  return await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
};
