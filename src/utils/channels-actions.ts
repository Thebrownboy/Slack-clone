"use server";
import "server-only";
import {
  createChannel,
  deleteChannel,
  editChannelName,
  getChannelById,
  getWorkspaceChannels,
} from "./database-utils/channels-utils";
import { tChannel } from "@/types/common-types";
import pusherServer from "@/lib/pusher";

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

export async function deleteChannelAction(userId: string, channelId: string) {
  const deletedChannel = await deleteChannel(userId, channelId);
  if (deletedChannel) {
    return {
      success: true,
      channel: deletedChannel,
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

export async function triggerCreateChannelEvent(channel: tChannel) {
  if (channel?.workspaceId) {
    // sending the message on the workspace instead of just channel
    await pusherServer.trigger(channel.workspaceId, "create-channel", channel);
  }
}

export async function triggerDeleteChannelEvent(channel: tChannel | null) {
  if (channel?.workspaceId) {
    // sending the message on the workspace instead of just channel
    await pusherServer.trigger(channel.workspaceId, "delete-channel", channel);
  }
}

export async function triggerEditChannelEvent(channel: tChannel | null) {
  if (channel?.workspaceId) {
    // sending the message on the workspace instead of just channel
    await pusherServer.trigger(channel.workspaceId, "edit-channel", channel);
  }
}
