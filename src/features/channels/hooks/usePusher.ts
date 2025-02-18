import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import pusherClient from "@/lib/pusher-client";
import { useCurrentMessages } from "@/state-store/channels-messages";
import { useCurrentConversationMessages } from "@/state-store/conversation-store";
import { useCurrentThreadData } from "@/state-store/thread-messages";

import { useEffect } from "react";

export default function usePusher() {
  const { workspaceId } = useGetWorkspaceId();
  const { addNewMessage, toggleReactionOnMessage, editMessage, deleteMessage } =
    useCurrentMessages();
  const {
    addNewMessage: addNewConversationMessage,
    toggleReactionOnMessage: toggleReactiononConversationMessage,
    editMessage: editConversationMessage,
    deleteMessage: deleteConversationMessage,
  } = useCurrentConversationMessages();
  const {
    addReplyOnCurrentThread,
    toggleReactionOnAThread,
    editThreadMessage,
    deleteMessage: deleteThreadData,
  } = useCurrentThreadData();
  const { userId } = useGetUserId();
  const { channelId } = useGetChannelId();
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
    }
    return () => {
      if (workspaceId) {
        pusherClient.unsubscribe(workspaceId as string);
      }
    };
  }, [
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
