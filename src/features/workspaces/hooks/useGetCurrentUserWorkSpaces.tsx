import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { useCurrentUserWorkspaces } from "@/state-store/workspace-store";
import { getAllWorkSpacesOfUserAction } from "@/utils/workspaces-actions";
import { useEffect } from "react";

export default function useGetCurrentUserWorkSpaces() {
  const { userId } = useGetUserId();
  const { userWorkspacesState, updateCurrentUserWorkspaces } =
    useCurrentUserWorkspaces();

  const { workspaceId } = useGetWorkspaceId();

  useEffect(() => {
    const getAllWorkSpacesForUser = async () => {
      // user id will not be null , cuz I will not call this function if it does not exist
      try {
        const allWorkSpaces = await getAllWorkSpacesOfUserAction(
          userId as string
        );
        if (allWorkSpaces) updateCurrentUserWorkspaces(allWorkSpaces);
      } catch (err) {
        console.log("This is the big error", err);
      }
    };

    if (userId && !userWorkspacesState.userWorkSpaces)
      getAllWorkSpacesForUser();
  }, [userId, workspaceId, updateCurrentUserWorkspaces, userWorkspacesState]);

  return {
    userWorkSpaces: userWorkspacesState.userWorkSpaces,
    isFetching: userWorkspacesState.fetching,
  };
}
