import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { useCurrentMember } from "@/state-store/member-store";
import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useEffect } from "react";

export default function useGetCurrentMember() {
  const { updateCurrentMemberState, currentMemberState } = useCurrentMember(
    (state) => state
  );
  const { workspaceId } = useGetWorkspaceId();
  const { userId } = useGetUserId();
  useEffect(() => {
    const getMember = async () => {
      // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
      // if exists so the user has the right to go to this workspace , if not the user is not allowed
      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        userId as string,
        workspaceId as string
      );
      updateCurrentMemberState(member);
    };
    if (workspaceId) getMember();
  }, [workspaceId, userId, updateCurrentMemberState]);
  return {
    member: currentMemberState.member,
    loading: currentMemberState.loading,
  };
}
