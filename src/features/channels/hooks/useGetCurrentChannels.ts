import { useCurrentChannels } from "@/state-store/store";
import { getcurrentChannelsAction } from "@/utils/channels-actions";
import { useEffect } from "react";

export default function useGetCurrentChannels(
  workspaceId: string,
  userId: string
) {
  const { currentChannlesState, updateCurrentChannels } = useCurrentChannels(
    (state) => state
  );

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await getcurrentChannelsAction(workspaceId, userId);
        updateCurrentChannels(response);
      } catch {}
    };
    if (!currentChannlesState.currentChannels) getChannels();
  }, [workspaceId, userId, updateCurrentChannels, currentChannlesState]);

  return {
    ...currentChannlesState,
  };
}
