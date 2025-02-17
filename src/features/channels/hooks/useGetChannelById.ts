import useGetChannelId from "@/hooks/useGetChannelId";
import { useCurrentChannels } from "@/state-store/channel-store";

import { useMemo } from "react";

export default function useGetChannelById() {
  const { channelId } = useGetChannelId();
  const { currentChannlesState } = useCurrentChannels((state) => state);
  const currentChannel = useMemo(() => {
    console.log(currentChannlesState.currentChannels, "Here channels");
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
