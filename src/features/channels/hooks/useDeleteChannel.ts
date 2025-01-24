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
          for (const channel of currentChannlesState.currentChannels) {
            let index = 0;
            if (channel.id === response.channel?.id) {
              // if you are delete the last channel  , you should be redirected to the workspace page ,
              // to re-create the genreal page automatically
              if (currentChannlesState.currentChannels.length === 1) {
                router.replace(
                  `/workspace/${currentWorkspaceState.workSpace?.id}`
                );
              } else {
                updateCurrentChannels([
                  ...currentChannlesState.currentChannels.slice(0, index),
                  ...currentChannlesState.currentChannels.slice(index),
                ]);

                router.push(
                  `/workspace/${currentWorkspaceState.workSpace?.id}`
                );
              }
            }
            index++;
          }
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
