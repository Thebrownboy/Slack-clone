import { useCurrentUser } from "@/state-store/store";
import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useWorkspaceGaurd() {
  const { workspaceId } = useParams();
  const { user, loading: loadingCurrentUser } = useCurrentUser(
    (state) => state
  );

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getMember = async () => {
      // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
      // if exists so the user has the right to go to this workspace , if not the user is not allowed
      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        user?.id || "",
        workspaceId as string
      );
      if (member) {
        setLoading(false);
      } else {
        router.push("/");
      }
    };
    if (!loadingCurrentUser) getMember();
  }, [router, workspaceId, user, loadingCurrentUser]);

  return { loading };
}
