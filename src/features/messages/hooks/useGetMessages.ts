import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentMessages } from "@/state-store/channels-messages";
import { useCurrentThreadData } from "@/state-store/thread-messages";
import { getMessagesAction } from "@/utils/messages-actions";
import { useEffect, useMemo, useState } from "react";
export default function useGetMessages(
  conversationId: string | undefined,
  parentMessageId: string | undefined
) {
  const { restData, updateParentMessageId, updateParentMessageIndex } =
    useCurrentThreadData();
  useEffect(() => {
    restData();
    updateParentMessageId(null);
    updateParentMessageIndex(null);
  }, [updateParentMessageIndex, updateParentMessageId, restData]);
  const BATCH_SIZE = 5;
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();
  const { currentChannelsMessages, updateMessages, updateSkip } =
    useCurrentMessages();
  const currentChannelMessages = useMemo(() => {
    return currentChannelsMessages[channelId as string];
  }, [channelId, currentChannelsMessages]);
  const [loading, updateLoading] = useState(false);
  // const [skip, updateSkip] = useState(0);
  const [take, updateTake] = useState(5);
  const [noMore, updateNoMore] = useState(false);
  const [getMore, updateGetMore] = useState(false);

  const getMoreMessages = () => {
    updateGetMore(true);
    updateSkip(currentChannelMessages.skip + BATCH_SIZE, channelId as string);
  };
  useEffect(() => {
    const getMessages = async () => {
      if (!getMore) updateLoading(true);
      const messages = await getMessagesAction(
        userId as string,
        channelId as string,
        conversationId,
        parentMessageId,
        currentChannelMessages?.skip || 0,
        take
      );
      if (messages && messages.length !== 0)
        updateMessages(channelId as string, messages);
      if (messages && messages.length == 0) updateNoMore(true);
      updateLoading(false);
      updateGetMore(false);
    };
    // refetch only if you don't fetch previuosly
    if (!currentChannelMessages || getMore) getMessages();
  }, [
    getMore,
    currentChannelMessages,
    userId,
    channelId,
    conversationId,
    parentMessageId,
    take,
    updateMessages,
  ]);

  // returning the updateSkip and the updateTake is essentail for pagination while you are loading more messages
  // and returning the updateMessage is cruial for deleting all the messages when you navigate to another channel or another conversaition
  return {
    updateSkip,
    updateTake,
    currentChannelMessages: currentChannelMessages?.messages || [],
    loading,
    noMore,
    getMoreMessages,
    getMore,
  };
}
