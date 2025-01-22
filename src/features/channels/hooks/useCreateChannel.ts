import { useCreateChannelModal, useCurrentChannels } from "@/state-store/store";
import { createChannelAction } from "@/utils/channels-actions";
import React, { useState } from "react";

export default function useCreateChannel(
  workdspaceId: string,
  userId: string | undefined
) {
  const { isOpen, setOpen } = useCreateChannelModal((state) => state);
  const [name, updateName] = useState("");
  const [createChannelState, updateCreateChannelState] = useState({
    errorMsg: "",
    isPending: false,
  });
  const { updateCurrentChannels, currentChannlesState } = useCurrentChannels(
    (state) => state
  );
  const submitCreateAction = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (userId) {
      updateCreateChannelState((state) => ({ ...state, isPending: true }));
      event.preventDefault();
      const response = await createChannelAction(workdspaceId, userId, name);
      if (response.success && !currentChannlesState.currentChannels) {
        updateCurrentChannels([response.channel]);
      } else if (response.success && currentChannlesState.currentChannels) {
        updateCurrentChannels([
          response.channel,
          ...currentChannlesState.currentChannels,
        ]);
      }

      updateCreateChannelState((prevState) => ({
        ...prevState,
        errorMsg: response.err,
        isPending: false,
      }));
      setOpen(false);
    }
  };

  return {
    submitCreateAction,
    channelName: name,
    updateName,
    isOpen,
    setOpen,
    error: createChannelState.errorMsg,
    isPending: createChannelState.isPending,
  };
}
