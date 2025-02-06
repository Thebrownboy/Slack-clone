import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { useCurrentMember } from "@/state-store/store";
import { tmember } from "@/types/common-types";
import { getFullMemberByUserIdAndWorkSpaceIdAction } from "@/utils/workspaces-actions";
import { useEffect, useState } from "react";

function useGetFullMember(memberId: string) {
  const { workspaceId } = useGetWorkspaceId();
  const [fullMember, updateFullMember] = useState<
    | (tmember & { name?: string | null | undefined; image?: string | null })
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
