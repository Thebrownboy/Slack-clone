import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentConversationMessages } from "@/state-store/conversation-store";
import { getMessagesAction } from "@/utils/messages-actions";
import { useEffect, useMemo, useState } from "react";
export default function useGetConversationMessage(
  conversationId: string | undefined
) {
  const BATCH_SIZE = 5;
  const { userId } = useGetUserId();
  const {
    currentConversationsMessages,
    updateMessages,
    updateSkip,
    updateConversationId,
  } = useCurrentConversationMessages();

  useEffect(() => {
    updateConversationId(conversationId as string);
  }, [conversationId, updateConversationId]);
  const currentConversationMessages = useMemo(() => {
    console.log(
      "I have changed ",
      currentConversationsMessages[conversationId as string]
    );
    return currentConversationsMessages[conversationId as string];
  }, [conversationId, currentConversationsMessages]);
  const [loading, updateLoading] = useState(false);
  // const [skip, updateSkip] = useState(0);
  const [take, updateTake] = useState(5);
  const [noMore, updateNoMore] = useState(false);
  const [getMore, updateGetMore] = useState(false);
  const getMoreMessages = () => {
    if (!currentConversationMessages) return;
    updateGetMore(true);
    updateSkip(
      currentConversationMessages.skip + BATCH_SIZE,
      conversationId as string
    );
  };
  useEffect(() => {
    const getMessages = async () => {
      if (!getMore) updateLoading(true);
      const messages = await getMessagesAction(
        userId as string,
        undefined,
        conversationId,
        undefined,
        currentConversationMessages?.skip || 0,
        take
      );
      if (messages && messages.length !== 0) {
        updateMessages(conversationId as string, messages);
      }
      if (messages && messages.length == 0) updateNoMore(true);
      updateLoading(false);
      updateGetMore(false);
    };
    // refetch only if you don't fetch previuosly
    if (!currentConversationMessages || (getMore && !noMore)) getMessages();
  }, [
    noMore,
    getMore,
    currentConversationMessages,
    userId,
    conversationId,
    take,
    updateMessages,
  ]);
  // returning the updateSkip and the updateTake is essentail for pagination while you are loading more messages
  // and returning the updateMessage is cruial for deleting all the messages when you navigate to another channel or another conversaition
  return {
    updateSkip,
    currentConversationMessages,
    getMore,
    loading,
    getMoreMessages,
    noMore,
    updateTake,
  };
}
