"use server";
import "server-only";

import {
  createMessage,
  getMessages,
  uploadImage,
} from "./database-utils/messages-utils";

export async function createMessageAction(messageData: {
  userId: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  body: string;
  imageId?: string;
}) {
  const message = await createMessage(messageData);
  if (!message) {
    return {
      success: false,
      errmsg: "Error occurerd",
      message,
    };
  } else {
    return {
      success: true,
      errmsg: "",
      message,
    };
  }
}

export async function uploadImageAction(file: File | null) {
  return await uploadImage(file);
}

export async function getMessagesAction(
  userId: string | null,
  channelId: string | undefined,
  conversationId: string | undefined,
  parentMessageId: string | undefined,
  skip: number,
  take: number = 10
) {
  return await getMessages(
    userId,
    channelId,
    conversationId,
    parentMessageId,
    skip,
    take
  );
}
