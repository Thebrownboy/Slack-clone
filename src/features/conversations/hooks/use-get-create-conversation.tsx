import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { Conversation } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { getOrCreateConversationAction } from "@/utils/conversations-actions";

export default function useCreateOrGetConversations(otherMemberId: string) {
  const { workspaceId } = useGetWorkspaceId();
  const { userId } = useGetUserId();
  const [createConversationState, updateCreateConversationState] = useState({
    errorMsg: "",
    isPending: false,
  });
  const [currentConversation, updateCurrentConversation] =
    useState<Conversation | null>(null);
  const submitCreateorGetAction = useCallback(async () => {
    if (userId && workspaceId && otherMemberId) {
      updateCreateConversationState((state) => ({ ...state, isPending: true }));
      const response = await getOrCreateConversationAction({
        otherMemberId,
        userId,
        workspaceId: workspaceId as string,
      });
      updateCurrentConversation(response);
      updateCreateConversationState((state) => ({
        ...state,
        isPending: false,
      }));
    }
  }, [otherMemberId, userId, workspaceId]);

  useEffect(() => {
    submitCreateorGetAction();
  }, [submitCreateorGetAction]);

  return {
    createConversationState,
    currentConversation,
    submitCreateorGetAction,
  };
}
