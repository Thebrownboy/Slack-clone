import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import { createMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useCreateMessage(channelId: string | undefined) {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);

  const {
    userState: { user },
  } = useCurrentUser((state) => state);
  const handleSubmit = async (
    body: string,
    imageId: string | undefined,
    parentMessageId: string | undefined
  ) => {
    updateLoading(true);
    const message = await createMessageAction({
      body,
      imageId,
      userId: user?.id || "",
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
