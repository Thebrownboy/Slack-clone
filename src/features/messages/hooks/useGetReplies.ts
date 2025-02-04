import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentRepiles } from "@/state-store/store";
import { getMessagesAction } from "@/utils/messages-actions";
import { useEffect, useState } from "react";
export default function useGetReplies(parentMessageId: string | undefined) {
  const BATCH_SIZE = 5;
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();
  const {
    updateThreadReplies,
    threadReplies,
    parentMessage,
    updateParentMessage,
    putThreadReplies,
  } = useCurrentRepiles();

  useEffect(() => {
    putThreadReplies([], parentMessageId as string);
  }, [parentMessageId, updateParentMessage, putThreadReplies]);

  const [loading, updateLoading] = useState(false);
  const [skip, updateSkip] = useState(0);
  const [take, updateTake] = useState(5);
  // no more data so no requests will be sent
  const [noMore, updateNoMore] = useState(false);

  // request more data
  const [getMore, updateGetMore] = useState(false);

  const getMoreMessages = () => {
    updateGetMore(true);
    updateSkip(skip + BATCH_SIZE);
  };
  useEffect(() => {
    const getReplies = async () => {
      console.log(" I will fetch");
      if (!getMore) updateLoading(true);
      const messages = await getMessagesAction(
        userId as string,
        undefined,
        undefined,
        parentMessageId,
        skip,
        take
      );
      console.log("This is the messages", messages);
      if (messages && messages.length == 0) {
        console.log("TRUE TRUE TRUE ");
        updateNoMore(true);
      }
      if (messages && messages.length !== 0) {
        console.log("FALSE FALSE");
        updateThreadReplies(messages);
      }

      updateLoading(false);
      updateGetMore(false);
    };
    if (parentMessageId !== parentMessage) {
      updateParentMessage(parentMessageId as string);
    }
    // refetch only if you don't fetch previuosly
    console.log(
      "here is the her ",
      !loading,
      parentMessageId,
      !noMore,
      getMore,
      !threadReplies?.length
    );
    if (
      !loading &&
      parentMessageId &&
      !noMore &&
      (getMore || !threadReplies?.length)
    )
      getReplies();
  }, [
    threadReplies,
    parentMessage,
    updateParentMessage,
    updateThreadReplies,
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
    threadReplies,
  };
}
