"use client";

import useGetChannelById from "@/features/channels/hooks/useGetChannelById";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";
import ChannelHeader from "./_components/channelHeader";
import ChatInput from "./_components/chatInput";
import useGetMessages from "@/features/messages/hooks/useGetMessages";
import MessagesList from "@/components/messagesList";
import usePusher from "@/features/channels/hooks/usePusher";

export default function ChannelPage() {
  const {
    currentChannelState: { channel, loading },
  } = useGetChannelById();
  const { currentChannelMessages, loading: messagesLoading } = useGetMessages(
    undefined,
    undefined
  );
  usePusher();
  if (loading || messagesLoading) {
    console.log(" Yess this is the problem", loading, messagesLoading);
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
      <ChannelHeader channelName={channel.name} />
      <MessagesList
        channelId={channel.id}
        channelName={channel.name}
        channelCreationTime={channel.creationTime}
        data={currentChannelMessages.messages}
        loadMore={() => {}}
        isLoadingMore={false}
        canLoadMore={false}
        variant="channel"
      />
      <ChatInput
        channelId={channel.id}
        placeholder={`Message # ${channel.name}`}
      />
    </div>
  );
}
