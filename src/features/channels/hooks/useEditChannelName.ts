import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentChannels } from "@/state-store/store";
import { editChannelNameAction } from "@/utils/channels-actions";
import React, { useState } from "react";
import { toast } from "sonner";

export default function useEditChannel(channelName: string) {
  const { userId } = useGetUserId();
  const { channelId } = useGetChannelId();
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(channelName);
  const [editChannelState, updateEditChannelState] = useState({
    errorMsg: "",
    isPending: false,
  });
  const { updateCurrentChannels, currentChannlesState } = useCurrentChannels(
    (state) => state
  );
  const submitEditNameAction = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (userId) {
      updateEditChannelState((state) => ({ ...state, isPending: true }));
      event.preventDefault();
      const response = await editChannelNameAction(
        userId,
        channelId as string,
        value
      );
      if (
        response.success &&
        currentChannlesState.currentChannels &&
        response.channel
      ) {
        let index = 0;
        for (const channel of currentChannlesState.currentChannels) {
          if (channel.id === channelId) {
            updateCurrentChannels([
              ...currentChannlesState.currentChannels.slice(0, index),
              response.channel,
              ...currentChannlesState.currentChannels.slice(index + 1),
            ]);
          }
          index++;
        }
      }
      updateEditChannelState((state) => ({
        ...state,
        isPending: false,
        errorMsg: response.msg,
      }));
      if (response.success) {
        toast.success("Channel name changed successfully");
      } else {
        toast.error(response.msg);
      }
      setEditOpen(false);
    }
  };

  return {
    editOpen,
    setEditOpen,
    submitEditNameAction,
    setValue,
    value,
    editChannelState,
  };
}
