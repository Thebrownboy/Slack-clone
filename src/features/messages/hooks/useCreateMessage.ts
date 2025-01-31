import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentWorkspace } from "@/state-store/store";
import { createMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useCreateMessage(channelId: string | undefined) {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

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
      channelId,
      parentMessageId,
    });
    updateLoading(false);
    updateError(message.errmsg);

    return message;
  };

  return { handleSubmit, error, loading };
}
