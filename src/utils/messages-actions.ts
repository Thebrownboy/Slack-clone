import { createMessage } from "./database";

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
