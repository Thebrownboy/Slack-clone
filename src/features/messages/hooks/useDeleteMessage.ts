import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { deleteMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useRemoveMessage() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

  const { workspaceId } = useGetWorkspaceId();
  const { userId } = useGetUserId();
  const handleSubmit = async (messageId: string) => {
    updateLoading(true);
    const message = await deleteMessageAction({
      userId: userId as string,
      messageId,
      workspaceId: workspaceId as string,
    });
    updateLoading(false);
    updateError(message.message ? "" : "Unexpected error happend");

    return message;
  };

  return { handleSubmit, error, loading };
}
