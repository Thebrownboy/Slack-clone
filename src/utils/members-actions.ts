"use server";
import "server-only";
import { getWorkspaceMembers } from "./database";

export async function getWorkspaceMembersAction(
  workspaceId: string,
  userId: string
) {
  return await getWorkspaceMembers(workspaceId, userId);
}
