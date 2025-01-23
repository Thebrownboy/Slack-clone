import { getWorkspaceNaiveInfoAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

function useGetWorkspaceInfo(workspaceId: string, userId: string) {
  const [loading, updateLoading] = useState(true);
  const [currentWorkSpaceInfo, updateCurrentWorkspaceInfo] = useState<{
    workspaceName: string | undefined;
    isMember: boolean;
  } | null>({} as { workspaceName: string | undefined; isMember: boolean });
  useEffect(() => {
    const getCurrentWorkSpace = async () => {
      const currentWorkSpace = await getWorkspaceNaiveInfoAction(
        userId,
        workspaceId
      );
      updateCurrentWorkspaceInfo(currentWorkSpace.data);
      updateLoading(false);
    };

    getCurrentWorkSpace();
  }, [workspaceId, userId]);

  return { currentWorkSpaceInfo, loading };
}

export default useGetWorkspaceInfo;
