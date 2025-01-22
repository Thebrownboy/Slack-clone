"use server";
import "server-only";
import { getWorkspaceChannels } from "./database";

export async function getcurrentChannelsAction(
  workspaceId: string,
  userId: string
) {
  return await getWorkspaceChannels(workspaceId, userId);
}
