import React from "react";
import dynamic from "next/dynamic";
import { format, isEqual, isToday, isYesterday } from "date-fns";
import { Hint } from "./ui/hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import useEditMessage from "@/features/messages/hooks/useUpdateMessage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useRemoveMessage from "@/features/messages/hooks/useDeleteMessage";
import useConfirm from "@/hooks/useConfirm";
import useToggleReaction from "@/features/reactions/useToggleReaction";
import Reactions from "./reactions";

import { triggertoggleReactionEvent } from "@/utils/reactions-actions";
import { useParams } from "next/navigation";
import {
  triggerDeleteMessageEvent,
  triggerEditMessageEvent,
} from "@/utils/messages-actions";
import ThreadBar from "./threadBar";
import { useCurrentThreadData } from "@/state-store/thread-messages";
import { useCurrentMemberProfile } from "@/state-store/member-profile.store";
import { useCurrentMember } from "@/state-store/member-store";
import { useCurrentConversationMessages } from "@/state-store/conversation-store";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
interface messageProps {
  parentMessageId: string | null | undefined;
  id: string;
  memberId: string;
  authorImage?: string | null;
  authorName: string | undefined | null;
  reactions: {
    value: string;
    count: number;
    membersIds: string[];
  }[];
  body: string;
  image?: string;
  updatedAt: Date | number;
  createdAt: Date | number;
  threadCount: number;
  threadImage: string | null | undefined;
  threadTimestamp: number | Date;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  isCompact: boolean;
  hideThreadButton: boolean;
  isAuthor: boolean;
  messageIndex: number;
  channelId: string;
  conversationId?: string | null;
}

