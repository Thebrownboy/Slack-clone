import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentWorkspace } from "@/state-store/store";
import { createMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useCreateMessage() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);
  const { channelId } = useGetChannelId();
  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);

  const { userId } = useGetUserId();
  const handleSubmit = async (
    body: string,
    imageId: string | undefined,
    parentMessageId: string | undefined
  ) => {
    updateLoading(true);
    const message = await createMessageAction({
      body,
      imageId,
      userId: userId as string,
      workspaceId: workSpace?.id || "",
      channelId: channelId as string,
      parentMessageId,
    });
    updateLoading(false);
    updateError(message.errmsg);

    return message;
  };

  return { handleSubmit, error, loading };
}
