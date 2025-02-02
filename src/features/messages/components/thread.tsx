import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import useGetChannelId from "@/hooks/useGetChannelId";
import useGetUserId from "@/hooks/useGetUserId";
import { useCurrentMessages } from "@/state-store/store";
import { AlertTriangle, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface ThreadProps {
  messageId: string;
  onClose: () => void;
  messageIndex: string;
}

export const Thread = ({ messageId, onClose, messageIndex }: ThreadProps) => {
  const { channelId } = useGetChannelId();
  const { userId } = useGetUserId();
  const { currentChannelsMessages } = useCurrentMessages();
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentMessage = useMemo(() => {
    if (channelId && messageId && messageIndex) {
      const message =
        currentChannelsMessages[channelId as string][+messageIndex];
      if (message?.id === messageId) {
        return message;
      }
      return null;
    }
    return null;
  }, [currentChannelsMessages, channelId, messageId, messageIndex]);

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
      <div>
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
          messageIndex={+messageIndex}
          channelId={channelId as string}
          threadCount={currentMessage.threadCount}
          threadImage={currentMessage.threadImage}
          threadTimestamp={currentMessage.threadTimestamp}
          isCompact={false}
        />
      </div>
    </div>
  );
};
