import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import {
  useCurrentMember,
  useCurrentMessages,
  useCurrentUser,
} from "@/state-store/store";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useCreateMessage from "../hooks/useCreateMessage";
import { triggerReplyEvent, uploadImageAction } from "@/utils/messages-actions";
import createNativeMessage from "@/lib/common-utils";
import Quill from "quill";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import useGetReplies from "../hooks/useGetReplies";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
interface ThreadProps {
  messageId: string;
  onClose: () => void;
  messageIndex: number | null;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

const TIME_THRESHOLD = 5;

export const Thread = ({ messageId, onClose, messageIndex }: ThreadProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, updateEditorKey] = useState(0);
  const { handleSubmit: createMessage, loading } = useCreateMessage();
  const {
    currentMemberState: { member },
  } = useCurrentMember();
  const {
    userState: { user },
  } = useCurrentUser();
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();
  const { currentChannelsMessages } = useCurrentMessages();
  const [editingId, setEditingId] = useState<string | null>(null);
  const {
    currentThreadMessages,
    getMoreMessages: loadMore,
    getMore,
    noMore,
  } = useGetReplies(messageId);

  // const {
  //   currentThreadData: { messages: currentThreadMessages },
  // } = useCurrentThreadData();
  const handleSubmit = async ({
    body,
    images,
    messageParentId,
  }: {
    body: string;
    images?: File[] | null;
    messageParentId: string;
  }) => {
    editorRef?.current?.enable(false);
    const uploadedImage = await uploadImageAction(images?.[0] || null);
    let imageId = undefined;
    if (uploadedImage) {
      imageId = uploadedImage.id;
    }
    const { message } = await createMessage(body, imageId, messageParentId);
    updateEditorKey((prev) => prev + 1);
    editorRef?.current?.enable(true);
    if (message && member && user) {
      const messageObject = createNativeMessage({
        message,
        member,
        user,
        URL: uploadedImage?.URL,
      });
      // addNewMessage(messageObject);
      console.log("I will trigger the reply event");
      triggerReplyEvent(messageObject);
    }
  };
  const currentMessage = useMemo(() => {
    console.log(channelId, messageId, messageIndex);
    if (
      channelId &&
      messageId &&
      messageIndex !== null &&
      messageIndex !== undefined
    ) {
      const message =
        currentChannelsMessages[channelId as string].messages[messageIndex];

      console.log(currentChannelsMessages[channelId as string]);
      // if (message?.id === messageId) {
      return message;
      // }
      // return null;
    }
    return null;
  }, [currentChannelsMessages, channelId, messageId, messageIndex]);

  const groupedMessages = currentThreadMessages?.reduce(
    (groups, message, currentIndex) => {
      const date = new Date(message?.creationTime || "");
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      if (message) message.messageIndex = currentIndex;
      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof currentThreadMessages>
  );

  if (!currentMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold ">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className=" size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex flex-col gap-y-2  h-full items-center justify-start">
          <AlertTriangle className=" size-5  text-muted-foreground " />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold ">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className=" size-5 stroke-[1.5]" />
        </Button>
      </div>
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
                      channelId={channelId as string}
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
                      hideThreadButton
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
                  if (entry.isIntersecting && !noMore && !getMore) {
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

        {getMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className=" relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          memberId={currentMessage.memberId}
          authorImage={currentMessage.user.image}
          authorName={currentMessage.user.name}
          isAuthor={currentMessage.memberId === userId}
          body={currentMessage.body}
          image={currentMessage.URL}
          createdAt={currentMessage.creationTime}
          updatedAt={currentMessage.updatedAt}
          id={currentMessage.id}
          reactions={currentMessage.reactions}
          isEditing={editingId === currentMessage.id}
          setEditingId={setEditingId}
          messageIndex={messageIndex as number}
          channelId={channelId as string}
          threadCount={currentMessage.threadCount}
          threadImage={currentMessage.threadImage}
          threadTimestamp={currentMessage.threadTimestamp}
          isCompact={false}
        />
      </div>
      <div className=" px-4">
        <Editor
          onSumbit={({ body, images }) => {
            handleSubmit({ body, images, messageParentId: messageId });
          }}
          disabled={loading}
          key={editorKey}
          innerRef={editorRef}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};
