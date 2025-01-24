"use server";
import "server-only";
import {
  createChannel,
  getChannelById,
  getWorkspaceChannels,
} from "./database";
import { tChannel } from "@/types/common-types";

export async function getcurrentChannelsAction(
  workspaceId: string,
  userId: string
) {
  return await getWorkspaceChannels(workspaceId, userId);
}

export async function createChannelAction(
  workspaceId: string,
  userId: string,
  channelName: string
) {
  const channel = await createChannel(workspaceId, userId, channelName);
  if (channel) {
    return {
      success: true,
      err: "",
      channel: channel as tChannel,
    };
  } else {
    return {
      channel: {} as tChannel,
      success: false,
      err: "Error happens while creating the channel",
    };
  }
}

export async function getChannelByIdAction(userId: string, channelId: string) {
  return await getChannelById(userId, channelId);
}
