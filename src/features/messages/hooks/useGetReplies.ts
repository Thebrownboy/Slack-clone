import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { tFulldataMessage } from "@/types/common-types";
import { getMessagesAction } from "@/utils/messages-actions";
import { useEffect, useState } from "react";
export default function useGetReplies(parentMessageId: string | undefined) {
  const BATCH_SIZE = 5;
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();
  const [currentThreadMessages, updateCurrentThreadMessage] = useState<
    tFulldataMessage[] | undefined
  >([]);

  const [loading, updateLoading] = useState(false);
  const [skip, updateSkip] = useState(0);
  const [take, updateTake] = useState(5);
  // no more data so no requests will be sent
  const [noMore, updateNoMore] = useState(false);

  // request more data
  const [getMore, updateGetMore] = useState(true);

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
      if (messages && messages.length == 0) {
        console.log("I will update no more");
        updateNoMore(true);
      }
      if (messages)
        updateCurrentThreadMessage((prev) => {
          return [...(prev || []), ...(messages || [])];
        });

      updateLoading(false);
      updateGetMore(false);
    };
    // refetch only if you don't fetch previuosly
    if (!loading && parentMessageId && !noMore && getMore) getReplies();
  }, [
    noMore,
    loading,
    updateCurrentThreadMessage,
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
