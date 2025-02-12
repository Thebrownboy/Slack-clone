import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { tmember } from "@/types/common-types";
import { getFullMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

function useGetFullMember(memberId: string) {
  const { workspaceId } = useGetWorkspaceId();
  const [fullMember, updateFullMember] = useState<
    | (tmember & {
        name?: string | null | undefined;
        image?: string | null;
        email?: string | null | undefined;
      })
    | null
  >(null);

  useEffect(() => {
    const getFullMember: () => void = async () => {
      const fullMember = await getFullMemberByUserIdAndWorkSpaceIdAction(
        memberId,
        workspaceId as string
      );
      updateFullMember(fullMember);
    };
    getFullMember();
  }, [memberId, workspaceId]);

  return { fullMember };
}

export default useGetFullMember;
