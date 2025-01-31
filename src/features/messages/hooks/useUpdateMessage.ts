import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { editMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useEditMessage() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

  const { workspaceId } = useGetWorkspaceId();

  const { userId } = useGetUserId();
  const handleSubmit = async (body: string, messageId: string) => {
    updateLoading(true);
    const message = await editMessageAction({
      body,
      messageId,
      userId: userId as string,
      workspaceId: workspaceId as string,
    });
    updateLoading(false);
    updateError(message.message ? "" : "Unexpected error happend");

    return message;
  };

  return { handleSubmit, error, loading };
}
