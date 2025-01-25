import { createMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useCreateMessage(
  channelId: string,
  workspaceId: string,
  userId: string
) {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);
  const handleSubmit = async (
    body: string,
    imageId: string | undefined,
    parentMessageId: string | undefined
  ) => {
    updateLoading(true);
    const message = await createMessageAction({
      body,
      imageId,
      userId,
      workspaceId,
      channelId,
      parentMessageId,
    });
    updateLoading(false);
    updateError(message.errmsg);
  };

  return { handleSubmit, error, loading };
}
