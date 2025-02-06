import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { tFulldataMessage } from "@/types/common-types";
import { getMessagesAction } from "@/utils/messages-actions";
import { useEffect, useState } from "react";
export default function useGetConversationMessage(
  conversationId: string | undefined
) {
  const BATCH_SIZE = 5;
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();
  const [conversationMessage, updateConversationMessages] = useState<
    tFulldataMessage[]
  >([]);
  const [loading, updateLoading] = useState(false);
  // const [skip, updateSkip] = useState(0);
  const [take, updateTake] = useState(5);
  const [noMore, updateNoMore] = useState(false);
  const [getMore, updateGetMore] = useState(false);
  const [skip, updateSkip] = useState(0);
  const getMoreMessages = () => {
    updateGetMore(true);
    updateSkip(skip + BATCH_SIZE);
  };
  useEffect(() => {
    const getMessages = async () => {
      if (!getMore) updateLoading(true);
      const messages = await getMessagesAction(
        userId as string,
        channelId as string,
        conversationId,
        undefined,
        skip,
        take
      );
      if (messages && messages.length !== 0)
        updateConversationMessages(messages);
      if (messages && messages.length == 0) updateNoMore(true);
      updateLoading(false);
      updateGetMore(false);
    };
    // refetch only if you don't fetch previuosly
    if (!conversationMessage || getMore) getMessages();
  }, [
    conversationMessage,
    updateConversationMessages,
    channelId,
    conversationId,
    getMore,
    skip,
    take,
    userId,
  ]);

  // returning the updateSkip and the updateTake is essentail for pagination while you are loading more messages
  // and returning the updateMessage is cruial for deleting all the messages when you navigate to another channel or another conversaition
  return {
    updateSkip,
    conversationMessage,
    loading,
    getMoreMessages,
    noMore,
    updateTake,
  };
}
