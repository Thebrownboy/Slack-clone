import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import { toggleReactionAction } from "@/utils/reactions-actions";
import { useState } from "react";

export default function useCreateMessage() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);

  const {
    userState: { user },
  } = useCurrentUser((state) => state);
  const handleSubmit = async ({
    messageId,
    value,
  }: {
    messageId: string;
    value: string;
  }) => {
    updateLoading(true);
    const reaction = await toggleReactionAction({
      userId: user?.id || "",
      workspaceId: workSpace?.id || "",
      messageId,
      value,
    });
    updateLoading(false);
    if (reaction.errorMsg) {
      updateError(reaction.errorMsg);
    }

    return reaction;
  };

  return { handleSubmit, error, loading };
}
