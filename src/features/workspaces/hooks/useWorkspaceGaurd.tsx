import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useWorkspaceGaurd() {
  const { workspaceId } = useParams();
  const { data } = useSession();

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log("the data is ", data, router, workspaceId);
  useEffect(() => {
    const getMember = async () => {
      // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
      // if exists so the user has the right to go to this workspace , if not the user is not allowed
      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        data?.user.id || "",
        workspaceId as string
      );
      if (member) {
        setLoading(false);
      } else {
        router.push("/");
      }
    };
    getMember();
  }, [router, workspaceId, data]);

  return { loading };
}
