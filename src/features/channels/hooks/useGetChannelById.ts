import useGetChannelId from "@/hooks/useGetChannelId";
import { useCurrentChannels } from "@/state-store/store";

import { useMemo } from "react";

export default function useGetChannelById() {
  const { channelId } = useGetChannelId();
  const { currentChannlesState } = useCurrentChannels((state) => state);
  console.log(currentChannlesState);
  const currentChannel = useMemo(() => {
    if (currentChannlesState.currentChannels) {
      for (const channel of currentChannlesState.currentChannels) {
        if (channel.id === channelId) return channel;
      }
    } else {
      return null;
    }
  }, [channelId, currentChannlesState.currentChannels]);
  return {
    currentChannelState: {
      loading: currentChannlesState.isLoading,
      channel: currentChannel,
    },
  };
}
