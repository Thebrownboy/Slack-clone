import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { getMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { Members } from "@prisma/client";
import { useEffect, useState } from "react";

export default function useGetMemberbyId(userId: string) {
  const { workspaceId } = useGetWorkspaceId();
  const [member, updateMember] = useState<Members | null>(null);
  const [loading, updateLoading] = useState(true);
  useEffect(() => {
    const getMember = async () => {
      // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
      // if exists so the user has the right to go to this workspace , if not the user is not allowed
      const member = await getMemberByUserIdAndWorkSpaceIdAction(
        userId as string,
        workspaceId as string
      );
      updateMember(member);
      updateLoading(false);
    };
    if (workspaceId) getMember();
  }, [workspaceId, userId]);
  return {
    member,
    loading,
  };
}
