import { deleteWorkSpaceAction } from "@/utils/workspaces-actions";
import { useState } from "react";

export default function useDeleteWorkspace(
  userId: string | undefined,
  workspaceId: string = ""
) {
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitDeleteAction = async () => {
    if (userId) {
      updateIsPending(true);
      const response = await deleteWorkSpaceAction(userId, workspaceId);
      if (!response.success) {
        updateErrorMsg(response.msg);
      }
      updateIsPending(false);
    }
  };

  return {
    submitDeleteAction,
    errorMsg,
    isPending,
  };
}
