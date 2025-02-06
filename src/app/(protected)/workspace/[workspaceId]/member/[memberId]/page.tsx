"use client";

import useGetMemberId from "@/hooks/useGetMemberId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";

export default function MemberIdPage() {
  const { workspaceId } = useGetWorkspaceId();
  const { memberId } = useGetMemberId();
  return (
    <div>
      MemberIdPage {workspaceId} member {memberId}
    </div>
  );
}
