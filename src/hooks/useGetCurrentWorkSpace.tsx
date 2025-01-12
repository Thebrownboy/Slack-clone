import { tWorkspace } from "@/types/common-types";
import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

export default function useGetCurrentWorkSpace(workspaceId: string) {
  const [currentWorkSpace, updateCurrentWorkSpace] =
    useState<null | tWorkspace>(null);
  const [isLoading, updateIsLoading] = useState(true);
  useEffect(() => {
    const getCurrentWorkSpace = async () => {
      const currentWorkSpace = await getWorkSpaceByIdAction(workspaceId);
      updateCurrentWorkSpace(currentWorkSpace);
      updateIsLoading(false);
    };
    getCurrentWorkSpace();
  }, [workspaceId]);

  return { currentWorkSpace, isLoading };
}
