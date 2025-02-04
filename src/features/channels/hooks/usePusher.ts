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
    console.log("I will be called pusher ");

    if (channelId && userId && workspaceId) {
      const pusherChannel = pusherClient.subscribe(workspaceId as string);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("incomming-message", (data: any) => {
        addNewMessage(
          data.channelId as string,
          data,
          data.channelId === channelId
        );
      });

      // if (parentMessageId) {
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   pusherChannel.bind("incomming-reply", (data: any) => {
      //     addOneReply(data);
      //   });
      // }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("toggle-reaction", (data: any) => {
        toggleReactionOnMessage(
          data.channelId as string,
          data.messageIndex,
          data.value,
          data.userId,
          channelId === data.channelId
        );
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("edit-message", (data: any) => {
        editMessage(
          data.message.channelId as string,
          data.messageIndex,
          data.message.body,
          data.message.updatedAt,
          channelId === data.channelId
        );
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("delete-message", (data: any) => {
        deleteMessage(
          data.channelId as string,
          data.messageIndex,
          channelId === data.channelId
        );
      });
    }
    return () => {
      if (workspaceId) {
        pusherClient.unsubscribe(workspaceId as string);
      }
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
