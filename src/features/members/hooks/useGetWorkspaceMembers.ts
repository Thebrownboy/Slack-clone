import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { useCurrentWorkspaceMembers } from "@/state-store/user-store";
import { getWorkspaceMembersAction } from "@/utils/members-actions";
import { useEffect } from "react";

export default function useGetWorkspaceMembers() {
  const { userId } = useGetUserId();
  const { workspaceId } = useGetWorkspaceId();

  const { currentWorkspaceMembers, isLoading, updateCurrentWorkspaceMembers } =
    useCurrentWorkspaceMembers();
  const { channelId } = useGetChannelId();
  useEffect(() => {
    const getWorkspaceMembers = async () => {
      const response = await getWorkspaceMembersAction(
        workspaceId as string,
        userId as string
      );

      updateCurrentWorkspaceMembers(response);
      console.log(response);
    };
    if (!currentWorkspaceMembers) {
      getWorkspaceMembers();
    }
  }, [
    currentWorkspaceMembers,
    userId,
    workspaceId,
    channelId,
    updateCurrentWorkspaceMembers,
  ]);

  return { currentWorkspaceMembers: currentWorkspaceMembers, isLoading };
}
