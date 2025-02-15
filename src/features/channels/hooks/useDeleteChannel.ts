import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentChannels } from "@/state-store/channel-store";
import { useCurrentWorkspace } from "@/state-store/workspace-store";
import { deleteChannelAction } from "@/utils/channels-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useDeleteChannel() {
  const { userId } = useGetUserId();
  const { channelId } = useGetChannelId();
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
      const response = await deleteChannelAction(userId, channelId as string);
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
