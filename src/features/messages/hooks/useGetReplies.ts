import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentThreadData } from "@/state-store/thread-messages";
import { getMessagesAction } from "@/utils/messages-actions";
import { useEffect, useState } from "react";
export default function useGetReplies(parentMessageId: string | undefined) {
  const {
    updateSkip,
    parentMessageId: parentMessage,
    currentThreadData: { messages: currentThreadMessages, skip },
    updateCurrentThreadData,
  } = useCurrentThreadData();
  const BATCH_SIZE = 10;
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();
  const [loading, updateLoading] = useState(false);
  const [take, updateTake] = useState(10);
  // no more data so no requests will be sent
  const [noMore, updateNoMore] = useState(false);

  // request more data
  const [getMore, updateGetMore] = useState(true);

  useEffect(() => {
    updateLoading(false);
    updateNoMore(false);
    updateGetMore(true);
  }, [parentMessage]);
  useEffect(() => {
    console.log(skip);
  }, [skip]);
  const getMoreMessages = () => {
    updateGetMore(true);
    updateSkip(skip + BATCH_SIZE);
  };
  useEffect(() => {
    const getReplies = async () => {
      if (!getMore) updateLoading(true);
      const messages = await getMessagesAction(
        userId as string,
        undefined,
        undefined,
        parentMessageId,
        skip,
        take
      );

      console.log("This is messages ", messages);
      if (messages && messages.length == 0) {
        updateNoMore(true);
      }
      if (messages && messages.length !== 0) {
        updateCurrentThreadData(messages);
      }

      updateLoading(false);
      updateGetMore(false);
    };

    // refetch only if you don't fetch previuosly

    if (
      !loading &&
      parentMessageId &&
      !noMore &&
      (getMore || !currentThreadMessages?.length)
    )
      getReplies();
  }, [
    updateCurrentThreadData,
    currentThreadMessages,
    parentMessage,
    noMore,
    loading,
    getMore,
    userId,
    channelId,
    parentMessageId,
    skip,
    take,
  ]);

  // returning the updateSkip and the updateTake is essentail for pagination while you are loading more messages
  // and returning the updateMessage is cruial for deleting all the messages when you navigate to another channel or another conversaition
  return {
    updateSkip,
    updateTake,
    loading,
    noMore,
    getMoreMessages,
    getMore,
    currentThreadMessages,
  };
}
