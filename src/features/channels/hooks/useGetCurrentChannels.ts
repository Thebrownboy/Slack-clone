import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentChannels, useCurrentWorkspace } from "@/state-store/store";
import { getcurrentChannelsAction } from "@/utils/channels-actions";
import { useEffect } from "react";

export default function useGetCurrentChannels() {
  const { currentChannlesState, updateCurrentChannels } = useCurrentChannels(
    (state) => state
  );

  const { userId } = useGetUserId();

  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace();
  useEffect(() => {
    const getChannels = async () => {
      console.log("I will fetch new channels");
      try {
        const response = await getcurrentChannelsAction(
          workSpace?.id as string,
          userId as string
        );
        updateCurrentChannels(response);
      } catch {}
    };

    getChannels();
  }, [workSpace, updateCurrentChannels, userId]);

  return {
    ...currentChannlesState,
  };
}
