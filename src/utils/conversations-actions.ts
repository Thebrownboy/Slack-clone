"use server";
import "server-only";
import { createOrGetConversation } from "./database-utils/conversation-utils";

export const getOrCreateConversationAction = async ({
  otherMemberId,
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
  otherMemberId: string;
}) => {
  const conversation = await createOrGetConversation({
    otherMemberId,
    userId,
    workspaceId,
  });
  return conversation;
};
