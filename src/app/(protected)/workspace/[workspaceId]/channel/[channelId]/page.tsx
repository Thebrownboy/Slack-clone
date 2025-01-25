"use client";

import useGetChannelById from "@/features/channels/hooks/useGetChannelById";
import { useCurrentUser } from "@/state-store/store";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";
import ChannelHeader from "./_components/channelHeader";
import ChatInput from "./_components/chatInput";

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
  if (loading) {
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
      <div className="flex-1"></div>
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
}
