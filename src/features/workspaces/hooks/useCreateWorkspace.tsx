import useGetUserId from "@/hooks/useGetUserId";
import { createNewWorkspace } from "@/utils/workspaces-actions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function useCreateWorkspace(homeUserId?: string) {
  const [workspaceName, updateWorkspaceName] = useState("");
  const { userId } = useGetUserId();
  const router = useRouter();
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitCreateAction = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (homeUserId) {
      event.preventDefault();
    }
    if (userId || homeUserId) {
      updateIsPending(true);
      const response = await createNewWorkspace(
        workspaceName,
        userId || homeUserId || ""
      );
      if (!response.success) {
        updateErrorMsg(response.msg);
        event.preventDefault();
      }
      updateIsPending(false);
      if (response.success && homeUserId) {
        router.push(`/workspace/${response.workspace?.workspaceId}`);
      }
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
