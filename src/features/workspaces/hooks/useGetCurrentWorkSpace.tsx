import { useCurrentWorkspace } from "@/state-store/store";
import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function useGetCurrentWorkSpace() {
  const { workspaceId } = useParams();
  const { updateWorkspace, isLoading, workSpace, updateLoading } =
    useCurrentWorkspace((state) => {
      return state;
    });
  useEffect(() => {
    const getCurrentWorkSpace = async () => {
      const currentWorkSpace = await getWorkSpaceByIdAction(
        workspaceId as string
      );
      updateWorkspace(currentWorkSpace);
      updateLoading(false);
    };
    getCurrentWorkSpace();
  }, [workspaceId, updateWorkspace, updateLoading]);

  return { currentWorkSpace: workSpace, isLoading };
}
