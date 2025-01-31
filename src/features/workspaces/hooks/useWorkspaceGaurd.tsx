import {
  useCurrentMember,
  useCurrentUser,
  useCurrentWorkspace,
} from "@/state-store/store";
import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useWorkspaceGaurd() {
  const {
    userState: { user, loading: loadingCurrentUser },
  } = useCurrentUser((state) => state);

  const {
    currentWorkspaceState: { workSpace, isLoading: isCurrentWorkspaceLoading },
  } = useCurrentWorkspace((state) => state);

  const {
    updateCurrentMemberState,
    currentMemberState: { member },
  } = useCurrentMember();
  const router = useRouter();

  useEffect(() => {
    const getMember = async () => {
      // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
      // if exists so the user has the right to go to this workspace , if not the user is not allowed
      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        user?.id as string,
        workSpace?.id as string
      );
      if (member) {
        updateCurrentMemberState(member);
      } else {
        router.push("/");
      }
    };
    if (loadingCurrentUser || isCurrentWorkspaceLoading) {
      return;
    }

    if (user && workSpace) getMember();
  }, [
    router,
    user,
    loadingCurrentUser,
    isCurrentWorkspaceLoading,
    workSpace,
    updateCurrentMemberState,
    member,
  ]);
}
