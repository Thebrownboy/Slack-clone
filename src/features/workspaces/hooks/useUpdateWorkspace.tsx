import { tUpdatedWorkspace } from "@/types/common-types";
import { updateWorkSpaceAction } from "@/utils/workspaces-actions";
import { useState } from "react";

export default function useUpdateWorkspace(
  userId: string | undefined,
  workspaceId: string = ""
) {
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitCreateAction = async (
    event: React.FormEvent<HTMLFormElement>,
    data: tUpdatedWorkspace
  ) => {
    event.preventDefault();
    if (userId) {
      updateIsPending(true);
      const response = await updateWorkSpaceAction(userId, workspaceId, data);

      if (!response.success) {
        updateErrorMsg(response.msg);
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
