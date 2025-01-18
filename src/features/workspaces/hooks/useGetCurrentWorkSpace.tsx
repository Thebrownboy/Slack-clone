import { useCurrentWorkspace } from "@/state-store/store";
import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function useGetCurrentWorkSpace() {
  const { workspaceId } = useParams();
  const { currentWorkspaceState, updateWorkspaceState } = useCurrentWorkspace(
    (state) => {
      return state;
    }
  );
  useEffect(() => {
    const getCurrentWorkSpace = async () => {
      const currentWorkSpace = await getWorkSpaceByIdAction(
        workspaceId as string
      );
      updateWorkspaceState({ workSpace: currentWorkSpace, isLoading: false });
    };
    if (!currentWorkspaceState.workSpace) getCurrentWorkSpace();
  }, [workspaceId, updateWorkspaceState, currentWorkspaceState]);

  return {
    currentWorkSpace: currentWorkspaceState.workSpace,
    isLoading: currentWorkspaceState.isLoading,
  };
}
