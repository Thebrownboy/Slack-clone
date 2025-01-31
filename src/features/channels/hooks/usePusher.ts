import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import pusherClient from "@/lib/pusher-client";
import { useCurrentMessages } from "@/state-store/store";
import { useEffect } from "react";

export default function usePusher() {
  const { workspaceId } = useGetWorkspaceId();
  const { addNewMessage, toggleReactionOnMessage, editMessage, deleteMessage } =
    useCurrentMessages();
  const { userId } = useGetUserId();
  const { channelId } = useGetChannelId();
  useEffect(() => {
    if (channelId && userId && workspaceId) {
      const pusherChannel = pusherClient.subscribe(workspaceId as string);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("incomming-message", (data: any) => {
        // the message is comming from another user
        // console.log(userState.user?.id);
        if (channelId === data.channelId) {
          addNewMessage(data);
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("toggle-reaction", (data: any) => {
        // console.log(userState.user?.id);
        if (channelId === data.channelId) {
          toggleReactionOnMessage(data.messageIndex, data.value, data.userId);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("edit-message", (data: any) => {
        if (channelId === data.message.channelId) {
          editMessage(
            data.messageIndex,
            data.message.body,
            data.message.updatedAt
          );
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("delete-message", (data: any) => {
        if (channelId === data.channelId) {
          deleteMessage(data.messageIndex);
        }
      });
    }
    return () => {
      if (workspaceId) pusherClient.unsubscribe(workspaceId as string);
    };
  }, [
    channelId,
    addNewMessage,
    userId,
    workspaceId,
    toggleReactionOnMessage,
    editMessage,
    deleteMessage,
  ]);
}
