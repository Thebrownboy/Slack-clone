"use server";
import "server-only";

import { createMessage, uploadImage } from "./database-utils/messages-utils";

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
