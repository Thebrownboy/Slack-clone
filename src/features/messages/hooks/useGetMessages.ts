import { useCurrentMessages } from "@/state-store/store";
import { getMessagesAction } from "@/utils/messages-actions";
import { useEffect, useState } from "react";
export default function useGetMessages(
  userId: string | null,
  channelId: string | undefined,
  conversationId: string | undefined,
  parentMessageId: string | undefined
) {
  const { currentChannelMessages, updateMessages } = useCurrentMessages(
    (state) => state
  );
  const [loading, updateLoading] = useState(false);
  const [skip, updateSkip] = useState(0);
  const [take, updateTake] = useState(10);
  const [noMore, updateNoMore] = useState(false);
  useEffect(() => {
    const getMessages = async () => {
      updateLoading(true);
      const messages = await getMessagesAction(
        userId,
        channelId,
        conversationId,
        parentMessageId,
        skip,
        take
      );
      if (messages && messages.length !== 0) updateMessages(messages);
      if (messages && messages.length == 0) updateNoMore(true);
      updateLoading(false);
    };

    getMessages();
  }, [
    userId,
    channelId,
    conversationId,
    parentMessageId,
    skip,
    take,
    updateMessages,
  ]);

  // returning the updateSkip and the updateTake is essentail for pagination while you are loading more messages
  // and returning the updateMessage is cruial for deleting all the messages when you navigate to another channel or another conversaition
  return {
    updateSkip,
    updateTake,
    currentChannelMessages,
    loading,
    noMore,
  };
}
