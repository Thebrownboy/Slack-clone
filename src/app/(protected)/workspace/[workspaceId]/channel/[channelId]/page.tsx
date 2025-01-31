"use client";

import useGetChannelById from "@/features/channels/hooks/useGetChannelById";
import { useCurrentMessages, useCurrentUser } from "@/state-store/store";
import { Loader, TriangleAlert } from "lucide-react";
import React, { useEffect } from "react";
import ChannelHeader from "./_components/channelHeader";
import ChatInput from "./_components/chatInput";
import useGetMessages from "@/features/messages/hooks/useGetMessages";
import MessagesList from "@/components/messagesList";
import pusherClient from "@/lib/pusher-client";

interface ChannelPageProps {
  params: Promise<{
    workspaceId: string;
    channelId: string;
  }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = React.use(params);
  const { userState } = useCurrentUser((state) => state);
  const {
    currentChannelState: { channel, loading },
  } = useGetChannelById(userState.user?.id || "", channelId);
  const { currentChannelMessages, loading: messagesLoading } = useGetMessages(
    userState.user?.id || null,
    channelId,
    undefined,
    undefined
  );
  const { addNewMessage } = useCurrentMessages();

  useEffect(() => {
    if (channelId && userState.user?.id) {
      const pusherChannel = pusherClient.subscribe(channelId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pusherChannel.bind("incomming-message", (data: any) => {
        // the message is comming from another user
        if (data.memberId !== userState.user?.id) {
          addNewMessage(data);
        }
      });
    }
    return () => {
      pusherClient.unsubscribe(channelId);
    };
  }, [channelId, addNewMessage, userState]);
  if (loading || messagesLoading) {
    return (
      <div className=" h-full flex-1 flex items-center justify-center">
        <Loader className=" animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="tedxt-sm text-muted-foreground">
          {" "}
          channel not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <ChannelHeader channelName={channel.name} channelId={channel.id} />
      <MessagesList
        channelName={channel.name}
        channelCreationTime={channel.creationTime}
        data={currentChannelMessages.messages}
        loadMore={() => {}}
        isLoadingMore={false}
        canLoadMore={false}
        variant="channel"
      />
      <ChatInput
        channelId={channelId}
        placeholder={`Message # ${channel.name}`}
      />
    </div>
  );
}
