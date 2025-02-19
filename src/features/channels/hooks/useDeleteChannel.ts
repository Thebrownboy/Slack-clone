import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import {
  deleteChannelAction,
  triggerDeleteChannelEvent,
} from "@/utils/channels-actions";
import { useState } from "react";

export default function useDeleteChannel() {
  const { userId } = useGetUserId();
  const { channelId } = useGetChannelId();
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitDeleteAction = async () => {
    if (userId) {
      updateIsPending(true);
      const response = await deleteChannelAction(userId, channelId as string);
      if (!response.success) {
        updateErrorMsg(response.msg);
      } else {
        console.log("I will trigerer ");
        triggerDeleteChannelEvent(response.channel);
      }
      updateIsPending(false);
    }
  };

  return {
    submitDeleteAction,
    errorMsg,
    isPending,
  };
}
