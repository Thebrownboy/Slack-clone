import { tWorkspace } from "@/types/common-types";
import { updateWorkSpaceAction } from "@/utils/workspaces-actions";
import { useState } from "react";

export default function useUpdateWorkspace(
  userId: string | undefined,
  workspaceId: string = ""
) {
  const [workspaceName, updateWorkspaceName] = useState("");

  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitCreateAction = async (
    event: React.FormEvent<HTMLFormElement>,
    data: tWorkspace
  ) => {
    if (userId) {
      updateIsPending(true);
      const response = await updateWorkSpaceAction(userId, workspaceId, data);
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
    updateWorkspaceName,
    isPending,
    workspaceName,
  };
}
