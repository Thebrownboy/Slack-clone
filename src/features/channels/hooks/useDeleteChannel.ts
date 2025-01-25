import { useCurrentChannels, useCurrentWorkspace } from "@/state-store/store";
import { deleteChannelAction } from "@/utils/channels-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useDeleteChannel(
  userId: string | undefined,
  channelId: string = ""
) {
  const router = useRouter();
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const { currentChannlesState, updateCurrentChannels } = useCurrentChannels(
    (state) => state
  );
  const { currentWorkspaceState } = useCurrentWorkspace((state) => state);
  const submitDeleteAction = async () => {
    if (userId) {
      updateIsPending(true);
      const response = await deleteChannelAction(userId, channelId);
      if (!response.success) {
        updateErrorMsg(response.msg);
      } else {
        if (currentChannlesState.currentChannels) {
          router.push(`/workspace/${currentWorkspaceState.workSpace?.id}`);
          updateCurrentChannels(
            currentChannlesState.currentChannels.filter(
              (channel) => channel.id !== response.channel?.id
            )
          );
        }
      }
      updateIsPending(false);
    }
  };

  return {
    submitDeleteAction,
    errorMsg,
    isPending,
  };
}
