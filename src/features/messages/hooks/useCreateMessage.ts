import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { createMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useCreateMessage() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);
  const { channelId } = useGetChannelId();
  const { workspaceId } = useGetWorkspaceId();

  const { userId } = useGetUserId();
  const handleSubmit = async (
    body: string,
    imageId: string | undefined,
    parentMessageId: string | undefined,
    conversationId?: string
  ) => {
    updateLoading(true);

    const message = await createMessageAction({
      body,
      imageId,
      userId: userId as string,
      workspaceId: workspaceId as string,
      channelId: channelId as string,
      parentMessageId,
      conversationId,
    });
    updateLoading(false);
    updateError(message.errmsg);
    return message;
  };

  return { handleSubmit, error, loading };
}
