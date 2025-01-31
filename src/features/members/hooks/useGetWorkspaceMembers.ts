import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { tWorkspaceMembers } from "@/types/common-types";
import { getWorkspaceMembersAction } from "@/utils/members-actions";
import { useEffect, useState } from "react";

export default function useGetWorkspaceMembers() {
  const { userId } = useGetUserId();
  const { workspaceId } = useGetWorkspaceId();
  const [workspaceMembers, updateWorkspaceMembers] = useState<{
    currentWorkspaceMembers: tWorkspaceMembers[] | null;
    isLoading: boolean;
  }>({ isLoading: true, currentWorkspaceMembers: null });

  useEffect(() => {
    const getWorkspaceMembers = async () => {
      try {
        const response = await getWorkspaceMembersAction(
          workspaceId as string,
          userId as string
        );
        updateWorkspaceMembers((state) => ({
          ...state,
          isLoading: false,
          currentWorkspaceMembers: response,
        }));
      } catch {
        updateWorkspaceMembers((state) => ({ ...state, isLoading: false }));
      }
    };

    getWorkspaceMembers();
  }, [userId, workspaceId]);

  return { ...workspaceMembers };
}
