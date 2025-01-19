import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useWorkspaceGaurd() {
  const {
    userState: { user, loading: loadingCurrentUser },
  } = useCurrentUser((state) => state);

  const {
    currentWorkspaceState: { workSpace, isLoading: isCurrentWorkspaceLoading },
  } = useCurrentWorkspace((state) => state);

  // console.log(
  //   "Gaurd will be renderd",
  //   "Loading current user ",
  //   loadingCurrentUser,
  //   "loading current workspace ",
  //   isCurrentWorkspaceLoading
  // );

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getMember = async () => {
      // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
      // if exists so the user has the right to go to this workspace , if not the user is not allowed

      // console.log("I am here in the get Member ", user, workSpace);
      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        user?.id || "",
        workSpace?.id || ""
      );
      if (member) {
        setLoading(false);
      } else {
        router.push("/");
      }
    };
    if (!loadingCurrentUser && !isCurrentWorkspaceLoading) getMember();
  }, [router, user, loadingCurrentUser, isCurrentWorkspaceLoading, workSpace]);

  return { loading };
}
