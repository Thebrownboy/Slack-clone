import { tChannel } from "@/types/common-types";
import { getcurrentChannelsAction } from "@/utils/channels-actions";
import { useEffect, useState } from "react";

export default function useGetCurrentChannels(
  workspaceId: string,
  userId: string
) {
  const [currentChannelsState, updateCurrentChannelState] = useState<{
    isLoading: boolean;
    currentChannels: tChannel[] | null;
  }>({
    isLoading: true,
    currentChannels: [],
  });

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await getcurrentChannelsAction(workspaceId, userId);
        updateCurrentChannelState((state) => ({
          ...state,
          isLoading: false,
          currentChannels: response,
        }));
      } catch {
        updateCurrentChannelState((state) => ({ ...state, isLoading: false }));
      }
    };
    getChannels();
  }, [workspaceId, userId]);

  return {
    ...currentChannelsState,
  };
}
