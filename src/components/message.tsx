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

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
interface messageProps {
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
}

const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMM d, YYYY")
  } at ${format(date, "h:mm:ss a ")}`;
};
function Message({
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
}: messageProps) {
  const { handleSubmit, loading: isEditingMessage, error } = useEditMessage();

  const hanleEditMessage = async ({ body }: { body: string }) => {
    await handleSubmit(body, id);
    if (!error) toast.success("Message Updated");
    else toast.error("Fail to update Message");
    setEditingId(null);
  };

  const avatarFallback = authorName?.charAt(0).toUpperCase();

  // when will we use compact
  // if the same user send a series of messages , only the first message will be not compact and the rest should be compact
  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]  "
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
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={() => {}}
            hideThreadButton={hideThreadButton}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleReaction={(emoji: any) => {}}
          />
        )}
      </div>
    );
  } else {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]  "
        )}
      >
        <div className="flex items-start gap-2">
          <button>
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
                  onClick={() => {}}
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
                <></>
              )}
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={() => {}}
            hideThreadButton={hideThreadButton}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleReaction={(emoji: any) => {}}
          />
        )}
      </div>
    );
  }
}

export default Message;
