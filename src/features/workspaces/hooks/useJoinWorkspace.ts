import useGetCurrentUserData from "@/hooks/getCurrentUserData";
import { tFulldataMessage } from "@/types/common-types";
import { triggerAddUserToWorkspace } from "@/utils/members-actions";
import { makeUserJoinAction } from "@/utils/workspaces-actions";
import { useCallback, useState } from "react";

export default function useJoinWorkspace(userId: string, workspaceId: string) {
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const { user, loading: userLoading } = useGetCurrentUserData();
  const submitJoinAction = useCallback(
    async (joinCode: string) => {
      if (user && user.id) {
        updateIsPending(true);
        const response = await makeUserJoinAction(
          user.id,
          workspaceId,
          joinCode
        );
        if (!response.success) {
          updateErrorMsg(response.msg);
        }
        updateIsPending(false);

        await triggerAddUserToWorkspace(response.newMember as tFulldataMessage);
        return response;
      }
    },
    [user, workspaceId]
  );

  return {
    errorMsg,
    isPending: isPending && userLoading,
    submitJoinAction,
  };
}
