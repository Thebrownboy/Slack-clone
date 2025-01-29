import React from "react";
import { tFulldataMessage } from "@/types/common-types";
import { format, isToday, isYesterday } from "date-fns";
import Message from "./message";
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
}

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
}: MessageListProps) {
  const groupedMessages = data?.reduce((groups, message) => {
    const date = new Date(message?.creationTime || "");
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].unshift(message);

    return groups;
  }, {} as Record<string, typeof data>);
  return (
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
            {messages.map((message) => {
              if (message)
                return (
                  <Message
                    key={message.id}
                    id={message.id}
                    memberId={message?.memberId}
                    authorImage={message.user.image}
                    authorName={message.user.name}
                    reactions={message.reactions}
                    body={message.body}
                    image={message.URL}
                    updatedAt={message.updatedAt}
                    createAt={message.creationTime}
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadTimestamp={message.threadTimestamp}
                    setEditing={false}
                    setEditingId={() => {}}
                    isCompact={false}
                    hideThreadButton={false}
                    isAuthor={false}
                  />
                );
              else return <></>;
            })}
          </div>
        );
      })}
    </div>
  );
}
