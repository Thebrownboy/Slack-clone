import { tChannel } from "@/types/common-types";
import { getChannelByIdAction } from "@/utils/channels-actions";
import { useEffect, useState } from "react";

export default function useGetChannelById(userId: string, channelId: string) {
  const [currentChannelState, updateCurrentChannelState] = useState<{
    loading: boolean;
    channel: tChannel | null;
  }>({ channel: null, loading: true });
  useEffect(() => {
    const getChannels = async () => {
      try {
        const channel = await getChannelByIdAction(userId, channelId);
        updateCurrentChannelState({
          channel,
          loading: false,
        });
      } catch {
        updateCurrentChannelState({
          loading: false,
          channel: null,
        });
      }
    };
    getChannels();
  }, [userId, channelId]);

  return { currentChannelState };
}
