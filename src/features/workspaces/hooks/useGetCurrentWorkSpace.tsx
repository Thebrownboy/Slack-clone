import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function useGetCurrentWorkSpace() {
  const { workspaceId } = useParams();
  const {
    userState: { user },
  } = useCurrentUser();
  const { currentWorkspaceState, updateWorkspaceState } = useCurrentWorkspace();
  useEffect(() => {
    const getCurrentWorkSpace = async () => {
      const currentWorkSpace = await getWorkSpaceByIdAction(
        workspaceId as string
      );
      updateWorkspaceState({ workSpace: currentWorkSpace, isLoading: false });
    };
    // don't make a request unless you have the user already exists
    if (!user) return;
    if (!(currentWorkspaceState.workSpace?.id === workspaceId))
      getCurrentWorkSpace();
  }, [workspaceId, updateWorkspaceState, currentWorkspaceState, user]);

  return {
    currentWorkSpace: currentWorkspaceState.workSpace,
    isLoading: currentWorkspaceState.isLoading,
  };
}
