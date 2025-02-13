import useGetCurrentUserData from "@/hooks/getCurrentUserData";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { updateMemberAction } from "@/utils/members-actions";
import { useCallback } from "react";

function useUpdateMember(memberId: string) {
  const { user } = useGetCurrentUserData();
  const { workspaceId } = useGetWorkspaceId();
  const handleSubmit = useCallback(
    async (role: "admin" | "member") => {
      const updatedMember = await updateMemberAction({
        userId: user?.id || "",
        memberId,
        role,
        workspaceId: workspaceId as string,
      });
      return updatedMember;
    },
    [user, memberId, workspaceId]
  );

  return { handleSubmit };
}

export default useUpdateMember;
