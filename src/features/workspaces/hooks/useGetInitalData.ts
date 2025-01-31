import {
  useCurrentMember,
  useCurrentUser,
  useCurrentWorkspace,
} from "@/state-store/store";
import { getUserAction } from "@/utils/auth-actions";
import {
  getMemberByUserIdAndWorkSpaceIdAction,
  getWorkSpaceByIdAction,
} from "@/utils/workspaces-actions";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useGetInitalData() {
  const session = useSession();
  const [finishLoading, updateFinishLoading] = useState(false);
  const { workspaceId } = useParams();
  const [initalDataLoading, updateInitialDataLoading] = useState(true);
  const { updateState, userState } = useCurrentUser();
  const { currentWorkspaceState, updateWorkspaceState } = useCurrentWorkspace();
  const {
    updateCurrentMemberState,
    currentMemberState: { member, loading: memberLoading },
  } = useCurrentMember();
  useEffect(() => {
    if (
      !userState.loading &&
      !currentWorkspaceState.isLoading &&
      !memberLoading &&
      finishLoading
    ) {
      updateInitialDataLoading(false);

      console.log(userState, currentWorkspaceState, member);
    }
  }, [userState, currentWorkspaceState, memberLoading, member, finishLoading]);
  useEffect(() => {
    const getCurrentUser = async () => {
      // whether the user is null or actual user , you will update the state with these values
      const user = await getUserAction(session.data?.user?.id || "");
      updateState({
        loading: false,
        user,
      });
    };
    const getCurrentWorkspace = async () => {
      const currentWorkSpace = await getWorkSpaceByIdAction(
        workspaceId as string
      );
      updateWorkspaceState({ isLoading: false, workSpace: currentWorkSpace });

      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        userState.user?.id as string,
        currentWorkSpace?.id as string
      );
      console.log(member);

      console.log(
        "this is the member",
        userState.user?.id,
        currentWorkSpace?.id
      );

      updateCurrentMemberState(member);
      updateFinishLoading(true);
    };

    if (!userState.user) {
      // you will not get the current user except the first time
      getCurrentUser();
    }
    // if you are loading the user , don't load anyting else
    if (userState.loading) {
      return;
    }

    // fetch the workspace only if the id has been updated , and if the workspace changed , you must fetch the member as well
    if (
      !currentWorkspaceState.workSpace ||
      currentWorkspaceState.workSpace?.id !== workspaceId
    ) {
      getCurrentWorkspace();
    }
  }, [
    session,
    updateState,
    userState,
    workspaceId,
    currentWorkspaceState,
    updateWorkspaceState,
    updateCurrentMemberState,
  ]);

  return { initalDataLoading };
}