const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMM d, yyyy")
  } at ${format(date, "h:mm:ss a ")}`;
};
function Message({
  parentMessageId: currentMessageParentMessageId,
  messageIndex,
  id,
  isAuthor,
  memberId,
  authorName = "Meber",
  body,
  createdAt,
  isCompact,
  hideThreadButton,
  reactions,
  isEditing,
  setEditingId,
  threadCount,
  threadImage,
  threadTimestamp,
  updatedAt,
  authorImage,
  image,
  channelId,
  conversationId,
}: messageProps) {
  const {
    updateParentMessageId,
    parentMessageId,
    updateParentMessageIndex,
    restData,
    parentMessageIndex,
  } = useCurrentThreadData();

  const { currentConversationId } = useCurrentConversationMessages();
  const { updateCurrentMemberProfileId } = useCurrentMemberProfile();
  const { handleSubmit: toggleReaction, error: toggleError } =
    useToggleReaction();
  const { workspaceId } = useParams();
  const {
    currentMemberState: { member },
  } = useCurrentMember();
  const { handleSubmit, loading: isEditingMessage, error } = useEditMessage();
  const {
    handleSubmit: handleDelete,
    error: deleteError,
    loading: isDeletingLoading,
  } = useRemoveMessage();

  const { ConfirmDialog, confirm } = useConfirm(
    "Delete message",
    "Are you sure ? this can not be undone "
  );
  const handleReaction = async (value: string) => {
    toggleReaction({ messageId: id, value });
    if (toggleError) {
      toast.error(toggleError);
    } else {
      triggertoggleReactionEvent({
        parentId: currentMessageParentMessageId,
        messageIndex,
        messageId: id,
        channelId,
        userId: member?.userId || "",
        value,
        workspaceId: workspaceId as string,
        conversationId: conversationId,
      });
    }
  };
  const handleDeleteMessage = async () => {
    const ok = await confirm();
    if (!ok) return;

    const deletedMessage = await handleDelete(id);
    if (!deleteError) {
      toast.success("message deleted successfully ");
      if (parentMessageId === deletedMessage.message?.id) {
        restData();
      }

      triggerDeleteMessageEvent(
        messageIndex,
        workspaceId as string,
        channelId,
        currentMessageParentMessageId as string,
        conversationId || currentConversationId,
        parentMessageIndex
      );
      // TODO :Close thread if opened
    } else {
      toast.error("something went wrong ");
    }
  };
  const hanleEditMessage = async ({ body }: { body: string }) => {
    const message = await handleSubmit(body, id);
    if (!error && message.message) {
      toast.success("Message Updated");
      // editMessage(messageIndex, body);
      triggerEditMessageEvent(
        messageIndex,
        message.message,
        currentMessageParentMessageId as string,
        conversationId as string
      );
    } else toast.error("Fail to update Message");
    setEditingId(null);
  };

  const avatarFallback = authorName?.charAt(0).toUpperCase();

  // when will we use compact
  // if the same user send a series of messages , only the first message will be not compact and the rest should be compact
  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]  ",
            isDeletingLoading && " opacity-50"
          )}
        >
          <div className=" flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  variant="update"
                  onSumbit={hanleEditMessage}
                  disabled={isEditingMessage}
                  defautValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex flex-col w-full ">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {!isEqual(updatedAt, createdAt) ? (
                  <span className=" text-xs text-muted-foreground">
                    {" "}
                    (edited)
                  </span>
                ) : (
                  <></>
                )}
                <Reactions
                  messageIndex={messageIndex}
                  data={reactions}
                  onChange={handleReaction}
                />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  onClick={() => {
                    if (
                      id !== parentMessageId &&
                      messageIndex !== parentMessageIndex
                    ) {
                      restData();
                      updateParentMessageId(id);
                      updateParentMessageIndex(messageIndex);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {
                if (
                  id !== parentMessageId &&
                  messageIndex !== parentMessageIndex
                ) {
                  restData();
                  updateParentMessageId(id);
                  updateParentMessageIndex(messageIndex);
                }
              }}
              handleDelete={handleDeleteMessage}
              hideThreadButton={hideThreadButton}
              handleReaction={handleReaction}
            />
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]  ",
            isDeletingLoading && " opacity-50"
          )}
        >
          <div className="flex items-start gap-2">
            <button onClick={() => updateCurrentMemberProfileId(memberId)}>
              <Avatar className=" rounded-md ">
                <AvatarImage
                  className="rounded-md"
                  src={authorImage || undefined}
                />
                <AvatarFallback className=" rounded-md bg-sky-500 text-white ">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </button>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  variant="update"
                  onSumbit={hanleEditMessage}
                  disabled={isEditingMessage}
                  defautValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex flex-col w-full overflow-hidden">
                <div className="text-sm">
                  <button
                    onClick={() => updateCurrentMemberProfileId(memberId)}
                    className=" font-bold text-primary hover:underline"
                  >
                    {authorName}
                  </button>
                  <span>&nbsp;&nbsp;</span>
                  <Hint label={formatFullTime(new Date(createdAt))}>
                    <button className="text-xs text-muted-foreground hover:underline">
                      {format(new Date(createdAt), "h:mm a ")}
                    </button>
                  </Hint>
                </div>
                <Renderer value={body} />
                <Thumbnail url={image} />
                {!isEqual(updatedAt, createdAt) ? (
                  <span className=" text-xs text-muted-foreground">
                    {" "}
                    (edited)
                  </span>
                ) : (
                  <p></p>
                )}
                <Reactions
                  messageIndex={messageIndex}
                  data={reactions}
                  onChange={handleReaction}
                />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  onClick={() => {
                    if (
                      id !== parentMessageId &&
                      messageIndex !== parentMessageIndex
                    ) {
                      restData();
                      updateParentMessageId(id);
                      updateParentMessageIndex(messageIndex);
                    }
                  }}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {
                restData();
                updateParentMessageId(id);
                updateParentMessageIndex(messageIndex);
              }}
              handleDelete={handleDeleteMessage}
              hideThreadButton={hideThreadButton}
              handleReaction={handleReaction}
            />
          )}
        </div>
      </>
    );
  }
}

export default Message;
