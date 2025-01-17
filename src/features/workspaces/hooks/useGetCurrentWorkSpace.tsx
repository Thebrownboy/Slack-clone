import { useCurrentWorkspace } from "@/state-store/store";
import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";
import { useEffect } from "react";

export default function useGetCurrentWorkSpace(workspaceId: string) {
  console.log("useGetCurrentWorkspace has been called", workspaceId);
  const { updateWorkspace, isLoading, workSpace, updateLoading } =
    useCurrentWorkspace((state) => {
      return state;
    });
  useEffect(() => {
    const getCurrentWorkSpace = async () => {
      const currentWorkSpace = await getWorkSpaceByIdAction(workspaceId);
      updateWorkspace(currentWorkSpace);
      updateLoading(false);
    };
    getCurrentWorkSpace();
  }, [workspaceId, updateWorkspace, updateLoading]);

  return { currentWorkSpace: workSpace, isLoading };
}
