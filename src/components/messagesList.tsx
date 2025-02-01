import React, { useState } from "react";
import { tFulldataMessage } from "@/types/common-types";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./message";
import ChannelHero from "./channelHero";
import { useParams } from "next/navigation";
import { useCurrentMember } from "@/state-store/store";
import { Loader } from "lucide-react";
interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: Date;
  variant?: "channel" | "thread" | "conversation";
  data: tFulldataMessage[] | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  channelId: string;
}

const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};
export default function MessagesList({
  canLoadMore,
  data,
  isLoadingMore,
  loadMore,
  channelCreationTime,
  channelName,
  memberImage,
  memberName,
  variant,
  channelId,
}: MessageListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const groupedMessages = data?.reduce((groups, message, currentIndex) => {
    const date = new Date(message?.creationTime || "");
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    if (message) message.messageIndex = currentIndex;
    groups[dateKey].unshift(message);

    return groups;
  }, {} as Record<string, typeof data>);
  const {
    currentMemberState: { member },
  } = useCurrentMember((state) => state);
  return (
    <>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => {
          return (
            <div key={dateKey}>
              <div className="text-center my-2 relative">
                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                <span className=" relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                  {formatDateLabel(dateKey)}
                </span>
              </div>
              {messages.map((message, index) => {
                const preveMessage = messages[index - 1];
                const isCompact =
                  preveMessage &&
                  preveMessage.user.id === message?.user.id &&
                  differenceInMinutes(
                    new Date(message.creationTime),
                    new Date(preveMessage.creationTime)
                  ) < TIME_THRESHOLD;

                if (message)
                  return (
                    <Message
                      channelId={channelId}
                      key={message.id}
                      id={message.id}
                      memberId={message?.memberId}
                      authorImage={message.user.image}
                      authorName={message.user.name}
                      reactions={message.reactions}
                      body={message.body}
                      image={message.URL}
                      updatedAt={message.updatedAt}
                      createdAt={message.creationTime}
                      threadCount={message.threadCount}
                      threadImage={message.threadImage}
                      threadTimestamp={message.threadTimestamp}
                      isEditing={editingId === message.id}
                      setEditingId={setEditingId}
                      isCompact={isCompact || false}
                      hideThreadButton={variant === "thread"}
                      isAuthor={member?.userId === message.user.id}
                      messageIndex={message.messageIndex as number}
                    />
                  );
                else return <></>;
              })}
            </div>
          );
        })}

        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);

              return () => observer.disconnect();
            }
          }}
        />

        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className=" relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        {variant === "channel" && channelName && channelCreationTime && (
          <ChannelHero
            name={channelName}
            creationTime={channelCreationTime}
          ></ChannelHero>
        )}
      </div>
    </>
  );
}
