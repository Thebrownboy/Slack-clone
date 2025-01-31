import useGetUserId from "@/hooks/useGetUserId";
import { createNewWorkspace } from "@/utils/workspaces-actions";
import React, { useState } from "react";

export default function useCreateWorkspace() {
  const [workspaceName, updateWorkspaceName] = useState("");
  const { userId } = useGetUserId();
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitCreateAction = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (userId) {
      updateIsPending(true);
      const response = await createNewWorkspace(workspaceName, userId);
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
