import { makeUserJoinAction } from "@/utils/workspaces-actions";
import { useState } from "react";

export default function useJoinWorkspace(userId: string, workspaceId: string) {
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);

  const submitJoinAction = async (joinCode: string) => {
    if (userId) {
      updateIsPending(true);
      const response = await makeUserJoinAction(userId, workspaceId, joinCode);
      if (!response.success) {
        updateErrorMsg(response.msg);
      }
      updateIsPending(false);

      return response;
    }
  };

  return {
    errorMsg,
    isPending,
    submitJoinAction,
  };
}
