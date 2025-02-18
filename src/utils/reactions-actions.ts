"use server";
import "server-only";

import pusherServer from "@/lib/pusher";
import { toggleReaction } from "./database-utils/reactions-utils";

export async function toggleReactionAction(reactionData: {
  messageId: string;
  workspaceId: string;
  userId: string;
  value: string;
}) {
  const reaction = await toggleReaction(reactionData);
  if (!reaction) {
    return {
      success: false,
      successMsg: "",
      errorMsg: "un-expected error happened",
    };
  }
  if (reaction?.exsiting) {
    return {
      success: true,
      successMsg: "reaction deleted successfully",
      errorMsg: "",
    };
  } else {
    return {
      success: true,
      successMsg: "reaction added successfully",
      errorMsg: "",
    };
  }
}

export async function triggertoggleReactionEvent(reactionData: {
  messageId: string;
  workspaceId: string;
  userId: string;
  value: string;
  channelId: string;
  messageIndex: number;
  parentId?: string | null;
  conversationId?: string | null;
}) {
  await pusherServer.trigger(
    reactionData.workspaceId,
    "toggle-reaction",
    reactionData
  );
}
