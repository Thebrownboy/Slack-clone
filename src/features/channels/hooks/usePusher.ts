import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import pusherClient from "@/lib/pusher-client";
import { useCurrentChannels } from "@/state-store/channel-store";
import { useCurrentMessages } from "@/state-store/channels-messages";
import { useCurrentConversationMessages } from "@/state-store/conversation-store";
import { useCurrentThreadData } from "@/state-store/thread-messages";
import { useCurrentWorkspace } from "@/state-store/workspace-store";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function usePusher() {
  const router = useRouter();
  const { workspaceId } = useGetWorkspaceId();
  const { addNewMessage, toggleReactionOnMessage, editMessage, deleteMessage } =
    useCurrentMessages();
  const {
    addNewMessage: addNewConversationMessage,
    toggleReactionOnMessage: toggleReactiononConversationMessage,
    editMessage: editConversationMessage,
    deleteMessage: deleteConversationMessage,
  } = useCurrentConversationMessages();
  const { updateCurrentChannels, currentChannlesState } = useCurrentChannels();
  const {
    addReplyOnCurrentThread,
    toggleReactionOnAThread,
    editThreadMessage,
    deleteMessage: deleteThreadData,
  } = useCurrentThreadData();
  const { userId } = useGetUserId();
  const { channelId } = useGetChannelId();
  const { currentWorkspaceState } = useCurrentWorkspace((state) => state);
  useEffect(() => {
    if (userId && workspaceId) {
      const pusherChannel = pusherClient.subscribe(workspaceId as string);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("incomming-message", (data: any) => {
        if (data.conversationId) {
          addNewConversationMessage(data.conversationId, data);
        }
        addNewMessage(
          data.channelId as string,
          data,
          data.channelId === channelId
        );
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("toggle-reaction", (data: any) => {
        if (data.parentId) {
          toggleReactionOnAThread(
            data.parentId,
            data.messageIndex,
            data.userId,
            data.value
          );
          return;
        }
        if (data.conversationId) {
          toggleReactiononConversationMessage(
            data.conversationId,
            data.messageIndex,
            data.value,
            data.userId
          );
          return;
        }

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
        if (data.parentId) {
          editThreadMessage(
            data.parentId,
            data.messageIndex,
            data.message.body,
            data.message.updatedAt
          );
          return;
        }
        if (data.conversationId) {
          editConversationMessage(
            data.message.conversationId as string,
            data.messageIndex,
            data.message.body,
            data.message.updatedAt
          );
          return;
        }
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
        if (data.parentId) {
          deleteThreadData(
            data.parentId,
            data.messageIndex,
            data.channelId,
            data.conversationId
          );
          return;
        }
        if (data.conversationId) {
          deleteConversationMessage(
            data.conversationId as string,
            data.messageIndex
          );
          return;
        }
        deleteMessage(
          data.channelId as string,
          data.messageIndex,
          channelId === data.channelId
        );
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("reply-on-thread", (data: any) => {
        addReplyOnCurrentThread(data);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("create-channel", (data: any) => {
        console.log("Yes I am here ", currentChannlesState.currentChannels);

        updateCurrentChannels([
          ...(currentChannlesState.currentChannels || []),
          data,
        ]);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("delete-channel", (data: any) => {
        console.log("I am here ", data);
        if (currentChannlesState.currentChannels) {
          if (channelId === data.id)
            router.push(`/workspace/${currentWorkspaceState.workSpace?.id}`);

          updateCurrentChannels(
            currentChannlesState.currentChannels.filter(
              (channel) => channel.id !== data.id
            )
          );
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("edit-channel", (data: any) => {
        let index = 0;
        if (currentChannlesState.currentChannels)
          for (const channel of currentChannlesState.currentChannels || []) {
            if (channel.id === data.id) {
              updateCurrentChannels([
                ...currentChannlesState.currentChannels.slice(0, index),
                data,
                ...currentChannlesState.currentChannels.slice(index + 1),
              ]);
            }
            index++;
          }
      });
    }
    return () => {
      if (workspaceId) {
        pusherClient.unsubscribe(workspaceId as string);
      }
    };
  }, [
    router,
    currentWorkspaceState,
    currentChannlesState,
    updateCurrentChannels,
    addNewConversationMessage,
    deleteConversationMessage,
    editConversationMessage,
    toggleReactiononConversationMessage,
    toggleReactionOnAThread,
    editThreadMessage,
    deleteThreadData,
    addReplyOnCurrentThread,
    channelId,
    addNewMessage,
    userId,
    workspaceId,
    toggleReactionOnMessage,
    editMessage,
    deleteMessage,
  ]);
}
