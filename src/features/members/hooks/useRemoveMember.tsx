import useGetCurrentUserData from "@/hooks/getCurrentUserData";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { removeMemberAction } from "@/utils/members-actions";
import { useCallback } from "react";

function useRemoveMember(memberId: string) {
  const { user } = useGetCurrentUserData();
  const { workspaceId } = useGetWorkspaceId();
  const handleSubmit = useCallback(async () => {
    const updatedMember = await removeMemberAction({
      userId: user?.id || "",
      memberId,
      workspaceId: workspaceId as string,
    });
    return updatedMember;
  }, [user, memberId, , workspaceId]);

  return { handleSubmit };
}

export default useRemoveMember;
