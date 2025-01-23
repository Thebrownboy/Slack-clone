import { tWorkspace } from "@/types/common-types";
import { generateNewJoinCodeAction } from "@/utils/workspaces-actions";
import { useState } from "react";

function useNewJoinCode(
  userId: string,
  workspaceId: string,
  updateCurrentWorkspace: (updatedWorkspaceState: {
    workSpace: tWorkspace | null;
    isLoading: boolean;
  }) => void
) {
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitUpdateAction = async () => {
    if (userId) {
      updateIsPending(true);
      const response = await generateNewJoinCodeAction(userId, workspaceId);
      updateCurrentWorkspace({
        workSpace: response.updatedWorkSpace,
        isLoading: false,
      });
      if (!response.success) {
        updateErrorMsg(response.msg);
      }
      updateIsPending(false);
    }
  };

  return {
    submitUpdateAction,
    errorMsg,
    isPending,
  };
}

export default useNewJoinCode;
