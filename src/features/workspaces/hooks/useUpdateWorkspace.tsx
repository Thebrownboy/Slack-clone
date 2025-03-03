import { tUpdatedWorkspace, tWorkspace } from "@/types/common-types";
import { updateWorkSpaceAction } from "@/utils/workspaces-actions";
import { useState } from "react";

export default function useUpdateWorkspace(
  userId: string | undefined,
  workspaceId: string = "",
  updateCurrentWorkspace: (updatedWorkspaceState: {
    workSpace: tWorkspace | null;
    isLoading: boolean;
  }) => void
) {
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitUpdateAction = async (
    event: React.FormEvent<HTMLFormElement>,
    data: tUpdatedWorkspace
  ) => {
    event.preventDefault();
    if (userId) {
      updateIsPending(true);
      const response = await updateWorkSpaceAction(userId, workspaceId, data);
      updateCurrentWorkspace({
        workSpace: response.updatedWorkspace,
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
