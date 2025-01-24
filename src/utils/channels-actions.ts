"use server";
import "server-only";
import {
  createChannel,
  editChannelName,
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

export async function editChannelNameAction(
  userId: string,
  channelId: string,
  channelName: string
) {
  const updatedChannel = await editChannelName(userId, channelId, channelName);
  if (updatedChannel) {
    return {
      success: true,
      channel: updatedChannel,
      msg: "",
    };
  } else {
    return {
      success: false,
      channel: null,
      msg: "An error happened",
    };
  }
}
