"use server";
import "server-only";

import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessages,
  uploadImage,
} from "./database-utils/messages-utils";
import { tFulldataMessage, tMessagePlaceholder } from "@/types/common-types";
import pusherServer from "@/lib/pusher";

export async function createMessageAction(messageData: {
  userId: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  body: string;
  imageId?: string;
  conversationId?: string;
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

export async function triggerReplyEvent(message: tFulldataMessage) {
  if (message?.parentMessageId) {
    // sending the message on the workspace instead of just channel
    pusherServer.trigger(message.workspaceId, "reply-on-thread", message);
  }
}

export async function triggerMessageEvent(message: tFulldataMessage) {
  if (message?.channelId || message?.conversationId) {
    // sending the message on the workspace instead of just channel
    console.log("Push push push ", message.workspaceId, message);
    pusherServer.trigger(message.workspaceId, "incomming-message", message);
  }
}

// export async function triggerConversationMessageEvent(
//   message: tFulldataMessage
// ) {
//   if (message?.conversationId) {
//     // sending the message on the workspace instead of just channel
//     pusherServer.trigger(message.workspaceId, "incomming-message", message);
//   }
// }

export async function triggerEditMessageEvent(
  messageIndex: number,
  message: tMessagePlaceholder,
  parentId: string,
  conversationId?: string
) {
  if (message?.channelId || message.conversationId) {
    // sending the message on the workspace instead of just channel
    pusherServer.trigger(message.workspaceId, "edit-message", {
      messageIndex,
      message,
      parentId,
      conversationId,
    });
  }
}

export async function triggerDeleteMessageEvent(
  messageIndex: number,
  workspaceId: string,
  channelId: string,
  parentId: string,
  conversationId?: string | null
) {
  pusherServer.trigger(workspaceId, "delete-message", {
    messageIndex,
    channelId,
    parentId,
    conversationId,
  });
}
