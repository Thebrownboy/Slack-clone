import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import {
  useCreateChannelModal,
  useCurrentChannels,
} from "@/state-store/channel-store";
import {
  createChannelAction,
  triggerCreateChannelEvent,
} from "@/utils/channels-actions";
import React, { useState } from "react";

export default function useCreateChannel() {
  const { workspaceId } = useGetWorkspaceId();
  const { userId } = useGetUserId();
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
      const response = await createChannelAction(
        workspaceId as string,
        userId,
        name
      );
      if (response.success) {
        triggerCreateChannelEvent(response.channel);
      }
      // redirect to channel
      updateCreateChannelState((prevState) => ({
        ...prevState,
        errorMsg: response.err,
        isPending: false,
      }));
      updateName("");
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
