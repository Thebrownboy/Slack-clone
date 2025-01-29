"use server";
import "server-only";

import {
  createMessage,
  deleteMessage,
  editMessage,
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
  return (
    await getMessages(
      userId,
      channelId,
      conversationId,
      parentMessageId,
      skip,
      take
    )
  )?.page;
}

export async function editMessageAction(messageData: {
  userId: string;
  workspaceId: string;
  body: string;
  messageId: string;
}) {
  const updatedMessage = await editMessage(messageData);
  return {
    success: !!updatedMessage,
    message: updatedMessage,
  };
}

export async function deleteMessageAction(messageData: {
  userId: string;
  workspaceId: string;
  messageId: string;
}) {
  const message = await deleteMessage(messageData);
  return {
    success: !!message,
    message: message,
  };
}
