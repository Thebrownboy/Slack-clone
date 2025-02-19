import useGetUserId from "@/hooks/useGetUserId";
import { getcurrentChannelsAction } from "@/utils/channels-actions";
import { useEffect } from "react";
import useGetChannelId from "@/hooks/useGetChannelId";
import { useCurrentChannels } from "@/state-store/channel-store";
import { useCurrentWorkspace } from "@/state-store/workspace-store";

export default function useGetCurrentChannels() {
  const { currentChannlesState, updateCurrentChannels } = useCurrentChannels(
    (state) => state
  );
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();

  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace();
  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await getcurrentChannelsAction(
          workSpace?.id as string,
          userId as string
        );
        console.log(response);
        updateCurrentChannels(response);
      } catch {}
    };
    if (currentChannlesState && !currentChannlesState.currentChannels) {
      getChannels();
    }
  }, [
    workSpace,
    updateCurrentChannels,
    userId,
    channelId,
    currentChannlesState,
  ]);

  return {
    ...currentChannlesState,
  };
}
