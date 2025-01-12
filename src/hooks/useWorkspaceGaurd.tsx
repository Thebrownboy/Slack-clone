import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useWorkspaceGaurd() {
  const { workspaceId } = useParams();
  const { data } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const getMember = async () => {
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
