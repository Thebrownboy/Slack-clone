import { deleteWorkSpaceAction } from "@/utils/workspaces-actions";
import { useState } from "react";

export default function useUpdateWorkspace(
  userId: string | undefined,
  workspaceId: string = ""
) {
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitCreateAction = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (userId) {
      updateIsPending(true);
      const response = await deleteWorkSpaceAction(userId, workspaceId);
      if (!response.success) {
        updateErrorMsg(response.msg);
        event.preventDefault();
      }
      updateIsPending(false);
    }
  };

  return {
    submitCreateAction,
    errorMsg,
    isPending,
  };
}
