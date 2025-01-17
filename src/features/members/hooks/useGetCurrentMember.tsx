import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

type tmember = {
  userId: string;
  workspaceId: string;
  role: "member" | "admin";
};

export default function useGetCurrentMember(
  workspaceId: string,
  userId: string
) {
  const [member, setMember] = useState<null | tmember>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getMember = async () => {
      // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
      // if exists so the user has the right to go to this workspace , if not the user is not allowed
      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        userId,
        workspaceId
      );
      setMember(member);
      setLoading(false);
    };
    if (workspaceId) getMember();
  }, [workspaceId, userId]);
  return { member, loading };
}
