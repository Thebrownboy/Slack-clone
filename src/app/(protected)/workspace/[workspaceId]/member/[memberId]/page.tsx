"use client";

import { Conversation } from "@/features/conversations/components/conversation";
import useCreateOrGetConversations from "@/features/conversations/hooks/use-get-create-conversation";
import useGetMemberId from "@/hooks/useGetMemberId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { AlertTriangle, Loader } from "lucide-react";
import React, { useEffect } from "react";

type tParams = {
  params: Promise<{
    memberId: string;
  }>;
};
export default function MemberIdPage({ params }: tParams) {
  const { workspaceId } = useGetWorkspaceId();
  const { memberId } = useGetMemberId();
  const { memberId: otherMemberId } = React.use(params);
  const { currentConversation, createConversationState } =
    useCreateOrGetConversations(otherMemberId);

  if (createConversationState.isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!currentConversation) {
    return (
      <div className="h-full flex flex-col gap-y-2  items-center justify-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span>Conversation not found </span>
      </div>
    );
  }
  return (
    <div>
      <Conversation id={currentConversation.id} />
    </div>
  );
}
