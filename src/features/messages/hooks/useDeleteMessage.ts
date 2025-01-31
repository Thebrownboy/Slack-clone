import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentWorkspace } from "@/state-store/store";
import { deleteMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useRemoveMessage() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);

  const { userId } = useGetUserId();
  const handleSubmit = async (messageId: string) => {
    updateLoading(true);
    const message = await deleteMessageAction({
      userId: userId as string,
      messageId,
      workspaceId: workSpace?.id || "",
    });
    updateLoading(false);
    updateError(message.message ? "" : "Unexpected error happend");

    return message;
  };

  return { handleSubmit, error, loading };
}
