import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import { deleteMessageAction } from "@/utils/messages-actions";
import { useState } from "react";

export default function useEditMessage() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);

  const {
    userState: { user },
  } = useCurrentUser((state) => state);
  const handleSubmit = async (body: string, messageId: string) => {
    updateLoading(true);
    const message = await deleteMessageAction({
      userId: user?.id || "",
      messageId,
      workspaceId: workSpace?.id || "",
    });
    updateLoading(false);
    updateError(message.message ? "" : "Unexpected error happend");

    return message;
  };

  return { handleSubmit, error, loading };
}
