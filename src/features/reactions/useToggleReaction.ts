import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentWorkspace } from "@/state-store/store";
import { toggleReactionAction } from "@/utils/reactions-actions";
import { useState } from "react";

export default function useToggleReaction() {
  const [error, updateError] = useState("");
  const [loading, updateLoading] = useState(false);

  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);

  const { userId } = useGetUserId();
  const handleSubmit = async ({
    messageId,
    value,
  }: {
    messageId: string;
    value: string;
  }) => {
    updateLoading(true);
    const reaction = await toggleReactionAction({
      userId: userId as string,
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
